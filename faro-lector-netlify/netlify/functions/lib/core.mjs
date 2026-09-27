/* ==========================================================================
   Faro Lector · Núcleo de la API
   Se ejecuta en el servidor (Netlify Functions + Netlify Blobs) y, en modo
   demostración, dentro del navegador. Usa solo Web Crypto (PBKDF2, HMAC).
   Elaborado y diseñado por Ing. Cristóbal Apolinar.
   ========================================================================== */
function createApi(opts) {
  const store = opts.store;             // {get, set, del, list}
  const env = opts.env || {};
  const diag = opts.diag || { S: [], Q: [] };
  const analysisHtml = opts.analysisHtml || '';
  const callClaude = opts.callClaude || null;
  const queueAi = opts.queueAi || null;   // servidor: la IA corre en una función en segundo plano
  const now = opts.now || (() => Date.now());
  const PW_ITER = +(env.PW_ITER || 310000);
  const CODE_ITER = 20000;
  const enc = new TextEncoder();
  const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  /* ---------------- utilidades criptográficas ---------------- */
  const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  const unhex = h => new Uint8Array((h.match(/../g) || []).map(x => parseInt(x, 16)));
  const rand = n => { const u = new Uint8Array(n); crypto.getRandomValues(u); return u; };
  function b64u(bytes) { let s = ''; const u = new Uint8Array(bytes); for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(str) { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; const b = atob(str); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function safeEq(a, b) { a = String(a); b = String(b); let r = a.length ^ b.length; const n = Math.max(a.length, b.length); for (let i = 0; i < n; i++) r |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); return r === 0; }
  async function pbkdf2(pw, saltHex, iter) {
    const k = await crypto.subtle.importKey('raw', enc.encode(String(pw)), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(saltHex), iterations: iter }, k, 256));
  }
  async function sha(s) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(s))); }
  let hk = null;
  async function hkey() {
    if (!hk) {
      if (!env.SESSION_SECRET || String(env.SESSION_SECRET).length < 32) { const e = new Error('Falta configurar SESSION_SECRET (mínimo 32 caracteres) en Netlify.'); e.cfg = true; throw e; }
      hk = await crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    }
    return hk;
  }
  async function sign(payload) {
    const p = b64u(enc.encode(JSON.stringify(payload)));
    return p + '.' + b64u(await crypto.subtle.sign('HMAC', await hkey(), enc.encode(p)));
  }
  async function unsign(tok) {
    if (typeof tok !== 'string' || tok.length > 3000) return null;
    const [p, s] = tok.split('.'); if (!p || !s) return null;
    const exp = b64u(await crypto.subtle.sign('HMAC', await hkey(), enc.encode(p)));
    if (!safeEq(exp, s)) return null;
    let pl; try { pl = JSON.parse(new TextDecoder().decode(unb64u(p))); } catch { return null; }
    if (!pl || !pl.exp || pl.exp < now()) return null;
    return pl;
  }
  async function makePw(pw, iter) { const salt = hex(rand(16)); return { salt, iter, hash: await pbkdf2(pw, salt, iter) }; }
  async function checkPw(pw, rec) { if (!rec || typeof pw !== 'string') return false; return safeEq(await pbkdf2(pw, rec.salt, rec.iter), rec.hash); }
  function genCode() { const r = rand(8); let s = ''; for (let i = 0; i < 8; i++) { s += ALPHA[r[i] % ALPHA.length]; if (i === 3) s += '-'; } return s; }

  /* ---------------- utilidades de datos ---------------- */
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const clean = (s, max) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  const num = (v, a, b) => { v = +v; if (!isFinite(v)) return null; return Math.max(a, Math.min(b, v)); };
  const J = (status, body) => ({ status, body });
  const E = (status, error, message, extra) => J(status, Object.assign({ error, message }, extra || {}));
  const DIAG = new Map((diag.S || []).map(s => [String(s.id), s]));
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  function dimsOf(s) { const o = {}; for (const d of 'LGIC') { const ks = (diag.Q || []).filter(q => q.dim === d).map(q => q.k); o[d] = 100 * mean(ks.map(k => s.ans[k])); } return o; }
  const REF = (() => {
    const S = diag.S || []; const groups = {};
    const agg = arr => ({ cal: mean(arr.map(s => s.pts / 9)), dims: Object.fromEntries([...'LGIC'].map(d => [d, mean(arr.map(s => dimsOf(s)[d]))])), n: arr.length });
    [...new Set(S.map(s => s.g))].forEach(g => groups[g] = agg(S.filter(s => s.g === g)));
    return { school: S.length ? agg(S) : null, groups };
  })();

  const DEF = { freeReg: true, selfSignup: true, gateHash: '', aiEnabled: true, aiPerHour: 40, epoch: 1, quotes: null, school: 'Secundaria General N.º 20' };
  async function settings() { return Object.assign({}, DEF, (await store.get('settings')) || {}); }
  async function index() {
    let ix = await store.get('index');
    if (!ix) {
      ix = { v: 1, nextId: 1000, users: {} };
      for (const s of (diag.S || [])) ix.users[s.id] = { id: String(s.id), name: s.name, g: s.g, src: 'diag', created: now() };
      await store.set('index', ix);
    }
    return ix;
  }
  async function audit(type, detail) {
    const a = (await store.get('audit')) || [];
    a.push({ t: now(), type, d: clean(detail, 200) });
    await store.set('audit', a.slice(-400));
  }
  async function limit(key, max, win) {
    const k = 'rl/' + key; const t = now(); const r = await store.get(k);
    const v = r && r.reset > t ? r : { n: 0, reset: t + win };
    v.n++; await store.set(k, v); return v.n <= max;
  }
  function pwProblem(pw, role, name) {
    if (typeof pw !== 'string') return 'Escribe una contraseña.';
    const min = role === 'admin' ? 10 : 6;
    if (pw.length < min) return `La contraseña debe tener al menos ${min} caracteres.`;
    if (pw.length > 128) return 'La contraseña es demasiado larga.';
    if (/^(.)\1+$/.test(pw)) return 'No repitas el mismo carácter.';
    const common = ['123456', '1234567', '12345678', '123456789', '1234567890', 'qwerty', 'qwerty123', 'password', 'contraseña', 'contrasena', 'abc123', '111111', '000000', '654321', 'asdfgh', 'secundaria', 'escuela', 'tecnologia', 'iloveyou', 'mexico'];
    if (common.includes(norm(pw))) return 'Esa contraseña es demasiado común. Inventa otra.';
    if (/^\d+$/.test(pw) && pw.length < 8) return 'Si usas solo números, que sean al menos 8.';
    if (/^(0123|1234|2345|3456|4567|5678|6789|abcd)/i.test(pw) && pw.length < 9) return 'Evita secuencias como 1234 o abcd.';
    const parts = norm(name).split(/\s+/).filter(w => w.length >= 4);
    if (parts.some(w => norm(pw).includes(w))) return 'No uses tu nombre dentro de la contraseña.';
    if (role === 'admin' && !(/[a-z]/i.test(pw) && /\d/.test(pw))) return 'La contraseña de administrador debe combinar letras y números.';
    return null;
  }
  async function gateOk(st, gate) { if (!st.gateHash) return true; if (!gate) return false; return safeEq(await sha('gate:' + norm(gate)), st.gateHash); }
  async function issue(sub, role, tv) {
    const st = await settings();
    const ttl = role === 'admin' ? 4 * 3600e3 : 10 * 3600e3;
    return sign({ sub: String(sub), role, tv, ep: st.epoch, scope: 'app', iat: now(), exp: now() + ttl });
  }
  async function auth(headers, role) {
    const h = headers.authorization || headers.Authorization || '';
    const pl = await unsign(h.startsWith('Bearer ') ? h.slice(7) : '');
    if (!pl || pl.scope !== 'app') return null;
    if (role && pl.role !== role) return null;
    const st = await settings(); if (pl.ep !== st.epoch) return null;
    if (pl.role === 'admin') { const a = await store.get('admin'); if (!a || a.tv !== pl.tv) return null; }
    else { const p = await store.get('pw/' + pl.sub); if (!p || p.tv !== pl.tv) return null; const ix = await index(); if (!ix.users[pl.sub]) return null; }
    return pl;
  }
  async function setStudentPw(id, pw) {
    const rec = await makePw(pw, PW_ITER);
    const doc = Object.assign(rec, { tv: hex(rand(6)), fails: 0, lock: 0, set: now() });
    await store.set('pw/' + id, doc); await store.del('init/' + id);
    return doc;
  }
  function publicUser(u) { return { id: u.id, name: u.name, g: u.g, src: u.src }; }
  function sanitizeSession(r) {
    r = r || {}; const dims = {};
    for (const d of 'LGIC') dims[d] = r.dims && r.dims[d] != null ? num(r.dims[d], 0, 100) : null;
    return {
      date: now(), text: clean(r.text, 140), kind: clean(r.kind, 50), src: clean(r.src, 50), preset: clean(r.preset, 20),
      cal: num(r.cal, 0, 10) || 0, n: Math.round(num(r.n, 1, 40) || 1), dims, before: num(r.before, 0, 10) || 0,
      ppm: r.ppm ? Math.round(num(r.ppm, 0, 1500)) : null, mins: num(r.mins, 0, 600) || 0, hints: Math.round(num(r.hints, 0, 40) || 0),
      open3: Math.round(num(r.open3, 0, 10) || 0), words: Math.round(num(r.words, 0, 900000) || 0), own: !!r.own,
      lv: clean(r.lv, 2), plan: clean(r.plan, 2)
    };
  }

  /* ---------------- rutas ---------------- */
  async function route(method, path, body, headers, ipk) {
    const st = await settings();

    if (method === 'GET' && path === '/config') {
      return J(200, { school: st.school, gate: !!st.gateHash, selfSignup: st.selfSignup, freeReg: st.freeReg, ai: !!(st.aiEnabled && (callClaude || queueAi)), adminReady: !!(await store.get('admin')), demo: !!env.DEMO, quotes: st.quotes });
    }

    if (method === 'POST' && path === '/roster') {
      if (!(await limit('roster:' + ipk, 90, 3600e3))) return E(429, 'rate', 'Demasiadas solicitudes. Espera unos minutos.');
      if (!(await gateOk(st, body.gate))) return E(403, 'gate', 'El código de acceso de la escuela no es correcto.');
      const ix = await index();
      return J(200, { students: Object.values(ix.users).map(publicUser) });
    }

    if (method === 'POST' && path === '/login') {
      if (!(await limit('login:' + ipk, 40, 15 * 60e3))) return E(429, 'rate', 'Demasiados intentos desde este equipo. Espera 15 minutos.');
      if (!(await gateOk(st, body.gate))) return E(403, 'gate', 'El código de acceso de la escuela no es correcto.');
      const id = clean(body.id, 20); const ix = await index(); const u = ix.users[id];
      if (!u) return E(404, 'nouser', 'No encontré a ese estudiante.');
      const pw = typeof body.password === 'string' ? body.password : '';
      const p = await store.get('pw/' + id);
      if (p) {
        if (!pw) return J(200, { status: 'password' });
        if (p.lock > now()) return E(423, 'locked', `Cuenta bloqueada por intentos fallidos. Intenta en ${Math.ceil((p.lock - now()) / 60e3)} min o pide ayuda a tu profesor.`);
        if (!(await checkPw(pw, p))) {
          p.fails = (p.fails || 0) + 1; let msg = `Contraseña incorrecta. Te quedan ${5 - p.fails} intentos.`;
          if (p.fails >= 5) { p.lock = now() + 15 * 60e3; p.fails = 0; msg = 'Contraseña incorrecta. Por seguridad, la cuenta se bloqueó 15 minutos.'; await audit('bloqueo', `${u.name} (${u.g})`); }
          await store.set('pw/' + id, p); return E(401, 'badpw', msg);
        }
        if (p.fails) { p.fails = 0; await store.set('pw/' + id, p); }
        return J(200, { status: 'ok', token: await issue(id, 'student', p.tv), user: publicUser(u) });
      }
      const init = await store.get('init/' + id);
      if (init && init.exp > now()) {
        if (!pw) return J(200, { status: 'needCode' });
        if (init.lock > now()) return E(423, 'locked', 'Demasiados intentos con el código. Espera 15 minutos.');
        if (!(await checkPw(pw.toUpperCase().replace(/\s/g, ''), init))) {
          init.fails = (init.fails || 0) + 1; if (init.fails >= 5) { init.lock = now() + 15 * 60e3; init.fails = 0; }
          await store.set('init/' + id, init); return E(401, 'badcode', 'Ese código de inicio no es correcto.');
        }
        return J(200, { status: 'setup', setupToken: await sign({ sub: id, scope: 'setup', vc: 1, exp: now() + 15 * 60e3 }) });
      }
      if (st.freeReg) return J(200, { status: 'setup', setupToken: await sign({ sub: id, scope: 'setup', vc: 0, exp: now() + 15 * 60e3 }) });
      return E(403, 'nocode', 'Aún no tienes contraseña. Pide a tu profesor tu código de inicio.');
    }

    if (method === 'POST' && path === '/setup') {
      const pl = await unsign(body.setupToken);
      if (!pl || pl.scope !== 'setup') return E(401, 'expired', 'El tiempo para crear tu contraseña terminó. Vuelve a seleccionar tu nombre.');
      const ix = await index(); const u = ix.users[pl.sub]; if (!u) return E(404, 'nouser', 'No encontré a ese estudiante.');
      if (await store.get('pw/' + pl.sub)) return E(409, 'exists', 'Esta cuenta ya tiene contraseña.');
      const init = await store.get('init/' + pl.sub);
      if (!pl.vc && ((init && init.exp > now()) || !st.freeReg)) return E(403, 'nocode', 'Necesitas el código de inicio de tu profesor.');
      const prob = pwProblem(body.password, 'student', u.name); if (prob) return E(400, 'weak', prob);
      const doc = await setStudentPw(pl.sub, body.password);
      await audit('registro', `${u.name} (${u.g})${pl.vc ? ' con código' : ''}`);
      return J(200, { status: 'ok', token: await issue(pl.sub, 'student', doc.tv), user: publicUser(u) });
    }

    if (method === 'POST' && path === '/signup') {
      if (!st.selfSignup) return E(403, 'closed', 'El registro de nuevos estudiantes está cerrado. Pide a tu profesor que te agregue.');
      if (!(await gateOk(st, body.gate))) return E(403, 'gate', 'El código de acceso de la escuela no es correcto.');
      if (!(await limit('signup:' + ipk, 6, 3600e3))) return E(429, 'rate', 'Demasiados registros desde este equipo. Intenta más tarde.');
      const name = clean(body.name, 80), g = clean(body.g, 14).toUpperCase();
      if (name.length < 5 || !/\p{L}{2,}.*\s+.*\p{L}{2,}/u.test(name)) return E(400, 'name', 'Escribe tu nombre completo (nombre y apellidos).');
      if (!g) return E(400, 'group', 'Escribe tu grupo.');
      const ix = await index();
      if (Object.values(ix.users).some(x => norm(x.name) === norm(name) && x.g === g)) return E(409, 'dup', 'Ya existe un estudiante con ese nombre en ese grupo. Búscate en la lista.');
      const prob = pwProblem(body.password, 'student', name); if (prob) return E(400, 'weak', prob);
      const id = String(ix.nextId++); ix.users[id] = { id, name, g, src: 'self', created: now() }; await store.set('index', ix);
      const doc = await setStudentPw(id, body.password); await audit('alta', `${name} (${g}) se registró`);
      return J(200, { status: 'ok', token: await issue(id, 'student', doc.tv), user: publicUser(ix.users[id]) });
    }

    /* ---------- estudiante autenticado ---------- */
    if (path === '/me' || path.startsWith('/me/') || path === '/ai' || path === '/ai/poll') {
      const pl = await auth(headers);
      if (!pl) return E(401, 'auth', 'Tu sesión terminó. Vuelve a entrar.');
      if (path === '/ai/poll') {
        const id = clean(body.id, 40); const job = id ? await store.get('job/' + id) : null;
        if (!job || job.sub !== pl.sub) return E(404, 'nojob', 'No encontré esa solicitud.');
        if (job.status === 'done') { await store.del('job/' + id); return J(200, { status: 'done', text: job.text }); }
        if (job.status === 'error' || now() - job.created > 6 * 60e3) { await store.del('job/' + id); return E(502, 'upstream', 'Claude no respondió en este momento. Intenta de nuevo.'); }
        return J(200, { status: job.status });
      }
      if (path === '/ai') {
        if (!st.aiEnabled || !(callClaude || queueAi)) return E(503, 'noai', 'La inteligencia artificial no está activada.');
        if (!(await limit('ai:' + pl.sub, pl.role === 'admin' ? 300 : st.aiPerHour, 3600e3))) return E(429, 'rate', 'Alcanzaste el límite de consultas a Claude por esta hora. Sigue leyendo y vuelve más tarde.');
        const prompt = typeof body.prompt === 'string' ? body.prompt.slice(0, 60000) : '';
        if (prompt.length < 5) return E(400, 'prompt', 'Solicitud vacía.');
        const tier = ['quick', 'default', 'complex'].includes(body.tier) ? body.tier : 'default';
        if (queueAi) {
          const jid = hex(rand(12));
          await store.set('job/' + jid, { sub: pl.sub, status: 'pending', prompt, tier, maxTokens: body.json ? 8000 : 3000, created: now() });
          try { await queueAi(jid); } catch (e) { await store.del('job/' + jid); return E(502, 'upstream', 'No se pudo iniciar la consulta a Claude.'); }
          return J(200, { job: jid });
        }
        try { const text = await callClaude({ prompt, tier, maxTokens: body.json ? 8000 : 3000 }); return J(200, { text }); }
        catch (e) { return E(502, 'upstream', 'Claude no respondió en este momento. Intenta de nuevo.'); }
      }
      if (pl.role !== 'student') return E(403, 'role', 'Solo para estudiantes.');
      const ix = await index(); const u = ix.users[pl.sub];
      if (method === 'GET' && path === '/me') {
        const d = DIAG.get(u.id); let rank = null;
        if (d && u.src === 'diag') { const S = diag.S; rank = { group: 1 + S.filter(x => x.g === d.g && x.pts > d.pts).length, groupN: S.filter(x => x.g === d.g).length, schoolPct: Math.round(100 * S.filter(x => x.pts < d.pts).length / S.length) }; }
        return J(200, { user: publicUser(u), diag: u.src === 'diag' ? (d || null) : null, rank, ref: { school: REF.school, group: REF.groups[u.g] || null }, sessions: (await store.get('s/' + u.id)) || [], quotes: st.quotes });
      }
      if (method === 'POST' && path === '/me/session') {
        if (!(await limit('sess:' + u.id, 80, 24 * 3600e3))) return E(429, 'rate', 'Límite diario de sesiones alcanzado.');
        const list = (await store.get('s/' + u.id)) || []; list.push(sanitizeSession(body.rec));
        await store.set('s/' + u.id, list.slice(-300)); return J(200, { sessions: list.slice(-300) });
      }
      if (method === 'POST' && path === '/me/password') {
        const p = await store.get('pw/' + u.id);
        if (!(await checkPw(body.current, p))) return E(401, 'badpw', 'Tu contraseña actual no es correcta.');
        const prob = pwProblem(body.password, 'student', u.name); if (prob) return E(400, 'weak', prob);
        const doc = await setStudentPw(u.id, body.password);
        return J(200, { token: await issue(u.id, 'student', doc.tv) });
      }
      return E(404, 'route', 'Ruta no encontrada.');
    }

    /* ---------- administrador ---------- */
    if (method === 'POST' && path === '/admin/login') {
      if (!(await limit('adm:' + ipk, 12, 15 * 60e3))) return E(429, 'rate', 'Demasiados intentos. Espera 15 minutos.');
      const a = await store.get('admin');
      if (!a) {
        if (!env.ADMIN_SETUP_CODE) return E(503, 'cfg', 'Falta configurar ADMIN_SETUP_CODE en Netlify.');
        if (!body.setupCode) return J(200, { status: 'needSetup' });
        if (!safeEq(String(body.setupCode), String(env.ADMIN_SETUP_CODE))) { await audit('admin-fallo', 'Código de instalación incorrecto'); return E(401, 'badcode', 'El código de instalación no es correcto.'); }
        const prob = pwProblem(body.password, 'admin', ''); if (prob) return E(400, 'weak', prob);
        const doc = Object.assign(await makePw(body.password, PW_ITER), { tv: hex(rand(6)), fails: 0, lock: 0 });
        await store.set('admin', doc); await audit('admin', 'Cuenta de administrador creada');
        return J(200, { status: 'ok', token: await issue('admin', 'admin', doc.tv) });
      }
      if (!body.password) return J(200, { status: 'password' });
      if (a.lock > now()) return E(423, 'locked', `Acceso de administrador bloqueado. Intenta en ${Math.ceil((a.lock - now()) / 60e3)} min.`);
      if (!(await checkPw(body.password, a))) {
        a.fails = (a.fails || 0) + 1; if (a.fails >= 5) { a.lock = now() + 30 * 60e3; a.fails = 0; }
        await store.set('admin', a); await audit('admin-fallo', 'Contraseña de administrador incorrecta');
        return E(401, 'badpw', 'Contraseña incorrecta.');
      }
      if (a.fails) { a.fails = 0; await store.set('admin', a); }
      await audit('admin', 'Inicio de sesión del administrador');
      return J(200, { status: 'ok', token: await issue('admin', 'admin', a.tv) });
    }

    if (path.startsWith('/admin/')) {
      const pl = await auth(headers, 'admin');
      if (!pl) return E(401, 'auth', 'Tu sesión de administrador terminó. Vuelve a entrar.');
      const ix = await index();

      if (method === 'GET' && path === '/admin/overview') {
        const [pwk, ink, sk] = await Promise.all([store.list('pw/'), store.list('init/'), store.list('s/')]);
        const pws = new Set(pwk.map(k => k.slice(3))), inits = new Set(ink.map(k => k.slice(5)));
        const sessions = {}; await Promise.all(sk.map(async k => { const id = k.slice(2); if (ix.users[id]) sessions[id] = (await store.get(k)) || []; }));
        const users = Object.values(ix.users).map(u => Object.assign(publicUser(u), { created: u.created, hasPw: pws.has(u.id), hasInit: inits.has(u.id) }));
        const s = Object.assign({}, st); s.gate = !!s.gateHash; delete s.gateHash;
        return J(200, { users, sessions, diag: diag.S, settings: s, audit: ((await store.get('audit')) || []).slice(-200).reverse() });
      }
      if (method === 'GET' && path === '/admin/analysis') return J(200, { html: analysisHtml });

      if (method === 'POST' && path === '/admin/users') {
        const op = body.op; const id = clean(body.id, 20); const u = ix.users[id];
        if (op === 'add') {
          const name = clean(body.name, 80), g = clean(body.g, 14).toUpperCase();
          if (name.length < 5) return E(400, 'name', 'Escribe nombre y apellidos.'); if (!g) return E(400, 'group', 'Escribe el grupo.');
          if (Object.values(ix.users).some(x => norm(x.name) === norm(name) && x.g === g)) return E(409, 'dup', 'Ese estudiante ya existe en ese grupo.');
          const nid = String(ix.nextId++); ix.users[nid] = { id: nid, name, g, src: 'admin', created: now() }; await store.set('index', ix);
          let code = null; if (body.code) { code = genCode(); await store.set('init/' + nid, Object.assign(await makePw(code, CODE_ITER), { exp: now() + 30 * 86400e3, fails: 0 })); }
          await audit('alta', `${name} (${g}) agregado por el administrador`);
          return J(200, { user: ix.users[nid], code });
        }
        if (!u) return E(404, 'nouser', 'No encontré a ese estudiante.');
        if (op === 'edit') {
          const name = clean(body.name, 80), g = clean(body.g, 14).toUpperCase();
          if (name.length < 5 || !g) return E(400, 'data', 'Nombre o grupo no válidos.');
          const was = `${u.name} (${u.g})`; u.name = name; u.g = g; if (u.src === 'diag' && body.keepDiag === false) u.src = 'admin';
          await store.set('index', ix); await audit('edición', `${was} → ${name} (${g})`); return J(200, { user: u });
        }
        if (op === 'delete') {
          delete ix.users[id]; await store.set('index', ix);
          await Promise.all([store.del('pw/' + id), store.del('init/' + id), store.del('s/' + id)]);
          await audit('baja', `${u.name} (${u.g}) eliminado`); return J(200, { ok: true });
        }
        if (op === 'resetpw') {
          await store.del('pw/' + id); let code = null;
          if (body.code !== false) { code = genCode(); await store.set('init/' + id, Object.assign(await makePw(code, CODE_ITER), { exp: now() + 30 * 86400e3, fails: 0 })); }
          else await store.del('init/' + id);
          await audit('restablecer', `${u.name} (${u.g})`); return J(200, { code });
        }
        if (op === 'setpw') {
          const prob = pwProblem(body.password, 'student', u.name); if (prob) return E(400, 'weak', prob);
          await setStudentPw(id, body.password); await audit('contraseña', `Asignada por el administrador a ${u.name} (${u.g})`); return J(200, { ok: true });
        }
        if (op === 'unlock') { const p = await store.get('pw/' + id); if (p) { p.lock = 0; p.fails = 0; await store.set('pw/' + id, p); } return J(200, { ok: true }); }
        if (op === 'clearsessions') { await store.del('s/' + id); await audit('historial', `Borrado el historial de ${u.name}`); return J(200, { ok: true }); }
        return E(400, 'op', 'Operación no válida.');
      }

      if (method === 'POST' && path === '/admin/codes') {
        const ids = (Array.isArray(body.ids) ? body.ids : []).map(x => clean(x, 20)).filter(x => ix.users[x]).slice(0, 400);
        const force = !!body.force; const out = [];
        for (const id of ids) {
          if (!force && await store.get('pw/' + id)) continue;
          if (force) await store.del('pw/' + id);
          const code = genCode();
          await store.set('init/' + id, Object.assign(await makePw(code, CODE_ITER), { exp: now() + 30 * 86400e3, fails: 0 }));
          out.push({ id, name: ix.users[id].name, g: ix.users[id].g, code });
        }
        await audit('códigos', `${out.length} códigos de inicio generados`);
        return J(200, { codes: out });
      }

      if (method === 'POST' && path === '/admin/settings') {
        const cur = (await store.get('settings')) || {};
        for (const k of ['freeReg', 'selfSignup', 'aiEnabled']) if (typeof body[k] === 'boolean') cur[k] = body[k];
        if (body.aiPerHour != null) cur.aiPerHour = Math.round(num(body.aiPerHour, 5, 500) || 40);
        if (typeof body.school === 'string' && body.school.trim()) cur.school = clean(body.school, 80);
        if (typeof body.gateCode === 'string') cur.gateHash = body.gateCode.trim() ? await sha('gate:' + norm(body.gateCode)) : '';
        if (body.quotes === null) cur.quotes = null;
        else if (Array.isArray(body.quotes)) cur.quotes = body.quotes.slice(0, 120).map(q => ({ t: clean(q && q.t, 320), a: clean(q && q.a, 80) })).filter(q => q.t.length > 3);
        if (body.logoutAll) cur.epoch = ((cur.epoch || 1) + 1);
        await store.set('settings', cur); await audit('ajustes', body.logoutAll ? 'Se cerraron todas las sesiones' : 'Ajustes actualizados');
        const s = Object.assign({}, DEF, cur); s.gate = !!s.gateHash; delete s.gateHash;
        return J(200, { settings: s, token: body.logoutAll ? await issue('admin', 'admin', (await store.get('admin')).tv) : undefined });
      }

      if (method === 'POST' && path === '/admin/password') {
        const a = await store.get('admin');
        if (!(await checkPw(body.current, a))) return E(401, 'badpw', 'La contraseña actual no es correcta.');
        const prob = pwProblem(body.password, 'admin', ''); if (prob) return E(400, 'weak', prob);
        const doc = Object.assign(await makePw(body.password, PW_ITER), { tv: hex(rand(6)), fails: 0, lock: 0 });
        await store.set('admin', doc); await audit('admin', 'Contraseña de administrador cambiada');
        return J(200, { token: await issue('admin', 'admin', doc.tv) });
      }
      return E(404, 'route', 'Ruta no encontrada.');
    }
    return E(404, 'route', 'Ruta no encontrada.');
  }

  return {
    async handle(req) {
      try {
        const ipk = (await sha('ip:' + (req.ip || 'x') + ':' + (env.SESSION_SECRET || ''))).slice(0, 20);
        const body = req.body && typeof req.body === 'object' ? req.body : {};
        const headers = {}; for (const k in (req.headers || {})) headers[k.toLowerCase()] = req.headers[k];
        return await route(req.method, req.path, body, headers, ipk);
      } catch (e) {
        if (e && e.cfg) return E(500, 'cfg', e.message);
        return E(500, 'server', 'Ocurrió un error en el servidor.');
      }
    },
    _test: { pwProblem, genCode }
  };
}

export { createApi };
