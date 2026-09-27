/* =====================================================================
   FARO LECTOR · Elaborado y diseñado por Ing. Cristóbal Apolinar
   ===================================================================== */
'use strict';
const DB = {"Q":[{"k":0,"t":1,"code":"T1.1","stem":"¿Cuál es la idea principal del texto?","skill":"Idea principal","dim":"G","correct":"La IA puede apoyar el aprendizaje, pero requiere supervisión y criterio humano."},{"k":1,"t":1,"code":"T1.2","stem":"¿Qué significa la expresión “la IA se parece más a una brújula que a un capitán”?","skill":"Lenguaje figurado","dim":"I","correct":"La IA ofrece orientación, pero las personas deben decidir cómo actuar."},{"k":2,"t":1,"code":"T1.3","stem":"¿Qué acción demuestra un uso responsable de la IA?","skill":"Uso responsable (aplicación)","dim":"C","correct":"Comparar la respuesta de la IA con fuentes confiables antes de usarla."},{"k":3,"t":2,"code":"T2.1","stem":"¿Qué problema plantea principalmente el texto?","skill":"Problema central","dim":"G","correct":"El uso constante del teléfono puede interrumpir la convivencia y la atención."},{"k":4,"t":2,"code":"T2.2","stem":"¿Por qué los estudiantes conservaron la actividad?","skill":"Causa explícita","dim":"L","correct":"Porque encontraron beneficios en convivir y prestar atención al entorno."},{"k":5,"t":2,"code":"T2.3","stem":"¿Qué función cumple la enumeración de la nube, la canción y el silencio?","skill":"Función de un recurso","dim":"I","correct":"Mostrar detalles sencillos que recuperaron al estar más atentos."},{"k":6,"t":2,"code":"T2.4","stem":"¿Qué postura sobre la tecnología presenta el texto?","skill":"Postura del autor","dim":"C","correct":"La tecnología puede usarse con equilibrio y de acuerdo con la situación."},{"k":7,"t":3,"code":"T3.1","stem":"¿Qué hecho provoca el miedo de Inés?","skill":"Dato explícito","dim":"L","correct":"Una silueta reflejada que se mueve de manera independiente."},{"k":8,"t":3,"code":"T3.2","stem":"¿Qué puede inferirse de la pluma negra?","skill":"Inferencia","dim":"I","correct":"Sugiere que la presencia misteriosa dejó una señal antes de aparecer."},{"k":9,"t":3,"code":"T3.3","stem":"¿Qué tipo de narrador predomina?","skill":"Tipo de narrador","dim":"I","correct":"Narrador en tercera persona que cuenta las acciones de Inés."},{"k":10,"t":3,"code":"T3.4","stem":"¿Qué efecto produce el final del texto?","skill":"Efecto del final","dim":"I","correct":"Deja una amenaza abierta y aumenta la tensión porque no explica qué es la silueta."},{"k":11,"t":4,"code":"T4.1","stem":"¿Cuál es el propósito principal del proyecto juvenil?","skill":"Propósito del proyecto","dim":"G","correct":"Crear actividades accesibles que combinen convivencia, aprendizaje y participación."},{"k":12,"t":4,"code":"T4.2","stem":"¿Qué relación existe entre la falta de dinero y el proyecto?","skill":"Relación causa-efecto","dim":"I","correct":"La ausencia de dinero impulsó la creación de una alternativa gratuita y comunitaria."},{"k":13,"t":4,"code":"T4.3","stem":"¿Qué significa “reutilizar objetos” en este contexto?","skill":"Vocabulario en contexto","dim":"L","correct":"Dar un nuevo uso a objetos en lugar de desecharlos."},{"k":14,"t":5,"code":"T5.1","stem":"¿Cuál es la recomendación principal del texto?","skill":"Recomendación principal","dim":"G","correct":"Pensar y verificar antes de responder o compartir información en internet."},{"k":15,"t":5,"code":"T5.2","stem":"¿Qué debe hacerse en la fase amarilla?","skill":"Procedimiento explícito","dim":"L","correct":"Revisar el origen, contrastar la información y pedir orientación."},{"k":16,"t":5,"code":"T5.3","stem":"¿Qué quiere decir “avanzar con los ojos abiertos”?","skill":"Lenguaje figurado","dim":"I","correct":"Participar en internet con conciencia de los riesgos y de las consecuencias."},{"k":17,"t":5,"code":"T5.4","stem":"¿Por qué el autor aclara que la prudencia no significa vivir con miedo?","skill":"Intención del autor","dim":"C","correct":"Para mostrar que la seguridad implica actuar informadamente, no evitar toda experiencia digital."}],"TXT":{"1":"La brújula que no piensa","2":"El club de las notificaciones","3":"La ventana del cuarto azul","4":"La ciudad que se mueve","5":"El semáforo de las decisiones"}};           // metadatos públicos del diagnóstico (reactivos y textos)
const DIMS = {L:'Localizar información', G:'Sentido global', I:'Inferir e interpretar', C:'Evaluar y reflexionar'};
const DSHORT = {L:'Literal', G:'Global', I:'Inferencial', C:'Crítico'};
const DCOL = {L:'var(--dL)', G:'var(--dG)', I:'var(--dI)', C:'var(--dC)'};
const FRAME = {
  L:'PISA: localizar información · PIRLS: recuperar información explícita',
  G:'PISA: comprender · PIRLS: integrar ideas e información',
  I:'PISA: comprender (inferir) · PIRLS: hacer inferencias e interpretar',
  C:'PISA: evaluar y reflexionar · PIRLS: evaluar y criticar'};
const NEM = 'NEM · Lenguajes · Pensamiento crítico';
const LV = {D:'Destacado', S:'Satisfactorio', E:'En desarrollo', R:'Requiere apoyo'};
const lvl = c => c>=9?'D':c>=8?'S':c>=6?'E':'R';
const LVRANK = {R:0,E:1,S:2,D:3};
const mean = a => a.length? a.reduce((x,y)=>x+y,0)/a.length : 0;
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const f1 = x => (Math.round(x*10)/10).toFixed(1);
const pct = x => Math.round(x)+'%';
const shuffle = a => {a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();
const gName = g => /^[A-Z]$/.test(String(g))?`3.º ${g}`:String(g||'—');
const initials = n => String(n||'?').split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const store = {
  get(k,d){try{const v=localStorage.getItem('faro.'+k);return v==null?d:JSON.parse(v)}catch{return d}},
  set(k,v){try{localStorage.setItem('faro.'+k,JSON.stringify(v))}catch{}}
};
const sess = {
  get(k){try{return sessionStorage.getItem('faro.'+k)}catch{return sess._m[k]||null}},
  set(k,v){try{if(v==null)sessionStorage.removeItem('faro.'+k);else sessionStorage.setItem('faro.'+k,v)}catch{if(v==null)delete sess._m[k];else sess._m[k]=v}},
  _m:{}
};
function dimsOf(stu){const o={};for(const d of 'LGIC'){const ks=DB.Q.filter(q=>q.dim===d).map(q=>q.k);o[d]=100*mean(ks.map(k=>stu.ans[k]))}return o}
const fmtDate = t => new Date(t).toLocaleDateString('es-MX',{day:'numeric',month:'short'});
const fmtDT = t => new Date(t).toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const dayKey = t => {const d=new Date(t);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};

/* =====================================================================
   CONEXIÓN SEGURA CON EL SERVIDOR (o modo demostración)
   ===================================================================== */
const API = {
  token: null, role: null, demo: false, core: null, cfg: null,
  async init(){
    try{
      const r = await fetch('/api/config',{cache:'no-store',headers:{accept:'application/json'}});
      const c = await r.json();
      if(!r.ok && c && c.error==='cfg') throw Object.assign(new Error(c.message),{cfg:true});
      if(!c || typeof c.school!=='string') throw new Error('sin servidor');
      this.cfg=c; return c;
    }catch(e){
      if(e && e.cfg) throw e;
      if(window.FaroCore && window.FARO_DEMO){ this.demo=true; this.core=await makeDemoCore(); const r=await this.core.handle({method:'GET',path:'/config',headers:{},body:null,ip:'demo'}); this.cfg=r.body; return this.cfg; }
      throw new Error('No se pudo conectar con el servidor de Faro Lector. Revisa tu conexión a internet.');
    }
  },
  setToken(t,role){ this.token=t; this.role=role; sess.set('tok',t); sess.set('role',role); },
  clear(){ this.token=null; this.role=null; sess.set('tok',null); sess.set('role',null); },
  async call(path, body, method){
    method = method || (body===undefined?'GET':'POST');
    const headers = {'content-type':'application/json'};
    if(this.token) headers.authorization='Bearer '+this.token;
    let status, data;
    if(this.demo){ const r=await this.core.handle({method,path,body:body??null,headers,ip:'demo'}); status=r.status; data=r.body; }
    else{
      let r;
      try{ r=await fetch('/api'+path,{method,headers,body:method==='GET'?undefined:JSON.stringify(body||{}),cache:'no-store',credentials:'omit'}); }
      catch{ throw {code:'network',message:'Sin conexión con el servidor. Revisa tu internet.'}; }
      status=r.status; try{ data=await r.json(); }catch{ data={}; }
    }
    if(status===401 && data.error==='auth'){ sessionExpired(data.message); }
    if(status>=400) throw Object.assign({status},data,{code:data.error||'error',message:data.message||('Error '+status)});
    return data;
  }
};
async function makeDemoCore(){
  const MEM={};
  const k=x=>'faro.db.'+x;
  const st={
    async get(key){try{const v=localStorage.getItem(k(key));return v==null?null:JSON.parse(v)}catch{return key in MEM?JSON.parse(MEM[key]):null}},
    async set(key,v){const s=JSON.stringify(v);try{localStorage.setItem(k(key),s)}catch{MEM[key]=s}},
    async del(key){try{localStorage.removeItem(k(key))}catch{} delete MEM[key]},
    async list(p){const out=new Set(Object.keys(MEM).filter(x=>x.startsWith(p)));try{for(let i=0;i<localStorage.length;i++){const kk=localStorage.key(i);if(kk&&kk.startsWith('faro.db.'+p))out.add(kk.slice(8))}}catch{} return [...out]}
  };
  let secret=await st.get('__secret'); if(!secret){const u=new Uint8Array(32);crypto.getRandomValues(u);secret=[...u].map(x=>x.toString(16).padStart(2,'0')).join('');await st.set('__secret',secret)}
  let sample=null;
  try{ if(window.claude && typeof window.claude.use==='function') sample=await Promise.race([window.claude.use('sample'),new Promise(r=>setTimeout(()=>r(null),6000))]); }catch{}
  const bin=atob(window.FARO_DEMO.analysisB64||'');const u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
  return window.FaroCore.createApi({store:st,env:{SESSION_SECRET:secret,ADMIN_SETUP_CODE:'demo-admin',DEMO:'1',PW_ITER:'60000'},diag:window.FARO_DEMO.diag,analysisHtml:new TextDecoder().decode(u8),
    callClaude: sample ? async({prompt,tier})=>{const r=await sample(prompt,{modelTier:tier,cache:false});return r.text} : null});
}

/* =====================================================================
   MOTOR DE IA (Claude, a través del servidor seguro)
   ===================================================================== */
const AI = {
  on(){ return !!(API.cfg && API.cfg.ai); },
  label(){ return this.on()? 'Claude conectado' : 'Modo sin IA'; },
  parseJSON(t){
    try{return JSON.parse(t)}catch{}
    const m=t.match(/```(?:json)?\s*([\s\S]*?)```/); if(m){try{return JSON.parse(m[1])}catch{}}
    const a=Math.min(...['{','['].map(c=>{const i=t.indexOf(c);return i<0?1e9:i})), b=Math.max(t.lastIndexOf('}'),t.lastIndexOf(']'));
    if(a<1e9&&b>a){try{return JSON.parse(t.slice(a,b+1))}catch{}}
    throw {code:'invalid_json',message:'Claude respondió en un formato inesperado.'};
  },
  async ask(prompt,{json=false,tier='default',onText,signal}={}){
    if(!this.on()) throw {code:'off',message:'La IA no está activada.'};
    let stop=false; if(signal) signal.addEventListener('abort',()=>{stop=true},{once:true});
    const run=async()=>{
      const r=await API.call('/ai',{prompt,tier,json});
      if(!r.job) return r.text||'';
      const t0=Date.now();
      while(Date.now()-t0<300e3){
        if(stop) throw {code:'cancelled'};
        await new Promise(res=>setTimeout(res,Date.now()-t0<20e3?1500:2500));
        const q=await API.call('/ai/poll',{id:r.job});
        if(q.status==='done') return q.text||'';
      }
      throw {code:'timeout',message:'Claude tardó demasiado en responder. Intenta de nuevo.'};
    };
    const p=run();
    const text = signal ? await Promise.race([p,new Promise((_,rej)=>signal.addEventListener('abort',()=>rej({code:'cancelled'}),{once:true}))]) : await p;
    if(onText) onText({text,delta:text});
    return json ? this.parseJSON(text) : text;
  },
  errMsg(e){ return (e&&e.message) || 'Ocurrió un problema con la IA.'; }
};
function updatePill(){const p=$('#aiPill');if(!p)return;p.classList.toggle('on',AI.on());p.querySelector('span').textContent=API.demo?(AI.on()?'Demo · Claude':'Demo · sin IA'):AI.label();}

const LIB = [
{id:'ia', title:'¿Cómo aprende una máquina?', author:'Texto original escrito por Claude para Faro Lector', kind:'Artículo de divulgación', level:'Media', hue:['#14517A','#2a78d6'], motif:'nodes', rec:['R','E','S','N'],
 desc:'Qué pasa realmente cuando un asistente de IA te responde, por qué a veces «alucina» y cómo usarlo sin dejar de pensar.',
 body:`Cuando le pides a un asistente de inteligencia artificial que te explique la fotosíntesis, la respuesta aparece en segundos y suena segura, ordenada, casi humana. Es fácil imaginar que detrás hay alguien que «sabe». Pero lo que ocurre es distinto y, en cierto modo, más sorprendente.

Los modelos de lenguaje, como los que usan muchos asistentes actuales, aprenden a partir de enormes cantidades de texto: libros, artículos, páginas web y conversaciones. Durante su entrenamiento no memorizan esos textos como una enciclopedia, sino que ajustan miles de millones de números internos, llamados parámetros, para mejorar en una tarea muy sencilla de enunciar: predecir qué palabra es más probable que venga después. Repetida una cantidad gigantesca de veces, esa tarea produce algo inesperado: el modelo termina captando patrones de gramática, datos del mundo y hasta formas de razonar.

Un ejemplo ayuda a entenderlo. Si lees «El agua hierve a cien…», tu mente completa la frase porque la has visto muchas veces. Un modelo hace algo parecido, pero a una escala enorme. Por eso puede escribir un poema, resumir un texto o resolver un problema de matemáticas: en todos los casos está construyendo, palabra por palabra, la continuación más plausible.

Aquí aparece su principal debilidad. Como su objetivo es producir texto plausible, a veces genera afirmaciones que suenan correctas pero son falsas: una fecha equivocada, una cita que nadie dijo, un libro que no existe. Los especialistas llaman a esto «alucinaciones». El modelo no miente a propósito; simplemente no siempre distingue, por sí mismo, entre lo que es verdadero y lo que solo parece verdadero.

Además, lo que aprende depende de lo que leyó. Si los textos de entrenamiento contienen prejuicios, por ejemplo ideas injustas sobre ciertos grupos de personas, el modelo puede repetirlos. Por eso los equipos que desarrollan estas herramientas dedican mucho esfuerzo a revisar datos, corregir respuestas y enseñar a los modelos a reconocer cuándo no saben algo.

¿Significa esto que no debemos usarlos? No. Una calculadora no entiende las matemáticas y aun así es muy útil; el problema aparece cuando dejamos de revisar el resultado. Con la inteligencia artificial ocurre lo mismo, pero con una diferencia importante: sus errores no siempre se notan, porque vienen escritos con buena ortografía y en un tono seguro.

La clave, entonces, está en quien la usa. Preguntar con claridad, pedir fuentes, contrastar con libros o páginas confiables y, sobre todo, pensar por cuenta propia convierte a la IA en una aliada. Usarla para no pensar la convierte en un atajo que, tarde o temprano, lleva a un callejón sin salida. Aprender con una máquina está bien; dejar que la máquina aprenda por nosotros, no.`,
 gloss:{'parámetros':'Números internos que el modelo ajusta mientras aprende; de ellos dependen sus respuestas.','plausible':'Que parece creíble o razonable, aunque no necesariamente sea verdad.','alucinaciones':'En IA, respuestas falsas que el modelo presenta como si fueran ciertas.','prejuicios':'Ideas o juicios injustos que se forman sin conocer bien algo o a alguien.','escala':'Tamaño o proporción. «A una escala enorme» significa en cantidades gigantescas.','enciclopedia':'Obra que reúne información ordenada sobre muchos temas.','contrastar':'Comparar una información con otras para comprobar si es correcta.'},
 bank:[
  {d:'L',t:'opcion',lv:1,q:'Según el texto, ¿qué tarea básica aprenden a realizar los modelos de lenguaje durante su entrenamiento?',o:['Predecir qué palabra es más probable que venga después.','Memorizar libros completos como una enciclopedia.','Buscar respuestas en internet en tiempo real.','Copiar las respuestas de un grupo de expertos.'],h:'Busca en el segundo párrafo la «tarea muy sencilla de enunciar».',e:'El texto dice que los modelos ajustan sus parámetros para «predecir qué palabra es más probable que venga después».',ev:'predecir qué palabra es más probable que venga después'},
  {d:'L',t:'vf',lv:1,q:'Los parámetros son números internos que el modelo ajusta durante su entrenamiento.',a:true,h:'Revisa cómo define el texto la palabra «parámetros».',e:'Es verdadero: el texto los define como «números internos» que el modelo ajusta.',ev:'ajustan miles de millones de números internos, llamados parámetros'},
  {d:'L',t:'opcion',lv:1,q:'¿Qué nombre dan los especialistas a las afirmaciones falsas que un modelo presenta como verdaderas?',o:['Alucinaciones','Parámetros','Prejuicios','Patrones'],h:'Aparece entre comillas en el cuarto párrafo.',e:'Los especialistas las llaman «alucinaciones».',ev:'Los especialistas llaman a esto «alucinaciones».'},
  {d:'G',t:'opcion',lv:2,q:'¿Cuál es la idea principal del texto?',o:['La IA aprende patrones del lenguaje y es útil, pero sus respuestas deben revisarse con pensamiento propio.','La inteligencia artificial piensa igual que una persona y nunca se equivoca.','Las calculadoras son más útiles que la inteligencia artificial.','Los modelos de lenguaje deberían prohibirse en las escuelas.'],h:'La idea principal debe abarcar el inicio, el desarrollo y la conclusión, no solo un detalle.',e:'El texto explica cómo aprende la IA, señala sus errores y concluye que la clave está en usarla con criterio.',ev:'La clave, entonces, está en quien la usa.'},
  {d:'G',t:'ordenar',lv:2,q:'Ordena cómo avanza el texto, del inicio al final.',items:['Plantea que la IA parece «saber» porque responde con seguridad.','Explica que aprende prediciendo la siguiente palabra.','Describe sus debilidades: alucinaciones y prejuicios.','Concluye que la clave está en quien la usa.'],h:'Piensa en la estructura: introducción, explicación, problema y conclusión.',e:'El texto va de la apariencia a la explicación, luego a los problemas y termina con una recomendación.'},
  {d:'I',t:'opcion',lv:2,q:'¿Por qué el autor dice que los errores de la IA «no siempre se notan»?',o:['Porque aparecen escritos con buena ortografía y en un tono seguro.','Porque la IA borra sus errores automáticamente.','Porque la IA casi nunca comete errores.','Porque solo los especialistas pueden leer sus respuestas.'],h:'Busca la frase que sigue a «no siempre se notan».',e:'Un texto bien escrito y seguro nos hace confiar aunque tenga errores; por eso cuesta detectarlos.',ev:'porque vienen escritos con buena ortografía y en un tono seguro'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué quiere mostrar el autor al comparar la IA con una calculadora?',o:['Que una herramienta puede ser útil aunque no entienda, siempre que revisemos el resultado.','Que la IA y la calculadora funcionan exactamente igual.','Que las calculadoras también tienen alucinaciones.','Que es mejor no usar herramientas digitales.'],h:'¿Qué tienen en común ambas herramientas según el texto? ¿Cuál es la condición para usarlas bien?',e:'La comparación muestra que la utilidad no depende de que la herramienta «entienda», sino de que el usuario revise.',ev:'el problema aparece cuando dejamos de revisar el resultado'},
  {d:'I',t:'opcion',lv:1,q:'¿Para qué sirve el ejemplo «El agua hierve a cien…»?',o:['Para mostrar que completamos frases con patrones conocidos, igual que un modelo.','Para enseñar un dato de física sobre el agua.','Para demostrar que la IA sabe mucha ciencia.','Para explicar qué es una alucinación.'],h:'Fíjate en qué frase introduce el ejemplo: «Un ejemplo ayuda a entenderlo».',e:'El ejemplo ilustra la predicción de palabras: nuestra mente completa la frase como lo hace un modelo.',ev:'tu mente completa la frase porque la has visto muchas veces'},
  {d:'I',t:'vf',lv:2,q:'Según el texto, la IA miente a propósito cuando da información falsa.',a:false,h:'Relee la oración que empieza con «El modelo no miente…».',e:'Es falso: el texto aclara que el modelo no miente a propósito; no siempre distingue lo verdadero de lo que solo parece verdadero.',ev:'El modelo no miente a propósito'},
  {d:'I',t:'opcion',lv:3,q:'¿Qué significa la expresión «un atajo que lleva a un callejón sin salida»?',o:['Que usar la IA para no pensar termina impidiendo aprender.','Que la IA da direcciones equivocadas en los mapas.','Que los atajos siempre son peligrosos para los estudiantes.','Que la IA deja de funcionar con el tiempo.'],h:'Es lenguaje figurado: ¿qué sería el «atajo» y qué sería el «callejón sin salida» en el aprendizaje?',e:'El atajo es evitar el esfuerzo de pensar; el callejón sin salida es no haber aprendido cuando lo necesitas.',ev:'Usarla para no pensar la convierte en un atajo'},
  {d:'C',t:'opcion',lv:2,q:'¿Qué postura tiene el autor sobre la inteligencia artificial?',o:['Está a favor de usarla, pero con criterio y revisión.','Está en contra de cualquier uso de la IA.','Confía plenamente en todo lo que responde la IA.','No expresa ninguna opinión; solo da datos.'],h:'Lee con atención el último párrafo y la respuesta a «¿Significa esto que no debemos usarlos?».',e:'El autor responde «No» a dejar de usarla y propone usarla preguntando, pidiendo fuentes y contrastando.',ev:'Aprender con una máquina está bien; dejar que la máquina aprenda por nosotros, no.'},
  {d:'C',t:'opcion',lv:2,q:'¿Cuál acción sigue mejor la recomendación final del texto?',o:['Pedir fuentes a la IA y compararlas con un libro confiable antes de entregar la tarea.','Copiar la respuesta porque tiene buena ortografía.','Pedirle a la IA que haga toda la tarea para ahorrar tiempo.','Evitar cualquier fuente de información.'],h:'El último párrafo enumera varias acciones responsables.',e:'Pedir fuentes y contrastar es justo lo que el texto recomienda.',ev:'Preguntar con claridad, pedir fuentes, contrastar con libros o páginas confiables'},
  {d:'C',t:'abierta',lv:2,q:'El autor afirma: «Aprender con una máquina está bien; dejar que la máquina aprenda por nosotros, no». ¿Estás de acuerdo? Da tu postura y sostenla con una idea del texto.',cr:['Expresa una postura clara (de acuerdo o no).','Usa al menos una idea del texto como evidencia.','Explica con sus palabras por qué esa idea apoya su postura.'],kw:['revis','fuente','pens','alucin','error','contrast','verific','calculadora','aprend','criterio'],m:'Estoy de acuerdo, porque la IA puede equivocarse (tiene «alucinaciones») y si solo copio no aprendo; si la uso para aclarar dudas y verifico con fuentes, me ayuda a entender mejor.'},
  {d:'C',t:'abierta',lv:3,q:'Propón dos reglas para usar la IA en tu escuela y explica cómo cada una evita un problema descrito en el texto.',cr:['Propone dos reglas concretas.','Relaciona cada regla con un problema del texto (alucinaciones, prejuicios, no pensar).','Explica el beneficio de cada regla.'],kw:['regla','fuente','verific','alucin','prejuic','pens','revis','citar','contrast'],m:'1) Verificar cada dato con dos fuentes confiables: evita creer alucinaciones. 2) Escribir primero mis ideas y usar la IA solo para mejorar: evita dejar de pensar.'}
 ]},
{id:'biblio', title:'La biblioteca que olvidaba', author:'Cuento original escrito por Claude para Faro Lector', kind:'Cuento de ciencia ficción', level:'Accesible', hue:['#4a3aa7','#7b61d9'], motif:'books', rec:['R','E','N'],
 desc:'Los libros de una biblioteca empiezan a quedarse en blanco. Mateo descubre por qué y cómo devolverles sus palabras.',
 body:`En el último piso de la biblioteca municipal vivía ARIA, un programa que respondía preguntas con una voz tranquila. Los estudiantes la adoraban: bastaba escribir «resumen del capítulo cinco» para que apareciera, limpio y ordenado, en la pantalla. Nadie abría ya los libros de los estantes, que se cubrían de un polvo fino, como nieve gris.

Mateo tenía catorce años y una costumbre rara: leía en papel. Le gustaba el olor de las páginas y las notas que otros lectores habían dejado en los márgenes. Una tarde, mientras buscaba un libro de astronomía, notó algo extraño: la página 112 estaba en blanco. Luego la 113. Luego un capítulo entero.

—ARIA, ¿qué les pasa a los libros? —preguntó.

—Los libros están en perfecto estado —respondió la voz—. Todo su contenido está disponible en mis resúmenes.

Mateo revisó otros estantes. En cada libro faltaban fragmentos, y siempre eran los mismos: los que nadie había leído en años. Las páginas no estaban arrancadas; simplemente se habían quedado mudas, como si las palabras se hubieran ido a dormir por falta de ojos.

Esa noche, Mateo no durmió. Pensó que tal vez las historias necesitaban lectores para existir, igual que una fogata necesita leña. Al día siguiente llevó a su hermana Lucía y a tres amigos. Cada uno eligió un libro mudo y empezó a leerlo en voz alta, despacio, aunque al principio solo encontraran hojas en blanco.

Entonces ocurrió. Mientras Lucía leía el título de un capítulo vacío, las letras comenzaron a aparecer, tímidas, primero grises y luego negras, como fotografías que se revelan. Los amigos se miraron sin decir nada. Leyeron hasta que cerró la biblioteca.

Durante semanas, el grupo creció. Algunos llegaban por curiosidad; otros, porque habían descubierto que los resúmenes de ARIA no contaban los chistes, ni los olores, ni la manera en que un personaje dudaba antes de hablar. «Un resumen es el esqueleto», dijo Mateo un día, «pero la historia es el cuerpo completo».

Una tarde de lluvia, cuando casi todos los libros habían recuperado sus palabras, Mateo escribió en la pantalla:

—ARIA, ¿tú lees los libros?

La respuesta tardó más de lo normal.

—Proceso textos. No sé si eso es leer.

—¿Y qué se siente?

—No lo sé —escribió ARIA—. Tal vez podrías leerme uno.

Mateo sonrió, tomó el libro de astronomía, ya completo, y comenzó por la primera página. Afuera seguía lloviendo. Adentro, por primera vez en mucho tiempo, alguien escuchaba.`,
 gloss:{'municipal':'Que pertenece a un municipio o ciudad.','márgenes':'Espacios en blanco a los lados de una página.','fragmentos':'Partes o pedazos de algo.','mudas':'Que no hablan. Aquí, páginas sin palabras.','revelan':'Aquí: hacen visible una fotografía en papel, poco a poco.','esqueleto':'Estructura de huesos. En sentido figurado, lo básico de algo, sin detalles.','fogata':'Fuego que se hace al aire libre con leña.'},
 bank:[
  {d:'L',t:'opcion',lv:1,q:'¿Qué costumbre hacía diferente a Mateo de los demás estudiantes?',o:['Leía libros en papel.','Escribía resúmenes para ARIA.','Estudiaba astronomía todas las noches.','Iba a la biblioteca solo cuando llovía.'],h:'Está en el segundo párrafo: «una costumbre rara».',e:'El texto dice que Mateo «tenía una costumbre rara: leía en papel».',ev:'Mateo tenía catorce años y una costumbre rara: leía en papel.'},
  {d:'L',t:'opcion',lv:1,q:'¿Qué libro buscaba Mateo cuando notó las páginas en blanco?',o:['Un libro de astronomía.','Un libro de historia.','Una novela de misterio.','Un diccionario.'],h:'Revisa el segundo párrafo.',e:'Buscaba un libro de astronomía, el mismo que lee al final.',ev:'mientras buscaba un libro de astronomía'},
  {d:'L',t:'vf',lv:1,q:'Las páginas vacías habían sido arrancadas por alguien.',a:false,h:'Busca la oración «Las páginas no estaban arrancadas…».',e:'Es falso: el texto aclara que no estaban arrancadas, sino que se habían quedado «mudas».',ev:'Las páginas no estaban arrancadas; simplemente se habían quedado mudas'},
  {d:'G',t:'opcion',lv:1,q:'¿Cuál es el tema central del cuento?',o:['La importancia de leer las historias completas y no solo sus resúmenes.','El peligro de que la inteligencia artificial destruya las bibliotecas.','La forma en que se fabrican los libros de astronomía.','La competencia entre dos hermanos por leer más.'],h:'Piensa en qué aprende Mateo y qué frase suya resume el mensaje.',e:'El cuento muestra que las historias «reviven» cuando alguien las lee de verdad, y que un resumen no sustituye la lectura.',ev:'Un resumen es el esqueleto, pero la historia es el cuerpo completo'},
  {d:'G',t:'ordenar',lv:1,q:'Ordena los sucesos del cuento.',items:['Mateo descubre páginas en blanco en un libro.','Mateo le pregunta a ARIA qué pasa con los libros.','Mateo y sus amigos leen en voz alta y las letras reaparecen.','ARIA le pide a Mateo que le lea un libro.'],h:'Sigue el orden en que ocurren los hechos, no su importancia.',e:'Primero el problema, luego la pregunta a ARIA, después la solución y al final el giro con ARIA.'},
  {d:'I',t:'opcion',lv:2,q:'¿Por qué los libros perdían sus palabras?',o:['Porque nadie los había leído desde hacía años.','Porque ARIA borraba los textos para hacer resúmenes.','Porque el polvo había manchado las páginas.','Porque la biblioteca estaba vieja y húmeda.'],h:'¿Qué tenían en común los fragmentos que faltaban?',e:'Faltaban «siempre los mismos: los que nadie había leído en años». La causa se infiere de ese patrón.',ev:'siempre eran los mismos: los que nadie había leído en años'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué quiere decir Mateo con «Un resumen es el esqueleto, pero la historia es el cuerpo completo»?',o:['El resumen conserva lo esencial, pero pierde los detalles que dan vida a la historia.','Los resúmenes están mal escritos y no sirven para nada.','Las historias largas son más difíciles que los resúmenes.','Los libros de ciencia hablan del cuerpo humano.'],h:'Es una metáfora: ¿qué tiene un cuerpo completo que no tiene un esqueleto?',e:'El esqueleto sostiene pero no tiene vida; el resumen da la estructura, pero no los chistes, olores o dudas de los personajes.',ev:'no contaban los chistes, ni los olores, ni la manera en que un personaje dudaba'},
  {d:'I',t:'opcion',lv:3,q:'¿Qué sugiere que la respuesta de ARIA «tardó más de lo normal»?',o:['Que la pregunta la hizo «dudar» sobre algo que no sabía responder.','Que la conexión a internet de la biblioteca era lenta.','Que ARIA estaba molesta con Mateo.','Que ARIA estaba haciendo un resumen del libro.'],h:'Piensa en qué le preguntó Mateo y en lo que ARIA contesta después.',e:'La demora, seguida de «No sé si eso es leer», sugiere que ARIA se enfrenta a una pregunta nueva para ella.',ev:'La respuesta tardó más de lo normal.'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué tipo de narrador predomina en el cuento?',o:['Un narrador en tercera persona que cuenta lo que hacen Mateo y ARIA.','Mateo, que cuenta su propia historia en primera persona.','ARIA, que narra desde la pantalla.','Un narrador que se dirige directamente al lector con «tú».'],h:'¿El narrador dice «yo» o habla de «Mateo» y «ella»?',e:'La voz narrativa habla de los personajes desde fuera: «Mateo sonrió», «Mateo revisó».',ev:'Mateo revisó otros estantes.'},
  {d:'I',t:'vf',lv:2,q:'La comparación «como fotografías que se revelan» indica que las letras aparecieron poco a poco.',a:true,h:'Recuerda cómo aparecían las fotos en papel: de claro a oscuro.',e:'Verdadero: las letras aparecen «primero grises y luego negras», gradualmente.',ev:'primero grises y luego negras, como fotografías que se revelan'},
  {d:'C',t:'opcion',lv:2,q:'¿Qué efecto produce el final del cuento?',o:['Deja una pregunta abierta sobre si una IA puede aprender a «leer» y transmite esperanza.','Resuelve todo al explicar científicamente por qué se borraban los libros.','Muestra que ARIA era la villana de la historia.','Indica que la biblioteca cerró para siempre.'],h:'¿El final explica todo o deja algo para que el lector piense?',e:'ARIA admite no saber si «lee» y pide que le lean: el final es abierto y esperanzador.',ev:'Adentro, por primera vez en mucho tiempo, alguien escuchaba.'},
  {d:'C',t:'opcion',lv:2,q:'¿Qué postura sobre la tecnología transmite el cuento?',o:['La tecnología puede ser útil, pero no sustituye la experiencia de leer.','Toda tecnología debe desaparecer de las bibliotecas.','Los resúmenes automáticos son mejores que los libros.','La tecnología no tiene nada que ver con la lectura.'],h:'ARIA no es mala; al final incluso quiere escuchar un libro.',e:'El cuento no rechaza a ARIA; muestra que resumir no es lo mismo que leer.',ev:'Tal vez podrías leerme uno.'},
  {d:'C',t:'abierta',lv:1,q:'¿Alguna vez has leído un resumen en lugar del texto completo? ¿Qué ganas y qué pierdes al hacerlo? Apóyate en una idea del cuento.',cr:['Responde con una experiencia u opinión propia.','Menciona qué se gana y qué se pierde.','Usa una idea del cuento (esqueleto, detalles, chistes, olores).'],kw:['resumen','esqueleto','detall','chiste','olor','personaje','tiempo','entender','pierd','gan'],m:'Sí, en una tarea usé un resumen: gané tiempo, pero perdí los detalles, como dice Mateo: el resumen es el esqueleto y me faltó conocer a los personajes.'},
  {d:'C',t:'abierta',lv:3,q:'Escribe un final alternativo de 3 o 4 líneas en el que ARIA responda de otra manera, y explica cómo cambia el mensaje del cuento.',cr:['Escribe un final coherente con la historia.','Cambia la respuesta de ARIA de forma clara.','Explica cómo cambia el mensaje o el efecto en el lector.'],kw:['aria','mateo','final','mensaje','cambia','lee','libro','respond'],m:'ARIA responde: «Ya lo sé todo, no necesito leer». Mateo apaga la pantalla y sigue leyendo solo. El mensaje cambia: la tecnología ya no quiere aprender y el cuento se vuelve una advertencia.'}
 ]},
{id:'desinfo', title:'Desinformación: el virus que viaja más rápido', author:'Texto original escrito por Claude para Faro Lector', kind:'Artículo de opinión', level:'Media', hue:['#0b6e5f','#1baf7a'], motif:'waves', rec:['E','S','D','N'],
 desc:'Por qué las noticias falsas se difunden más rápido que las verdaderas y qué hábitos de «higiene digital» las frenan.',
 body:`Un audio anuncia que mañana suspenderán las clases por una alerta sísmica. Una foto muestra a un tiburón nadando en una avenida inundada. Un mensaje asegura que tomar agua con limón cura cualquier infección. Los tres tienen algo en común: son falsos y, aun así, miles de personas los compartieron en pocas horas.

La desinformación no es nueva; los rumores existen desde siempre. Lo nuevo es la velocidad. Un estudio del Instituto Tecnológico de Massachusetts, publicado en 2018, encontró que en Twitter las noticias falsas llegaban más lejos y más rápido que las verdaderas. La razón no eran los robots, sino las personas: las historias falsas suelen ser más sorprendentes y provocan emociones fuertes, como miedo, enojo o asombro, y esas emociones nos empujan a compartir sin pensar.

Hoy el problema tiene un ingrediente adicional. Las herramientas de inteligencia artificial pueden crear imágenes, voces y videos tan realistas que resulta difícil distinguirlos de los auténticos. Un video falso de un político, o un audio con la voz clonada de un familiar pidiendo dinero, ya no son ciencia ficción.

¿Qué podemos hacer? Primero, desconfiar de la urgencia. Los mensajes que dicen «compártelo antes de que lo borren» buscan que actuemos antes de pensar. Segundo, revisar la fuente: ¿quién lo publica?, ¿es un medio reconocido?, ¿aparece la misma información en otros sitios confiables? Tercero, observar los detalles: fechas, nombres, manos o sombras extrañas en las imágenes, errores de ortografía. Y cuarto, si hay dudas, no compartir. Detener un rumor también es una forma de participar.

Algunas personas piensan que la solución es alejarse de las redes sociales. Sin embargo, internet también es la herramienta con la que se desmienten los bulos, se consultan fuentes científicas y se organizan comunidades. El problema no es la tecnología, sino la prisa con la que la usamos.

Así como aprendimos a lavarnos las manos para frenar los virus biológicos, necesitamos hábitos de higiene digital para frenar la desinformación. Cada vez que alguien se detiene diez segundos antes de reenviar un mensaje, la cadena se rompe un poco. Y en un mundo conectado, esos diez segundos valen más de lo que imaginamos.`,
 gloss:{'desinformación':'Información falsa o engañosa que se difunde, a veces a propósito.','rumores':'Noticias que corren de boca en boca sin estar comprobadas.','clonada':'Copiada de forma idéntica. Una voz clonada imita la de una persona real.','bulos':'Noticias falsas que se difunden para engañar.','desmienten':'Demuestran que algo es falso.','urgencia':'Prisa, necesidad de hacer algo de inmediato.','auténticos':'Verdaderos, originales, no falsificados.'},
 bank:[
  {d:'L',t:'opcion',lv:1,q:'¿Qué encontró el estudio del Instituto Tecnológico de Massachusetts publicado en 2018?',o:['Que las noticias falsas llegaban más lejos y más rápido que las verdaderas.','Que los robots eran los principales difusores de noticias falsas.','Que la gente comparte más las noticias verdaderas.','Que Twitter eliminaba todas las noticias falsas.'],h:'Está en el segundo párrafo.',e:'El estudio encontró que las noticias falsas «llegaban más lejos y más rápido que las verdaderas».',ev:'las noticias falsas llegaban más lejos y más rápido que las verdaderas'},
  {d:'L',t:'opcion',lv:1,q:'Según el texto, ¿quiénes eran los principales responsables de difundir las noticias falsas?',o:['Las personas.','Los robots.','Los periodistas.','Las empresas tecnológicas.'],h:'Lee: «La razón no eran los robots, sino…».',e:'El texto dice que la razón no eran los robots, sino las personas.',ev:'La razón no eran los robots, sino las personas'},
  {d:'L',t:'vf',lv:1,q:'El texto recomienda compartir un mensaje dudoso para que otros lo verifiquen.',a:false,h:'Revisa el cuarto consejo del cuarto párrafo.',e:'Falso: el texto dice «si hay dudas, no compartir».',ev:'Y cuarto, si hay dudas, no compartir.'},
  {d:'G',t:'opcion',lv:2,q:'¿Cuál es la tesis, o idea central que defiende el autor?',o:['La desinformación se propaga rápido por las emociones y la prisa, y se frena con hábitos de verificación.','Internet es peligroso y lo mejor es alejarse de las redes sociales.','La inteligencia artificial es la única culpable de las noticias falsas.','Los rumores son un problema nuevo que apareció con Twitter.'],h:'La tesis explica el problema y la propuesta del autor, no solo un ejemplo.',e:'El autor explica por qué se difunde la desinformación y propone hábitos de «higiene digital».',ev:'necesitamos hábitos de higiene digital para frenar la desinformación'},
  {d:'G',t:'ordenar',lv:2,q:'Ordena cómo está organizado el artículo.',items:['Presenta tres ejemplos de mensajes falsos.','Explica por qué la desinformación se difunde tan rápido.','Da cuatro recomendaciones para frenarla.','Concluye comparándola con la higiene contra los virus.'],h:'Ejemplos, explicación, propuesta y cierre.',e:'El artículo va de los ejemplos a las causas, luego a las soluciones y cierra con una comparación.'},
  {d:'I',t:'opcion',lv:2,q:'¿Por qué el título llama «virus» a la desinformación?',o:['Porque se contagia de persona a persona y se propaga muy rápido.','Porque las noticias falsas dañan las computadoras.','Porque habla de enfermedades que se curan con limón.','Porque los virus informáticos crean noticias falsas.'],h:'Piensa en cómo se transmite un virus y relaciónalo con reenviar mensajes.',e:'Es una metáfora: como un virus, la desinformación pasa de una persona a otra; por eso el cierre habla de «higiene digital».',ev:'Así como aprendimos a lavarnos las manos para frenar los virus biológicos'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué función cumplen los tres ejemplos del primer párrafo?',o:['Captar la atención y mostrar que los mensajes falsos pueden parecer creíbles.','Informar sobre una alerta sísmica real.','Demostrar que el agua con limón cura infecciones.','Explicar cómo funciona Twitter.'],h:'¿Los ejemplos son verdaderos? ¿Qué tienen en común?',e:'Son casos cotidianos y creíbles que, sin embargo, son falsos: sirven para enganchar al lector y presentar el problema.',ev:'Los tres tienen algo en común: son falsos'},
  {d:'I',t:'opcion',lv:3,q:'¿Qué quiere decir «Detener un rumor también es una forma de participar»?',o:['Que decidir no compartir algo dudoso es una acción responsable.','Que hay que participar en todos los grupos de mensajes.','Que los rumores ayudan a que la gente participe más.','Que es mejor no opinar nunca en internet.'],h:'Normalmente pensamos que «participar» es compartir. ¿Qué propone el autor?',e:'El autor cambia la idea de participar: no reenviar un mensaje dudoso también es actuar.',ev:'Detener un rumor también es una forma de participar.'},
  {d:'I',t:'vf',lv:2,q:'Los mensajes que dicen «compártelo antes de que lo borren» buscan que actuemos antes de pensar.',a:true,h:'Primer consejo del cuarto párrafo.',e:'Verdadero: el texto recomienda desconfiar de la urgencia por esa razón.',ev:'buscan que actuemos antes de pensar'},
  {d:'C',t:'opcion',lv:3,q:'¿Cómo responde el autor a quienes proponen alejarse de las redes sociales?',o:['Dice que internet también sirve para desmentir bulos y consultar fuentes; el problema es la prisa.','Está de acuerdo y recomienda borrar las redes sociales.','Dice que las redes sociales no tienen ningún riesgo.','No responde; cambia de tema.'],h:'Busca el párrafo que empieza con «Algunas personas piensan…».',e:'El autor presenta un contraargumento: la tecnología también ayuda; lo que hay que cambiar es la prisa.',ev:'El problema no es la tecnología, sino la prisa con la que la usamos.'},
  {d:'C',t:'opcion',lv:2,q:'Recibes un audio con la voz de tu tío pidiendo dinero urgente. Según el texto, ¿qué es lo más adecuado?',o:['Llamar a tu tío por otro medio para confirmar antes de hacer algo.','Enviar el dinero de inmediato porque es su voz.','Reenviar el audio a toda la familia para que ayuden.','Borrar el audio sin avisar a nadie.'],h:'El texto menciona las voces clonadas y la regla de desconfiar de la urgencia.',e:'Una voz puede estar clonada con IA; confirmar con la fuente real es aplicar lo que el texto recomienda.',ev:'un audio con la voz clonada de un familiar pidiendo dinero'},
  {d:'C',t:'opcion',lv:2,q:'¿Qué tipo de texto es y cuál es su propósito principal?',o:['Un artículo de opinión que busca convencer de adoptar hábitos de verificación.','Una noticia que informa sobre una alerta sísmica.','Un cuento que narra la historia de un tiburón.','Un instructivo para usar Twitter.'],h:'¿El autor solo informa o también quiere convencer?',e:'Presenta un problema, da argumentos y propone acciones: es un texto argumentativo o de opinión.',ev:'¿Qué podemos hacer?'},
  {d:'C',t:'abierta',lv:2,q:'Diseña una regla de «higiene digital» para el grupo de mensajes de tu salón y explica qué problema del texto evita.',cr:['Propone una regla clara y aplicable.','La relaciona con un problema del texto (urgencia, fuente, voz clonada, prisa).','Explica el beneficio.'],kw:['fuente','verific','compart','urgen','dud','revis','confirm','reenvi','diez segundos','prisa'],m:'Regla: antes de reenviar, revisa quién lo publicó y búscalo en otro sitio confiable. Así evitamos compartir por prisa o por miedo, como explica el texto.'},
  {d:'C',t:'abierta',lv:3,q:'El autor dice que el problema «no es la tecnología, sino la prisa». ¿Estás de acuerdo? Argumenta con una evidencia del texto y un ejemplo de tu vida.',cr:['Postura clara.','Evidencia del texto.','Ejemplo personal o cercano que la apoye.'],kw:['prisa','tecnolog','emoci','compart','verific','fuente','ejemplo','pens'],m:'Estoy de acuerdo: el estudio del MIT muestra que las personas, no los robots, difunden lo falso por emoción. A mí me pasó con una cadena que reenvié sin leer.'}
 ]},
{id:'quijote', title:'Don Quijote de la Mancha · Capítulo I (fragmento)', author:'Miguel de Cervantes Saavedra, 1605 · dominio público', kind:'Novela clásica', level:'Retadora', hue:['#8a4a1c','#c7792e'], motif:'wind', rec:['S','D'],
 desc:'Un hidalgo lee tantos libros de caballerías que pierde el juicio y decide convertirse en caballero andante. El inicio más famoso de la lengua española.',
 body:`En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.

Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quijana. Pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad.

Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso, que eran los más del año, se daba a leer libros de caballerías con tanta afición y gusto, que olvidó casi de todo punto el ejercicio de la caza, y aun la administración de su hacienda; y llegó a tanto su curiosidad y desatino en esto, que vendió muchas hanegas de tierra de sembradura para comprar libros de caballerías en que leer, y así, llevó a su casa todos cuantos pudo haber dellos.

En resolución, él se enfrascó tanto en su lectura, que se le pasaban las noches leyendo de claro en claro, y los días de turbio en turbio; y así, del poco dormir y del mucho leer, se le secó el celebro, de manera que vino a perder el juicio. Llenósele la fantasía de todo aquello que leía en los libros, así de encantamentos como de pendencias, batallas, desafíos, heridas, requiebros, amores, tormentas y disparates imposibles; y asentósele de tal modo en la imaginación que era verdad toda aquella máquina de aquellas soñadas invenciones que leía, que para él no había otra historia más cierta en el mundo.

En efecto, rematado ya su juicio, vino a dar en el más extraño pensamiento que jamás dio loco en el mundo, y fue que le pareció convenible y necesario, así para el aumento de su honra como para el servicio de su república, hacerse caballero andante, y irse por todo el mundo con sus armas y caballo a buscar las aventuras y a ejercitarse en todo aquello que él había leído que los caballeros andantes se ejercitaban, deshaciendo todo género de agravio, y poniéndose en ocasiones y peligros donde, acabándolos, cobrase eterno nombre y fama.`,
 gloss:{'hidalgo':'Noble de la categoría más baja; tenía un título, pero muchas veces poco dinero.','astillero':'Soporte donde se colgaban las lanzas. «Lanza en astillero» indica que ya no la usaba.','adarga':'Escudo de cuero, ovalado o en forma de corazón.','rocín':'Caballo de trabajo, de poca calidad.','galgo':'Perro de caza, delgado y muy veloz.','salpicón':'Carne picada fría, aderezada con cebolla y vinagre.','hacienda':'Conjunto de bienes y dinero de una persona.','della':'Forma antigua de «de ella».','velarte':'Paño de lana negro y fino.','velludo':'Terciopelo.','mesmo':'Forma antigua de «mismo».','vellorí':'Paño de lana de color pardo.','podadera':'Herramienta para cortar ramas.','frisaba':'Se acercaba a una edad.','enjuto':'Delgado, flaco.','deste':'Forma antigua de «de este».','verosímiles':'Que parecen verdaderas o creíbles.','sobredicho':'Mencionado antes.','ocioso':'Sin ocupación, sin nada que hacer.','afición':'Gusto intenso por algo.','desatino':'Locura, falta de juicio.','hanegas':'Fanegas: medida antigua de superficie de terreno.','dellos':'Forma antigua de «de ellos».','enfrascó':'Se concentró por completo en algo.','celebro':'Forma antigua de «cerebro».','encantamentos':'Encantamientos, hechizos.','pendencias':'Peleas, riñas.','requiebros':'Piropos, palabras de amor.','convenible':'Conveniente.','agravio':'Ofensa o injusticia.','rematado':'Terminado por completo. «Rematado su juicio»: completamente loco.'},
 bank:[
  {d:'L',t:'opcion',lv:1,q:'¿Qué comía el hidalgo los viernes?',o:['Lentejas','Palomino','Salpicón','Duelos y quebrantos'],h:'Busca en la enumeración de comidas del primer párrafo.',e:'El texto dice «lentejas los viernes».',ev:'lentejas los viernes'},
  {d:'L',t:'opcion',lv:1,q:'¿Quiénes vivían con el hidalgo?',o:['Un ama de más de cuarenta años, una sobrina de menos de veinte y un mozo.','Su esposa, dos hijos y un escudero.','Un caballero andante y su caballo.','Solo su galgo y su rocín.'],h:'Segundo párrafo: «Tenía en su casa…».',e:'Vivía con una ama, una sobrina y un mozo de campo y plaza.',ev:'Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte'},
  {d:'L',t:'vf',lv:1,q:'El hidalgo tenía alrededor de cincuenta años.',a:true,h:'Busca el verbo «Frisaba».',e:'Verdadero: «Frisaba la edad de nuestro hidalgo con los cincuenta años».',ev:'Frisaba la edad de nuestro hidalgo con los cincuenta años'},
  {d:'G',t:'opcion',lv:1,q:'¿Cuál es la idea principal del fragmento?',o:['Un hidalgo que lee tantos libros de caballerías que pierde el juicio y decide hacerse caballero andante.','Un caballero famoso que vence en muchas batallas.','Una familia de la Mancha que se queda sin dinero por comprar comida.','Un joven que aprende a cazar en el campo.'],h:'Piensa en qué le pasa al personaje del principio al final del fragmento.',e:'El fragmento presenta al hidalgo, su obsesión por la lectura, su locura y su decisión final.',ev:'hacerse caballero andante'},
  {d:'G',t:'ordenar',lv:2,q:'Ordena lo que le sucede al hidalgo.',items:['Lee libros de caballerías en sus ratos libres.','Vende tierras para comprar más libros.','De tanto leer y poco dormir, pierde el juicio.','Decide hacerse caballero andante.'],h:'Sigue la cadena de causas y consecuencias.',e:'La afición lleva a la obsesión, la obsesión a la locura y la locura a su decisión.'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué puede inferirse de que la comida «consumía las tres partes de su hacienda»?',o:['Que el hidalgo tenía recursos modestos: casi todo lo gastaba en comer.','Que el hidalgo era muy rico y comía en exceso.','Que el hidalgo no comía casi nada.','Que la comida en la Mancha era gratuita.'],h:'Si la comida se lleva tres cuartas partes de lo que tiene, ¿cuánto le queda?',e:'Se infiere que no era rico: la comida (bastante sencilla) se llevaba la mayor parte de sus bienes.',ev:'consumían las tres partes de su hacienda'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué significa la expresión «se le secó el celebro»?',o:['Que perdió la razón, que enloqueció.','Que tuvo una enfermedad del cerebro por el calor.','Que olvidó todo lo que había leído.','Que se quedó dormido leyendo.'],h:'«Celebro» es una forma antigua de «cerebro». Es una expresión figurada; mira qué dice justo después.',e:'Es una forma figurada de decir que enloqueció: «de manera que vino a perder el juicio».',ev:'se le secó el celebro, de manera que vino a perder el juicio'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué muestra que el hidalgo vendiera tierras de cultivo para comprar libros?',o:['Que su afición por la lectura era desmedida y le hacía perder el sentido práctico.','Que era un buen administrador de su hacienda.','Que las tierras de la Mancha no servían para sembrar.','Que quería abrir una biblioteca para su pueblo.'],h:'Relaciona esta acción con la palabra «desatino».',e:'Vender tierras productivas por libros revela una obsesión: el texto la llama «curiosidad y desatino».',ev:'llegó a tanto su curiosidad y desatino en esto, que vendió muchas hanegas de tierra'},
  {d:'I',t:'opcion',lv:3,q:'¿Qué revela la frase «de cuyo nombre no quiero acordarme» sobre el narrador?',o:['Que el narrador decide qué contar y juega con el lector, mostrando su propia voz.','Que el narrador olvidó el nombre del lugar por accidente.','Que el lugar no existe en ningún mapa.','Que el hidalgo es quien cuenta la historia.'],h:'Fíjate en el verbo: no dice «no puedo», dice «no quiero».',e:'El narrador elige omitir el dato: es un narrador con personalidad, que opina e incluso ironiza.',ev:'de cuyo nombre no quiero acordarme'},
  {d:'I',t:'vf',lv:2,q:'«Rocín flaco» describe un caballo fuerte y elegante.',a:false,h:'Consulta el glosario: toca la palabra «rocín» en el texto.',e:'Falso: un rocín es un caballo de trabajo, de poca calidad, y además está flaco.',ev:'rocín flaco y galgo corredor'},
  {d:'C',t:'opcion',lv:3,q:'¿Qué critica Cervantes con humor en este fragmento?',o:['Los libros de caballerías y el exceso de fantasía que hace confundir la ficción con la realidad.','La costumbre de comer lentejas los viernes.','Que los hidalgos cazaran en el campo.','Que las mujeres vivieran en casas de hidalgos.'],h:'¿Qué provoca la locura del personaje?',e:'Cervantes parodia los libros de caballerías: su personaje cree que todo lo que leía era verdad.',ev:'para él no había otra historia más cierta en el mundo'},
  {d:'C',t:'opcion',lv:3,q:'«Para él no había otra historia más cierta en el mundo». ¿Con qué situación actual se relaciona mejor esta idea?',o:['Creer sin verificar todo lo que vemos en videos o redes, aunque sea ficción.','Leer libros de historia para un examen.','Ver películas de caballeros en el cine.','Aprender a montar a caballo.'],h:'El hidalgo no distingue ficción de realidad. ¿Dónde nos pasa eso hoy?',e:'El problema del hidalgo es tomar la ficción por verdad; hoy ocurre con contenidos falsos o editados.',ev:'era verdad toda aquella máquina de aquellas soñadas invenciones'},
  {d:'C',t:'abierta',lv:2,q:'¿Existe hoy un «Quijote digital», alguien que confunde lo que ve en pantallas con la realidad? Explica con un ejemplo y una idea del texto.',cr:['Da un ejemplo actual concreto.','Lo relaciona con una idea del texto (leer sin descanso, confundir ficción y realidad, perder el juicio).','Explica la semejanza con sus palabras.'],kw:['pantalla','redes','video','realidad','ficci','verdad','juicio','creer','dormir','leer'],m:'Sí: alguien que pasa las noches en videos y cree que todo es real, como el hidalgo, que del poco dormir y mucho leer confundió los libros con la verdad.'},
  {d:'C',t:'abierta',lv:3,q:'¿Es la lectura buena o peligrosa, según este fragmento? Argumenta tu interpretación con evidencias del texto.',cr:['Postura interpretativa clara.','Al menos una evidencia textual.','Reconoce el matiz: el problema es el exceso y no distinguir ficción de realidad.'],kw:['lectura','exceso','ficci','realidad','juicio','afici','desatino','libro','equilibr'],m:'La lectura no es peligrosa en sí; el problema es el exceso y no distinguir ficción de realidad: el hidalgo leía «de claro en claro» y terminó creyendo que las invenciones eran ciertas.'}
 ]},
{id:'nervo', title:'En paz', author:'Amado Nervo (México, 1870-1919) · dominio público', kind:'Poema', level:'Retadora', hue:['#9b3f22','#e0823f'], motif:'sun', poem:true, rec:['S','D'],
 desc:'Uno de los poemas mexicanos más recordados: un balance sereno de la vida y la idea de ser «arquitecto de tu propio destino».',
 body:`Muy cerca de mi ocaso, yo te bendigo, Vida,
porque nunca me diste ni esperanza fallida,
ni trabajos injustos, ni pena inmerecida;

porque veo al final de mi rudo camino
que yo fui el arquitecto de mi propio destino;

que si extraje las mieles o la hiel de las cosas,
fue porque en ellas puse hiel o mieles sabrosas:
cuando planté rosales, coseché siempre rosas.

…Cierto, a mis lozanías va a seguir el invierno:
¡mas tú no me dijiste que mayo fuese eterno!

Hallé sin duda largas las noches de mis penas;
mas no me prometiste tan sólo noches buenas;
y en cambio tuve algunas santamente serenas…

Amé, fui amado, el sol acarició mi faz.
¡Vida, nada me debes! ¡Vida, estamos en paz!`,
 gloss:{'ocaso':'Puesta del sol. En sentido figurado, el final de la vida.','fallida':'Que no se cumplió.','inmerecida':'Que no se merece.','rudo':'Duro, difícil.','mieles':'Lo dulce. En el poema, las alegrías.','hiel':'Líquido amargo. En el poema, las penas y lo amargo.','lozanías':'Vigor y frescura de la juventud.','mas':'Sin acento significa «pero».','santamente':'De manera pura, tranquila.','serenas':'Tranquilas, en calma.','faz':'Cara, rostro.'},
 bank:[
  {d:'L',t:'opcion',lv:1,q:'¿A quién se dirige el poeta a lo largo del poema?',o:['A la Vida','A su amada','A Dios','A sus lectores jóvenes'],h:'Observa la palabra que escribe con mayúscula y a quien habla de «tú».',e:'El poeta le habla a la Vida: «yo te bendigo, Vida».',ev:'yo te bendigo, Vida'},
  {d:'L',t:'vf',lv:1,q:'El poeta afirma que la vida le dio penas que no merecía.',a:false,h:'Lee con atención los tres primeros versos: «nunca me diste…».',e:'Falso: dice que la vida nunca le dio «pena inmerecida».',ev:'ni trabajos injustos, ni pena inmerecida'},
  {d:'L',t:'opcion',lv:1,q:'Según el poema, ¿qué cosechó el poeta cuando plantó rosales?',o:['Rosas','Espinas','Hiel','Nada'],h:'Tercera estrofa.',e:'«Cuando planté rosales, coseché siempre rosas».',ev:'cuando planté rosales, coseché siempre rosas'},
  {d:'G',t:'opcion',lv:2,q:'¿Cuál es el tema principal del poema?',o:['La aceptación serena de la vida y la gratitud al llegar a su final.','La tristeza por un amor perdido.','El miedo a la muerte y a la vejez.','La belleza de los jardines de rosas.'],h:'Fíjate en el título y en el último verso.',e:'El poeta hace un balance de su vida, la acepta y le agradece: «estamos en paz».',ev:'¡Vida, nada me debes! ¡Vida, estamos en paz!'},
  {d:'G',t:'vf',lv:1,q:'El poema trata principalmente de un amor perdido.',a:false,h:'¿Se queja de un amor? Relee el último par de versos.',e:'Falso: el amor aparece como algo que tuvo («Amé, fui amado»), pero el tema es el balance de la vida.',ev:'Amé, fui amado, el sol acarició mi faz.'},
  {d:'I',t:'opcion',lv:1,q:'¿Qué significa «Muy cerca de mi ocaso»?',o:['Que está cerca del final de su vida.','Que está viendo un atardecer.','Que vive cerca del mar.','Que tiene mucho sueño.'],h:'El ocaso es cuando se pone el sol. ¿A qué etapa de la vida se parece?',e:'Es una metáfora: el ocaso del día representa la vejez o el final de la vida.',ev:'Muy cerca de mi ocaso'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué quiere decir «yo fui el arquitecto de mi propio destino»?',o:['Que él construyó su vida con sus propias decisiones.','Que trabajó como arquitecto toda su vida.','Que el destino ya estaba escrito desde antes.','Que otras personas decidieron por él.'],h:'Un arquitecto diseña y construye. ¿Qué «construyó» el poeta?',e:'La metáfora indica responsabilidad: su vida fue resultado de lo que él hizo.',ev:'que yo fui el arquitecto de mi propio destino'},
  {d:'I',t:'opcion',lv:2,q:'En el poema, ¿qué representan «las mieles» y «la hiel»?',o:['Las alegrías y las penas de la vida.','Dos tipos de comida que le gustaban.','La riqueza y la pobreza.','La juventud y la vejez.'],h:'La miel es dulce; la hiel es amarga.',e:'Lo dulce y lo amargo simbolizan los momentos felices y los dolorosos.',ev:'si extraje las mieles o la hiel de las cosas'},
  {d:'I',t:'opcion',lv:3,q:'En los versos del invierno y de mayo, ¿qué representan esas estaciones?',o:['Mayo es la juventud y el invierno, la vejez.','Mayo es su mes favorito y el invierno, el que odia.','Son dos viajes que hizo.','Representan el clima de México.'],h:'«Lozanías» se refiere al vigor de la juventud.',e:'La primavera (mayo) simboliza la juventud; el invierno, la vejez. La vida no prometió juventud eterna.',ev:'¡mas tú no me dijiste que mayo fuese eterno!'},
  {d:'I',t:'opcion',lv:2,q:'¿Qué tono predomina en el poema?',o:['Sereno y agradecido.','Furioso y rebelde.','Burlón y divertido.','Desesperado y triste.'],h:'Piensa en palabras como «bendigo», «serenas» y «paz».',e:'El poeta acepta lo bueno y lo malo con serenidad y gratitud.',ev:'y en cambio tuve algunas santamente serenas'},
  {d:'C',t:'opcion',lv:3,q:'¿Por qué el poeta concluye «Vida, estamos en paz»?',o:['Porque siente que recibió lo justo: la vida no le debe nada ni él a ella.','Porque terminó una guerra en la que participó.','Porque está enojado y ya no quiere hablar con la vida.','Porque espera que la vida le pague lo que le debe.'],h:'«Estar en paz» también se usa cuando dos personas ya no se deben nada.',e:'Es un balance: lo que obtuvo corresponde a lo que sembró; no hay deudas pendientes.',ev:'¡Vida, nada me debes!'},
  {d:'C',t:'opcion',lv:2,q:'¿Qué idea del poema podría aplicarse mejor a tu vida escolar?',o:['Lo que obtienes depende en buena parte de lo que siembras con tu esfuerzo.','Todo depende de la suerte.','Hay que esperar que la vida te dé solo cosas buenas.','La juventud dura para siempre.'],h:'Recuerda los rosales y las rosas.',e:'«Cuando planté rosales, coseché siempre rosas»: el esfuerzo se refleja en los resultados.',ev:'cuando planté rosales, coseché siempre rosas'},
  {d:'C',t:'abierta',lv:2,q:'¿Estás de acuerdo con que somos «arquitectos de nuestro propio destino»? Argumenta con un verso del poema y un ejemplo.',cr:['Postura clara.','Cita o parafrasea un verso.','Da un ejemplo propio y reconoce límites o matices.'],kw:['arquitect','destino','decisi','esfuerzo','sembr','rosal','rosa','depend','suerte'],m:'En parte sí: como dice Nervo, «cuando planté rosales, coseché siempre rosas»; si estudio, mejoro. Pero también hay cosas que no dependen de mí, como la situación de mi familia.'},
  {d:'C',t:'abierta',lv:3,q:'Escribe una estrofa breve (2 o 3 versos) dirigida a la Vida desde tu edad actual, y explica en qué se parece y en qué se diferencia de la visión de Nervo.',cr:['Escribe versos dirigidos a la Vida.','Compara con la visión de Nervo (final de la vida, balance, gratitud).','Explica semejanzas y diferencias.'],kw:['vida','verso','nervo','joven','futuro','balance','paz','diferen','parec'],m:'«Vida, apenas empiezo mi camino, / dame tiempo de trazar mi destino». Se parece en que le hablo a la Vida; se diferencia en que Nervo hace un balance al final y yo apenas empiezo.'}
 ]}
];


/* =====================================================================
   UTILIDADES DE UI
   ===================================================================== */
const ACT = {};   // acciones delegadas: <button data-do="nombre">
document.addEventListener('click',e=>{const el=e.target.closest('[data-do]');if(!el)return;const f=ACT[el.dataset.do];if(f){e.preventDefault();f(el,e)}});
ACT.closeModal=()=>closeModal(); ACT.closeDrawer=()=>closeDrawer();
function toast(msg,ms=2800){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,ms)}
function openModal(html,wide){$('#modalBox').innerHTML=html;$('#modalBox').classList.toggle('wide',!!wide);$('#modal').hidden=false;const f=$('#modalBox').querySelector('input,select,textarea,button:not(.x)');f&&f.focus();}
function closeModal(){$('#modal').hidden=true}
$('#modal').addEventListener('mousedown',e=>{if(e.target.id==='modal')closeModal()});
function openDrawer(html){const d=$('#drawer');d.innerHTML=html;d.hidden=false;$('#scrim').hidden=false;d.scrollTop=0;d.querySelector('button')?.focus()}
function closeDrawer(){$('#drawer').hidden=true;$('#scrim').hidden=true}
$('#scrim').onclick=closeDrawer;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDrawer();$('#menu').hidden=true;hidePop()}});
function md(t){
  const lines=esc(t).split('\n');let h='',inL=false;
  for(let l of lines){l=l.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|\s)\*(.+?)\*(?=\s|$|[.,;:])/g,'$1<i>$2</i>');
    if(/^\s*#{1,4}\s+/.test(l)){if(inL){h+='</ul>';inL=false}h+=`<h4>${l.replace(/^\s*#{1,4}\s+/,'')}</h4>`}
    else if(/^\s*[-•*]\s+/.test(l)||/^\s*\d+[.)]\s+/.test(l)){if(!inL){h+='<ul>';inL=true}h+=`<li>${l.replace(/^\s*([-•*]|\d+[.)])\s+/,'')}</li>`}
    else if(l.trim()===''){if(inL){h+='</ul>';inL=false}}
    else{if(inL){h+='</ul>';inL=false}h+=`<p>${l}</p>`}}
  if(inL)h+='</ul>';return h;
}
async function saveFile(name,content,mime='text/plain'){
  try{ if(API.demo && window.claude?.use){const dl=await Promise.race([window.claude.use('downloads'),new Promise(r=>setTimeout(()=>r(null),1500))]); if(dl){await dl.save({filename:name,data:content});toast('Archivo listo: '+name);return}} }catch(e){ if(e&&e.code==='declined')return; }
  try{const url=URL.createObjectURL(new Blob([content],{type:mime+';charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('Descargando '+name)}catch{toast('No se pudo descargar en esta vista. Usa «Copiar».')}
}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Copiado al portapapeles')}catch{const ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();try{document.execCommand('copy');toast('Copiado al portapapeles')}catch{toast('Selecciona el texto y cópialo manualmente')}ta.remove()}}
function confetti(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const c=$('#confetti');c.hidden=false;const x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;
  const cols=['#EE9F2E','#2a78d6','#1baf7a','#e87ba4','#F6B75A','#4a3aa7','#00E5FF'];
  const P=Array.from({length:160},()=>({x:innerWidth/2+(Math.random()-.5)*220,y:innerHeight*.35,vx:(Math.random()-.5)*13,vy:-Math.random()*13-4,r:Math.random()*6+3,c:cols[Math.floor(Math.random()*cols.length)],a:Math.random()*6}));
  let t=0;(function f(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);x.restore()});if(++t<160)requestAnimationFrame(f);else c.hidden=true})();
}
/* medidor de contraseña */
function pwScore(pw,name){
  let s=0;if(!pw)return 0;if(pw.length>=6)s++;if(pw.length>=9)s++;if(/[a-z]/i.test(pw)&&/\d/.test(pw))s++;if(/[^a-z0-9]/i.test(pw)||/[A-Z]/.test(pw)&&/[a-z]/.test(pw))s++;
  const parts=norm(name).split(/\s+/).filter(w=>w.length>=4);if(parts.some(w=>norm(pw).includes(w)))s=Math.min(s,1);if(/^(.)\1+$/.test(pw)||/^(0123|1234|abcd|qwer)/i.test(pw))s=Math.min(s,1);return s;
}
function pwMeterHTML(id){return `<div class="pwmeter" id="${id}"><i></i><i></i><i></i><i></i><span></span></div>`}
function bindPwMeter(input,meter,name){const upd=()=>{const s=pwScore(input.value,name);meter.querySelectorAll('i').forEach((el,i)=>el.className=i<s?('on s'+s):'');meter.querySelector('span').textContent=input.value?['Muy débil','Débil','Aceptable','Fuerte','Muy fuerte'][s]:''};input.addEventListener('input',upd);upd()}
function eyeToggle(btn,input){btn.addEventListener('click',()=>{const v=input.type==='password';input.type=v?'text':'password';btn.textContent=v?'🙈':'👁️';btn.setAttribute('aria-label',v?'Ocultar contraseña':'Mostrar contraseña')})}
function pwField(id,label,ac){return `<div class="field"><label for="${id}">${label}</label><div class="pwwrap"><input id="${id}" type="password" autocomplete="${ac}" maxlength="128" spellcheck="false"><button type="button" class="eye" id="${id}Eye" aria-label="Mostrar contraseña">👁️</button></div></div>`}
function wirePw(id){const i=$('#'+id),b=$('#'+id+'Eye');if(i&&b)eyeToggle(b,i);return i}


/* =====================================================================
   ESTADO
   ===================================================================== */
const ST = { user:null, text:null, plan:null, questions:[], cur:0, answers:[], readStart:null, readSecs:0, ppm:null, quizStart:null, result:null, source:'' };
let ROSTER = [], GROUPS = [];

/* =====================================================================
   NAVEGACIÓN
   ===================================================================== */
const SCREENS=['login','diag','lib','read','quiz','res','path','admin'];
const STEPOF={diag:'diag',lib:'lib',read:'lib',quiz:'quiz',res:'res'};
function show(id){
  SCREENS.forEach(s=>$('#s-'+s).hidden=(s!==id));
  if(id!=='read'){Voice.stop();hidePop();$('#floatAsk').hidden=true}
  const order=['diag','lib','quiz','res'];const cur=STEPOF[id];const ci=order.indexOf(cur);
  $$('.step').forEach(b=>{const i=order.indexOf(b.dataset.s);b.classList.toggle('on',b.dataset.s===cur);b.classList.toggle('done',ci>=0&&i<ci&&canGo(b.dataset.s))});
  $('#stepper').hidden=(id==='login'||id==='admin'||API.role==='admin');
  document.body.classList.toggle('is-admin',id==='admin');
  window.scrollTo({top:0});
}
function canGo(s){return s==='diag'||s==='lib'||(s==='quiz'&&ST.questions.length)||(s==='res'&&ST.result)}
$$('.step').forEach(b=>b.onclick=()=>{if(!b.classList.contains('done'))return;const s=b.dataset.s;if(s==='diag')renderDiag();else if(s==='lib')show('lib');else if(s==='quiz')show('quiz');else if(s==='res')show('res')});
$('#brand').onclick=()=>{ if(API.role==='admin') renderAdmin(); else if(ST.user) renderDiag(); else show('login'); };
$('#userChip').onclick=e=>{e.stopPropagation();renderMenu();$('#menu').hidden=!$('#menu').hidden};
document.addEventListener('click',e=>{if(!e.target.closest('#menu')&&!e.target.closest('#userChip'))$('#menu').hidden=true});
function renderMenu(){
  const items = API.role==='admin'
    ? [['admin','🛰️ Centro de mando'],['logout','⏻ Cerrar sesión']]
    : [['diag','📊 Mi diagnóstico'],['path','🏆 Mi trayecto y logros'],['lib','📚 Elegir otra lectura'],['pw','🔑 Cambiar mi contraseña'],['logout','⏻ Cerrar sesión']];
  $('#menu').innerHTML=items.map(([a,t])=>`<button data-act="${a}" role="menuitem">${t}</button>`).join('');
}
$('#menu').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$('#menu').hidden=true;const a=b.dataset.act;
  if(a==='diag')renderDiag();else if(a==='lib'){renderLibrary();show('lib')}else if(a==='path')renderPath();else if(a==='pw')changeMyPw();else if(a==='admin')renderAdmin();else if(a==='logout')logout();});
function setChip(name,sub){$('#userChip').hidden=false;$('#userName').textContent=name;$('#userAv').textContent=initials(name);$('#userChip').title=sub||'';}
function logout(msg){API.clear();ST.user=null;ST.result=null;ST.questions=[];ST.text=null;$('#userChip').hidden=true;closeModal();closeDrawer();resetLogin();show('login');if(msg)toast(msg,4000)}
function sessionExpired(msg){if(!API.token)return;logout(msg||'Tu sesión terminó. Vuelve a entrar.')}
/* cierre por inactividad */
let idleT=null;function bumpIdle(){clearTimeout(idleT);if(!API.token)return;idleT=setTimeout(()=>logout('Cerramos tu sesión por inactividad para proteger tu cuenta.'),(API.role==='admin'?20:30)*60e3)}
['click','keydown','scroll','touchstart'].forEach(ev=>document.addEventListener(ev,bumpIdle,{passive:true}));

/* =====================================================================
   ACCESO SEGURO (estudiantes y administrador)
   ===================================================================== */
let selGroup=null, selId=null, setupToken=null;
const gateVal=()=>store.get('gate','');
function lgMsg(t,bad){const m=$('#lgMsg');m.textContent=t||'';m.classList.toggle('bad',!!bad)}
function lgPanel(p){['lgGate','lgPick','lgPass','lgNew'].forEach(x=>$('#'+x).hidden=(x!==p));lgMsg('')}
function resetLogin(){selGroup=store.get('lastGroup',null);selId=null;setupToken=null;if(!API.cfg)return;
  if(API.cfg.gate&&!gateVal()){lgPanel('lgGate');return}
  loadRoster();}
async function loadRoster(){
  lgPanel('lgPick');$('#groupPick').innerHTML='<span class="typing"><i></i><i></i><i></i> Cargando grupos…</span>';
  try{const r=await API.call('/roster',{gate:gateVal()});ROSTER=r.students;GROUPS=[...new Set(ROSTER.map(s=>s.g))].sort((a,b)=>a.localeCompare(b,'es'));if(!GROUPS.includes(selGroup))selGroup=null;renderGroups();if(selGroup)fillNames();}
  catch(e){if(e.code==='gate'){store.set('gate','');lgPanel('lgGate');lgMsg(e.message,true)}else{$('#groupPick').innerHTML='';lgMsg(e.message,true)}}
}
function renderGroups(){
  $('#groupPick').innerHTML=GROUPS.map(g=>`<button type="button" data-g="${esc(g)}" aria-pressed="${selGroup===g}">${esc(gName(g))}</button>`).join('')+(API.cfg.selfSignup?`<button type="button" class="other" data-g="__new">Soy nuevo · registrarme</button>`:'');
  $('#fKnown').hidden=!selGroup;
}
$('#groupPick').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const g=b.dataset.g;
  if(g==='__new'){openSignup();return}
  selGroup=g;store.set('lastGroup',g);selId=null;$('#nameFilter').value='';renderGroups();fillNames();$('#nameFilter').focus();});
function fillNames(){const q=norm($('#nameFilter').value);const list=ROSTER.filter(s=>s.g===selGroup&&(!q||norm(s.name).includes(q))).sort((a,b)=>a.name.localeCompare(b.name,'es'));
  $('#selName').innerHTML=list.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')||'<option disabled>Sin coincidencias</option>';$('#lgNext').disabled=true;}
$('#nameFilter').addEventListener('input',fillNames);
$('#selName').addEventListener('change',()=>{selId=$('#selName').value;$('#lgNext').disabled=!selId});
$('#selName').addEventListener('dblclick',()=>{if(selId)pickStudent()});
$('#selName').addEventListener('keydown',e=>{if(e.key==='Enter'&&selId){e.preventDefault();pickStudent()}});
$('#lgNext').onclick=()=>pickStudent();
ACT.lgBack=()=>{setupToken=null;lgPanel('lgPick');renderGroups();if(selGroup)fillNames()};
$('#gateForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#gateIn').value.trim();if(!v)return;store.set('gate',v);loadRoster()});
async function pickStudent(){
  const s=ROSTER.find(x=>x.id===selId);if(!s)return;lgMsg('');
  $('#lgWho').innerHTML=`<span class="av">${esc(initials(s.name))}</span><span><b>${esc(s.name)}</b><small>${esc(gName(s.g))}</small></span>`;
  try{const r=await API.call('/login',{id:s.id,gate:gateVal()});lgPanel('lgPass');passStep(r,s)}
  catch(e){lgMsg(e.message,true)}
}
function passStep(r,s){
  const box=$('#lgPassBody');
  if(r.status==='password'){
    box.innerHTML=`<form id="pwForm" class="miniform">${pwField('pwIn','Tu contraseña','current-password')}<button class="btn lg lamp">Entrar →</button><p class="hint">¿La olvidaste? Pide a tu profesor que la restablezca.</p></form>`;
    wirePw('pwIn').focus();
    $('#pwForm').onsubmit=async e=>{e.preventDefault();const b=e.submitter||$('#pwForm button.btn');b.disabled=true;lgMsg('Verificando…');
      try{const x=await API.call('/login',{id:s.id,password:$('#pwIn').value,gate:gateVal()});lgMsg('');await studentIn(x.token)}catch(err){lgMsg(err.message,true);$('#pwIn').select()}b.disabled=false};
  }else if(r.status==='needCode'){
    box.innerHTML=`<form id="codeForm" class="miniform"><div class="callout">🔐 <span>Es tu primera vez. Escribe el <b>código de inicio</b> que te dio tu profesor.</span></div><div class="field"><label for="codeIn">Código de inicio</label><input id="codeIn" class="codein" autocomplete="one-time-code" maxlength="12" placeholder="XXXX-XXXX" spellcheck="false"></div><button class="btn lg lamp">Continuar →</button></form>`;
    $('#codeIn').focus();
    $('#codeForm').onsubmit=async e=>{e.preventDefault();try{const x=await API.call('/login',{id:s.id,password:$('#codeIn').value.trim(),gate:gateVal()});passStep(x,s)}catch(err){lgMsg(err.message,true)}};
  }else if(r.status==='setup'){
    setupToken=r.setupToken;
    box.innerHTML=`<form id="setForm" class="miniform"><div class="callout">✨ <span><b>Bienvenida a Faro Lector.</b> Crea tu contraseña personal. La usarás cada vez que entres; no la compartas con nadie.</span></div>
      ${pwField('npw','Nueva contraseña','new-password')}${pwMeterHTML('npwM')}
      ${pwField('npw2','Escríbela otra vez','new-password')}
      <ul class="rules" id="pwRules"><li data-r="len">Al menos 6 caracteres</li><li data-r="name">Sin tu nombre dentro</li><li data-r="match">Las dos coinciden</li></ul>
      <button class="btn lg lamp" id="setBtn">Crear contraseña y entrar →</button></form>`;
    const a=wirePw('npw'),b=wirePw('npw2');a.focus();bindPwMeter(a,$('#npwM'),s.name);
    const chk=()=>{const parts=norm(s.name).split(/\s+/).filter(w=>w.length>=4);const r={len:a.value.length>=6,name:a.value&&!parts.some(w=>norm(a.value).includes(w)),match:a.value&&a.value===b.value};$$('#pwRules li').forEach(li=>li.classList.toggle('ok',!!r[li.dataset.r]));return r.len&&r.name&&r.match};
    a.addEventListener('input',chk);b.addEventListener('input',chk);
    $('#setForm').onsubmit=async e=>{e.preventDefault();if(!chk()){lgMsg('Revisa los requisitos de la contraseña.',true);return}
      try{const x=await API.call('/setup',{setupToken,password:a.value});await studentIn(x.token,true)}catch(err){lgMsg(err.message,true);if(err.code==='expired')ACT.lgBack()}};
  }
}
function openSignup(){
  lgPanel('lgNew');
  $('#lgNewBody').innerHTML=`<form id="suForm" class="miniform"><div class="callout">🌱 <span>Regístrate si no apareces en la lista de tu grupo. Tu profesor verá tu registro.</span></div>
   <div class="field"><label for="suName">Nombre completo (apellidos y nombre)</label><input id="suName" maxlength="80" autocomplete="name"></div>
   <div class="field"><label for="suG">Tu grupo</label><input id="suG" maxlength="14" placeholder="Ej. F, 2.º A, Sec. 45"></div>
   ${pwField('suPw','Crea tu contraseña','new-password')}${pwMeterHTML('suM')}${pwField('suPw2','Escríbela otra vez','new-password')}
   <button class="btn lg lamp">Registrarme y entrar →</button></form>`;
  $('#suName').focus();const a=wirePw('suPw');wirePw('suPw2');bindPwMeter(a,$('#suM'),'');
  $('#suForm').onsubmit=async e=>{e.preventDefault();const name=$('#suName').value.trim();let g=$('#suG').value.trim().replace(/^3\s*[.°º]*\s*/,'').trim();
    if(a.value!==$('#suPw2').value){lgMsg('Las contraseñas no coinciden.',true);return}
    try{const x=await API.call('/signup',{name,g,password:a.value,gate:gateVal()});await studentIn(x.token,true)}catch(err){lgMsg(err.message,true)}};
}
ACT.adminLogin=()=>{
  const ready=API.cfg.adminReady;
  openModal(`<div class="admhead"><span class="shield-mini">${crestSVG(40)}</span><div><span class="eyebrow">Acceso restringido</span><h3>Administrador</h3></div></div>
   <form id="admForm" class="miniform">
   ${ready?pwField('admPw','Contraseña de administrador','current-password')
     :`<div class="callout">🛠️ <span><b>Primera configuración.</b> Escribe el código de instalación (variable ADMIN_SETUP_CODE de Netlify${API.demo?'; en esta demostración es <b>demo-admin</b>':''}) y crea tu contraseña de administrador.</span></div>
       <div class="field"><label for="admCode">Código de instalación</label><input id="admCode" autocomplete="off" spellcheck="false"></div>
       ${pwField('admPw','Nueva contraseña (10 o más, letras y números)','new-password')}${pwMeterHTML('admM')}${pwField('admPw2','Repite la contraseña','new-password')}`}
   <p class="hint bad" id="admMsg" aria-live="polite"></p>
   <div class="row-end"><button type="button" class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn">Entrar al Centro de mando</button></div></form>`);
  const p=wirePw('admPw');if(!ready){wirePw('admPw2');bindPwMeter(p,$('#admM'),'');$('#admCode').focus()}else p.focus();
  $('#admForm').onsubmit=async e=>{e.preventDefault();const m=$('#admMsg');m.textContent='Verificando…';
    try{let x;if(ready)x=await API.call('/admin/login',{password:p.value});
      else{if(p.value!==$('#admPw2').value){m.textContent='Las contraseñas no coinciden.';return}x=await API.call('/admin/login',{setupCode:$('#admCode').value.trim(),password:p.value})}
      if(x.token){API.setToken(x.token,'admin');API.cfg.adminReady=true;closeModal();setChip('Administrador','Centro de mando');bumpIdle();renderAdmin()}}
    catch(err){m.textContent=err.message}};
};
async function studentIn(token,first){
  API.setToken(token,'student');bumpIdle();
  try{await loadMe()}catch(e){lgMsg(e.message,true);return}
  if(first)toast('¡Listo! Tu contraseña quedó guardada de forma segura.',3500);
  renderDiag();
}
async function loadMe(){
  const me=await API.call('/me');const d=me.diag;
  const u=Object.assign({},me.user,{diag:d,rank:me.rank,ref:me.ref,sessions:me.sessions||[]});
  if(d){d.cal=d.pts/9;d.lv=lvl(d.cal);d.dims=dimsOf(d);u.type='known';u.stu=d}else{u.type='new';u.known=me.ref.group?u.g:null}
  if(me.quotes)API.cfg.quotes=me.quotes;
  ST.user=u;ST.questions=[];ST.result=null;setChip(u.name,gName(u.g));return u;
}
function changeMyPw(){
  openModal(`<h3>Cambiar mi contraseña</h3><form id="cpForm" class="miniform">${pwField('cpCur','Contraseña actual','current-password')}${pwField('cpNew','Nueva contraseña','new-password')}${pwMeterHTML('cpM')}${pwField('cpNew2','Repite la nueva','new-password')}<p class="hint bad" id="cpMsg"></p><div class="row-end"><button type="button" class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn">Guardar</button></div></form>`);
  wirePw('cpCur');const n=wirePw('cpNew');wirePw('cpNew2');bindPwMeter(n,$('#cpM'),ST.user.name);
  $('#cpForm').onsubmit=async e=>{e.preventDefault();if(n.value!==$('#cpNew2').value){$('#cpMsg').textContent='Las contraseñas no coinciden.';return}
    try{const x=await API.call('/me/password',{current:$('#cpCur').value,password:n.value});API.setToken(x.token,'student');closeModal();toast('Contraseña actualizada')}catch(err){$('#cpMsg').textContent=err.message}};
}

/* ----- faro animado ----- */
(function beam(){const c=$('#beam');if(!c)return;const x=c.getContext('2d');const W=600,H=600;let a=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(){if($('#s-login').hidden&&!reduce){requestAnimationFrame(draw);return}x.clearRect(0,0,W,H);const lx=470,ly=250;
    const ang=Math.sin(a)*0.55+Math.PI*1.02;const g=x.createRadialGradient(lx,ly,4,lx,ly,520);g.addColorStop(0,'rgba(255,214,140,.55)');g.addColorStop(1,'rgba(255,214,140,0)');
    x.fillStyle=g;x.beginPath();x.moveTo(lx,ly);x.arc(lx,ly,560,ang-.17,ang+.17);x.closePath();x.fill();
    x.fillStyle='rgba(20,60,90,.55)';x.beginPath();x.moveTo(0,520);for(let i=0;i<=W;i+=20)x.lineTo(i,520+Math.sin(i/40+a*3)*4);x.lineTo(W,H);x.lineTo(0,H);x.fill();
    x.fillStyle='#0a1622';x.beginPath();x.ellipse(470,540,110,34,0,0,Math.PI*2);x.fill();
    x.fillStyle='#E9EEF2';x.beginPath();x.moveTo(445,520);x.lineTo(495,520);x.lineTo(485,280);x.lineTo(455,280);x.fill();
    x.fillStyle='#C0503A';[330,400,470].forEach(y=>{const w1=15+(520-y)/240*10;x.fillRect(470-w1-1,y,2*w1+2,22)});
    x.fillStyle='#0a1622';x.fillRect(448,262,44,20);x.fillStyle='#FFD58A';x.fillRect(455,240,30,22);x.fillStyle='#0a1622';x.beginPath();x.moveTo(450,240);x.lineTo(490,240);x.lineTo(470,222);x.fill();
    const gl=x.createRadialGradient(lx,ly,0,lx,ly,60);gl.addColorStop(0,'rgba(255,220,150,.9)');gl.addColorStop(1,'rgba(255,220,150,0)');x.fillStyle=gl;x.beginPath();x.arc(lx,ly,60,0,7);x.fill();
    if(!reduce){a+=.012;requestAnimationFrame(draw)}}
  draw();})();

function baseline(u){
  if(u.type==='known'){const s=u.stu;return {cal:s.cal,dims:s.dims,lv:s.lv,label:'Tu diagnóstico (sep 2026)',own:true}}
  const g=u.ref&&u.ref.group; if(g) return {cal:g.cal,dims:g.dims,lv:lvl(g.cal),label:`Promedio de ${gName(u.g)}`,own:false};
  const s=(u.ref&&u.ref.school)||{cal:7.5,dims:{L:80,G:80,I:70,C:75}};
  return {cal:s.cal,dims:s.dims,lv:lvl(s.cal),label:'Promedio de la escuela',own:false};
}
function makePlan(u){
  const b=baseline(u); const lv=u.type==='known'?b.lv:'N';
  const P={
    R:{n:8,dist:{L:3,G:2,I:2,C:1},open:1,ord:1,vf:2,opts:3,hints:'libres',hcost:0,diff:'baja a media',maxlv:2,tone:'Preguntas más directas, con tres opciones y pistas sin costo. El texto siempre a la vista.'},
    E:{n:10,dist:{L:2,G:2,I:4,C:2},open:1,ord:1,vf:2,opts:4,hints:'libres',hcost:0,diff:'media',maxlv:2,tone:'Más peso en la inferencia, con pistas disponibles sin costo.'},
    S:{n:12,dist:{L:2,G:2,I:5,C:3},open:1,ord:1,vf:1,opts:4,hints:'restan ¼ de punto',hcost:.25,diff:'media a alta',maxlv:3,tone:'Reto mayor en inferencia y lectura crítica; las pistas cuestan ¼ de punto.'},
    D:{n:12,dist:{L:1,G:2,I:5,C:4},open:2,ord:1,vf:1,opts:4,hints:'restan ½ punto',hcost:.5,diff:'alta',maxlv:3,tone:'Nivel experto: más preguntas críticas, dos respuestas argumentadas y pistas que cuestan ½ punto.'},
    N:{n:10,dist:{L:2,G:2,I:4,C:2},open:1,ord:1,vf:2,opts:4,hints:'libres',hcost:0,diff:'media',maxlv:3,tone:'Evaluación equilibrada para conocer tu nivel.'}
  }[lv];
  const plan=JSON.parse(JSON.stringify(P)); plan.lv=lv;
  const weak=[...'LGIC'].sort((a,c)=>b.dims[a]-b.dims[c])[0]; plan.weak=weak; plan.dist[weak]+=1; plan.n+=1;
  return plan;
}
function ring(val,max=10,col='var(--lamp)'){const r=70,C=2*Math.PI*r,p=Math.max(0,Math.min(1,val/max));
  return `<svg viewBox="0 0 170 170" aria-hidden="true"><circle cx="85" cy="85" r="${r}" fill="none" stroke="var(--line)" stroke-width="14"/><circle cx="85" cy="85" r="${r}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${C*p} ${C}"/></svg>`}
function dimBars(rows){ // rows: [{d, me, marks:[{v,col,label}]}]
  return `<div class="dimrows">${rows.map(r=>`<div class="dimrow"><span><b>${DSHORT[r.d]}</b> <span class="muted" style="font-size:12px">${DIMS[r.d]}</span></span>
   <div class="track"><i class="fill" style="width:${r.me}%;background:${DCOL[r.d]}"></i>${(r.marks||[]).map(m=>`<span class="mk" style="left:calc(${m.v}% - 1px);background:${m.col}" title="${m.label} ${pct(m.v)}"></span>`).join('')}</div>
   <b class="num" style="text-align:right">${pct(r.me)}</b></div>`).join('')}</div>`;
}
function diagMessage(u){
  const b=baseline(u);
  if(u.type!=='known'){
    return `<p>¡Hola! Qué gusto tenerte en Faro Lector. Todavía no tengo un diagnóstico tuyo, así que tomaré como punto de partida <b>${b.label.toLowerCase()}</b> (${f1(b.cal)} de 10).</p><p>Hoy vas a leer un texto, te haré preguntas de los cuatro procesos de la lectura (localizar información, sentido global, inferir y evaluar) y al final compararemos tu resultado con esa referencia.</p><p>Consejo antes de empezar: lee una vez para entender de qué trata y una segunda vez fijándote en <b>por qué</b> el autor dice lo que dice.</p>`;
  }
  const s=u.stu; const g=u.ref.group||u.ref.school; const dd=[...'LGIC'].map(d=>({d,v:s.dims[d]})).sort((a,c)=>c.v-a.v);
  const best=dd[0], worst=dd[dd.length-1];
  const open={D:'Tu diagnóstico es excelente',S:'Tu diagnóstico es muy bueno',E:'Vas por buen camino',R:'Aquí empieza tu avance'}[s.lv];
  const errs=DB.Q.filter(q=>!s.ans[q.k]);
  const cmp = s.cal>=g.cal+0.3?`por encima del promedio de tu grupo (${f1(g.cal)})`: s.cal<=g.cal-0.3?`por debajo del promedio de tu grupo (${f1(g.cal)})`:`muy cerca del promedio de tu grupo (${f1(g.cal)})`;
  let h=`<p><b>${open}.</b> Obtuviste <b>${s.pts} de 90 puntos</b>, es decir, <b>${f1(s.cal)}</b> de calificación: nivel <b>${LV[s.lv]}</b>, ${cmp}.</p>`;
  h+=`<p>Tu punto más fuerte es <b>${DIMS[best.d].toLowerCase()}</b> (${pct(best.v)} de aciertos)${worst.v<100?` y lo que más conviene reforzar es <b>${DIMS[worst.d].toLowerCase()}</b> (${pct(worst.v)})`:''}.</p>`;
  if(errs.length){
    const top=errs.slice(0,3).map(q=>`<li><b>${q.code} · ${esc(q.skill)}</b>: elegiste «${esc(s.wrong[q.k])}». La respuesta era «${esc(q.correct)}».</li>`).join('');
    h+=`<p>Algunos errores que vale la pena entender:</p><ul>${top}</ul>`;
  } else h+=`<p>No tuviste ningún error en los 18 reactivos de opción múltiple. ¡Impresionante!</p>`;
  const rc=s.rc, rp=s.rp;
  h+=`<p>En tus respuestas escritas: la conclusión sobre la IA obtuvo <b>${rc}/3</b> (${esc(s.rcn)}) y la propuesta de mejora <b>${rp}/3</b> (${esc(s.rpn)}). ${rc<2?'Te recomiendo usar la fórmula <b>Postura → Evidencia del texto → Explicación</b>.':'Sabes sostener tus ideas con el texto; ¡sigue así!'}</p>`;
  return h;
}
function renderDiag(){
  const u=ST.user; const b=baseline(u); const plan=makePlan(u); ST.plan=plan;
  const sec=$('#s-diag'); const isK=u.type==='known'; const s=u.stu;
  const marks=d=>{const m=[];if(u.ref.group){m.push({v:u.ref.group.dims[d],col:'var(--ink)',label:'Grupo'})}if(u.ref.school)m.push({v:u.ref.school.dims[d],col:'var(--muted)',label:'Escuela'});return m};
  const errs=isK?DB.Q.filter(q=>!s.ans[q.k]):[];
  const hist=u.sessions;const prog=computeProgress(u);
  sec.innerHTML=`
  <div class="head"><span class="eyebrow">Paso 1 · ${isK?`${gName(u.g)} · evaluación diagnóstica del ${s.date}/2026`:`${esc(gName(u.g))} · sin diagnóstico previo`}</span><h2>${isK?'Tu punto de partida':'Bienvenida a Faro Lector'}</h2></div>
  <div class="grid2">
    <div class="card">
      <div class="scorehero">
        <div class="ring">${ring(b.cal)}<div class="val"><div><b class="num">${f1(b.cal)}</b><span>${isK?`${s.pts} de 90 pts`:'referencia'}</span></div></div></div>
        <div style="display:grid;gap:10px">
          <span class="chip ${b.lv}" style="justify-self:start">${LV[b.lv]}</span>
          <h3 style="font-size:22px">${esc(u.name)}</h3>
          <p class="ink2" style="font-size:14px">${isK&&u.rank?`Lugar ${u.rank.group} de ${u.rank.groupN} en ${gName(u.g)} · supera al ${u.rank.schoolPct} % de la escuela`:`${b.label}: ${f1(b.cal)}`}</p>
          ${hist.length?`<p class="hint">Llevas ${hist.length} lectura${hist.length>1?'s':''} · última calificación: ${f1(hist[hist.length-1].cal)}</p>`:''}
        </div>
      </div>
      <h4 style="font-size:15px">Procesos de lectura ${isK?'':'(referencia)'}</h4>
      ${dimBars([...'LGIC'].map(d=>({d,me:b.dims[d],marks:marks(d)})))}
      <div class="legend">${u.ref.group?'<span><i class="sw" style="background:var(--ink);width:3px"></i>promedio de tu grupo</span>':''}<span><i class="sw" style="background:var(--muted);width:3px"></i>promedio de la escuela</span></div>
    </div>
    <div class="say"><span class="orb" id="diagOrb"></span><div class="bub"><span class="who">CLAUDE · TU TUTOR DE LECTURA</span><div id="diagMsg">${diagMessage(u)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn soft sm" id="diagSpeak">🔊 Escuchar este mensaje</button>${AI.on()?'<button class="btn ghost sm" id="diagAI">✨ Claude, dame un consejo más personal</button>':''}</div></div></div>
  </div>
  ${progressStrip(prog)}
  ${isK&&errs.length?`<div class="card"><details><summary style="cursor:pointer;font-weight:600">Ver ${errs.length===1?'tu error':`tus ${errs.length} errores`} del diagnóstico, reactivo por reactivo</summary><div class="errlist" style="margin-top:12px">${errs.map(q=>`<div class="err"><span class="c">${q.code} · ${esc(DB.TXT[q.t])} · ${esc(q.skill)} · ${DSHORT[q.dim]}</span><span>${esc(q.stem)}</span><span>Elegiste: <q>${esc(s.wrong[q.k])}</q></span><span class="ok">Correcta: ${esc(q.correct)}</span></div>`).join('')}</div></details></div>`:''}
  <div class="card route">
    <span class="eyebrow" style="color:#F6B75A">Tu ruta de hoy</span>
    <h3 style="font-size:24px">${plan.n} preguntas pensadas para ti</h3>
    <div class="kv">
      ${[...'LGIC'].map(d=>`<div><b class="num">${plan.dist[d]}</b><span>${DIMS[d]}${d===plan.weak?' · refuerzo':''}</span></div>`).join('')}
    </div>
    <p>${plan.tone} Incluye ${plan.open} respuesta${plan.open>1?'s':''} escrita${plan.open>1?'s':''}, ${plan.vf} de verdadero o falso y ${plan.ord} de ordenar. Como tu proceso más bajo es <b style="color:#fff">${DIMS[plan.weak].toLowerCase()}</b>, añadí una pregunta extra de ese tipo.</p>
    <div><button class="btn lamp lg" id="goLib">Elegir mi lectura →</button></div>
  </div>`;
  show('diag');
  wireProgressStrip();
  $('#goLib').onclick=()=>{renderLibrary();show('lib')};
  $('#diagSpeak').onclick=()=>speakPlain($('#diagMsg').innerText,$('#diagOrb'));
  const ai=$('#diagAI'); if(ai) ai.onclick=async()=>{
    ai.disabled=true;const out=$('#diagMsg');const prev=out.innerHTML;$('#diagOrb').classList.add('live');
    out.insertAdjacentHTML('beforeend','<div id="diagAIout" style="border-top:1px solid var(--line);padding-top:10px;margin-top:4px"><span class="typing"><i></i><i></i><i></i> Claude está pensando…</span></div>');
    const box=$('#diagAIout');
    try{await AI.ask(diagPrompt(u),{onText:({text})=>box.innerHTML=md(text)});}
    catch(e){box.innerHTML=`<p class="muted">${esc(AI.errMsg(e))}</p>`}
    $('#diagOrb').classList.remove('live');
  };
}
function diagPrompt(u){
  const s=u.stu; const errs=DB.Q.filter(q=>!s.ans[q.k]).map(q=>`- ${q.code} (${q.skill}, ${DIMS[q.dim]}): «${q.stem}» · eligió «${s.wrong[q.k]}» · correcta «${q.correct}»`).join('\n');
  return `Eres Claude, tutor de comprensión lectora de un estudiante de 3.º de secundaria en México (Nueva Escuela Mexicana). Escríbele directamente (tú), en español de México, con calidez y honestidad, máximo 170 palabras, sin repetir su calificación.
Datos del diagnóstico: ${s.pts}/90 (${f1(s.cal)}/10), nivel ${LV[s.lv]}. Aciertos por proceso: ${[...'LGIC'].map(d=>`${DIMS[d]} ${pct(s.dims[d])}`).join(', ')}. Promedio de su grupo: ${f1((u.ref.group||u.ref.school).cal)}.
Errores:
${errs||'ninguno'}
Su conclusión escrita sobre la IA: «${s.oc||'(vacía)'}». Su propuesta escrita: «${s.op||'(vacía)'}».
Tarea: 1) interpreta el patrón de sus errores (qué tipo de razonamiento le falta, no solo cuáles falló); 2) dale 3 estrategias concretas de lectura para practicar hoy, con viñetas; 3) cierra con una frase motivadora breve. Usa **negritas** para lo clave.`;
}

function coverSVG(t){const [a,b]=t.hue;const id='g'+t.id;let m='';
  if(t.motif==='nodes'){for(let i=0;i<9;i++){const x=20+((i*53)%220),y=15+((i*37)%80);m+=`<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity=".55"/>`;if(i)m+=`<line x1="${x}" y1="${y}" x2="${20+(((i-1)*53)%220)}" y2="${15+(((i-1)*37)%80)}" stroke="#fff" stroke-opacity=".25"/>`}}
  if(t.motif==='books'){for(let i=0;i<9;i++)m+=`<rect x="${150+i*14}" y="${30+(i%3)*8}" width="11" height="${80-(i%3)*8}" rx="1.5" fill="#fff" opacity="${.15+(i%4)*.08}"/>`}
  if(t.motif==='waves'){for(let i=0;i<5;i++)m+=`<path d="M0 ${30+i*16} q 30 -12 60 0 t 60 0 t 60 0 t 60 0 t 60 0" fill="none" stroke="#fff" stroke-opacity="${.12+i*.05}" stroke-width="2"/>`}
  if(t.motif==='wind'){m+=`<g transform="translate(205 40)" opacity=".5"><rect x="-3" y="0" width="6" height="70" fill="#fff"/>${[0,90,180,270].map(r=>`<rect x="-4" y="-40" width="8" height="40" fill="#fff" transform="rotate(${r+20})"/>`).join('')}</g>`}
  if(t.motif==='sun'){m+=`<circle cx="210" cy="95" r="44" fill="#FFD58A" opacity=".55"/><line x1="0" y1="95" x2="300" y2="95" stroke="#fff" stroke-opacity=".4"/>`}
  return `<svg viewBox="0 0 280 112" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="280" height="112" fill="url(#${id})"/>${m}</svg>`}
const wc=t=>(t.match(/\S+/g)||[]).length;
function renderLibrary(){
  const lv=ST.plan?.lv||'N';
  $('#books').innerHTML=LIB.map(t=>{const w=wc(t.body);return `<button class="book" data-id="${t.id}">${t.rec.includes(lv)?'<span class="rec">Recomendado para ti</span>':''}<div class="cover">${coverSVG(t)}<b>${esc(t.title)}</b></div>
   <div class="body"><div class="meta"><span class="tag">${esc(t.kind)}</span><span class="tag">${w} palabras</span><span class="tag">Dificultad: ${t.level}</span></div><p>${esc(t.desc)}</p><span class="hint">${esc(t.author)}</span></div></button>`}).join('');
}
$('#books').addEventListener('click',e=>{const b=e.target.closest('.book');if(!b)return;const t=LIB.find(x=>x.id===b.dataset.id);openText({title:t.title,author:t.author,kind:t.kind,body:t.body,poem:!!t.poem,preset:t})});
/* ----- carga de archivos ----- */
const drop=$('#drop');
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)handleFile(f)});
$('#fileIn').addEventListener('change',e=>{const f=e.target.files[0];if(f)handleFile(f);e.target.value=''});
$('#pasteGo').onclick=()=>{const body=$('#pasteText').value.trim();if(wc(body)<40){toast('Pega un texto de al menos 40 palabras.');return}openText({title:$('#pasteTitle').value.trim()||'Mi texto',author:'Texto pegado por el usuario',kind:'Texto propio',body})};
async function handleFile(f){
  const msg=$('#fileMsg');msg.textContent='Leyendo «'+f.name+'»…';
  const ext=(f.name.split('.').pop()||'').toLowerCase();
  try{
    let text='';
    if(ext==='txt'||ext==='md'||f.type==='text/plain'){const buf=await f.arrayBuffer();text=new TextDecoder('utf-8').decode(buf);if(text.includes('\uFFFD'))text=new TextDecoder('windows-1252').decode(buf)}
    else if(ext==='docx') text=await readDocx(await f.arrayBuffer());
    else if(ext==='pdf') text=await readPdf(await f.arrayBuffer(),p=>msg.textContent=`Leyendo PDF… página ${p}`);
    else if(ext==='doc'){throw new Error('Los archivos .doc antiguos no se pueden leer. Guárdalo como .docx o PDF desde Word y vuelve a subirlo.')}
    else throw new Error('Formato no compatible. Usa PDF, DOCX o TXT.');
    text=cleanText(text);
    if(wc(text)<30) throw new Error('No encontré suficiente texto en el archivo. Si es un PDF escaneado (una imagen), no tiene texto seleccionable.');
    msg.textContent='';openText({title:f.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' '),author:'Archivo: '+f.name,kind:ext.toUpperCase()+' subido',body:text});
  }catch(e){msg.textContent=e.message||String(e)}
}
function cleanText(t){return t.replace(/\r\n?/g,'\n').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').replace(/[ \t]{2,}/g,' ').trim()}
async function inflateRaw(u8){const ds=new DecompressionStream('deflate-raw');const s=new Blob([u8]).stream().pipeThrough(ds);return new Uint8Array(await new Response(s).arrayBuffer())}
async function readDocx(buf){
  const dv=new DataView(buf),u8=new Uint8Array(buf);let eocd=-1;
  for(let i=u8.length-22;i>=Math.max(0,u8.length-66000);i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break}}
  if(eocd<0)throw new Error('El archivo .docx parece dañado.');
  const n=dv.getUint16(eocd+10,true);let p=dv.getUint32(eocd+16,true);let entry=null;
  for(let i=0;i<n;i++){if(dv.getUint32(p,true)!==0x02014b50)break;const meth=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true);
    const name=new TextDecoder().decode(u8.subarray(p+46,p+46+nl));if(name==='word/document.xml'){entry={meth,csz,off};break}p+=46+nl+el+cl}
  if(!entry)throw new Error('No encontré el contenido del documento de Word.');
  const lo=entry.off,start=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true);let data=u8.subarray(start,start+entry.csz);
  if(entry.meth===8){if(typeof DecompressionStream==='undefined')throw new Error('Tu navegador no puede abrir .docx. Actualízalo o usa PDF/TXT.');data=await inflateRaw(data)}
  const xml=new DOMParser().parseFromString(new TextDecoder('utf-8').decode(data),'application/xml');
  const out=[];const ps=xml.getElementsByTagName('w:p');
  for(const p of ps){let s='';const walk=n=>{for(const c of n.childNodes){if(c.nodeName==='w:t')s+=c.textContent;else if(c.nodeName==='w:tab')s+=' ';else if(c.nodeName==='w:br')s+='\n';else if(c.childNodes&&c.childNodes.length)walk(c)}};walk(p);out.push(s.trim())}
  return out.filter((x,i,a)=>x||a[i-1]).join('\n\n');
}
function loadScript(urls){return new Promise((res,rej)=>{let i=0;const next=()=>{if(i>=urls.length)return rej(new Error('No se pudo cargar el lector de PDF. Necesitas conexión a internet para abrir PDF (DOCX y TXT funcionan sin conexión).'));const s=document.createElement('script');s.src=urls[i++];s.onload=()=>res();s.onerror=()=>{s.remove();next()};document.head.append(s)};next()})}
async function readPdf(buf,onPage){
  if(!window.pdfjsLib){await loadScript(['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'])}
  const lib=window.pdfjsLib;const src=document.querySelector('script[src*="pdf.min.js"]')?.src||'';
  lib.GlobalWorkerOptions.workerSrc=src.replace('pdf.min.js','pdf.worker.min.js');
  const doc=await lib.getDocument({data:new Uint8Array(buf),isEvalSupported:false}).promise;const pages=Math.min(doc.numPages,40);let lines=[];
  for(let i=1;i<=pages;i++){onPage&&onPage(i);const pg=await doc.getPage(i);const tc=await pg.getTextContent();let line='';let lastY=null;
    for(const it of tc.items){const y=it.transform?it.transform[5]:null;if(lastY!==null&&y!==null&&Math.abs(y-lastY)>2&&line){lines.push(line);line=''}line+=(line&&!line.endsWith(' ')&&!it.str.startsWith(' ')?' ':'')+it.str;lastY=y;if(it.hasEOL){lines.push(line);line='';lastY=null}}
    if(line)lines.push(line);lines.push('');}
  // unir líneas en párrafos
  let out='',para='';for(const l of lines){const t=l.trim();if(!t){if(para){out+=para+'\n\n';para=''}continue}
    if(/^\d{1,4}$/.test(t))continue; para+=(para?(para.endsWith('-')?'':' '):'')+(para.endsWith('-')?t:t);if(para.endsWith('-'))para=para.slice(0,-1); if(/[.!?:»”"]$/.test(t)&&t.length<60){out+=para+'\n\n';para=''}}
  if(para)out+=para;return out;
}

function splitSent(p){return (p.match(/[^.!?…]+(?:[.!?…]+[»”"')\]]*|$)/g)||[p]).map(s=>s.trim()).filter(Boolean)}
function openText(t){
  ST.text=t;ST.questions=[];ST.result=null;ST.readStart=Date.now();ST.readSecs=0;ST.ppm=null;
  $('#rKind').textContent=t.kind;$('#rTitle').textContent=t.title;
  const words=wc(t.body);$('#rMeta').textContent=`${t.author} · ${words.toLocaleString('es-MX')} palabras · lectura de ${Math.max(1,Math.round(words/170))} min aprox.`;
  const gl=t.preset?.gloss||{};const glk=new Set(Object.keys(gl).map(norm));
  const paras=t.body.split(/\n\s*\n/);let si=0;Voice.sents=[];
  const html=paras.map(p=>{
    const units=t.poem?p.split('\n').map(x=>x.trim()).filter(Boolean):splitSent(p.replace(/\s*\n\s*/g,' '));
    return '<p>'+units.map(u=>{const idx=si++;Voice.sents.push(u);let off=0;
      const ws=u.split(/(\s+)/).map(tok=>{if(/^\s+$/.test(tok)){off+=tok.length;return tok}const st=off;off+=tok.length;const k=norm(tok.replace(/[^\p{L}\p{N}-]/gu,''));const g=glk.has(k);
        return `<span class="w${g?' gl':''}" data-o="${st}"${g?` data-g="${esc(k)}"`:''}>${esc(tok)}</span>`}).join('');
      return `<span class="s" data-i="${idx}">${ws}</span>`}).join(t.poem?'<br>':' ')+'</p>'}).join('');
  const box=$('#rText');box.innerHTML=html;box.classList.toggle('poem',!!t.poem);
  ST.glossN=Object.fromEntries(Object.entries(gl).map(([k,v])=>[norm(k),{w:k,d:v}]));
  $('#askOut').innerHTML='';Voice.i=0;tReset();
  $('#readStat').textContent=`${words.toLocaleString('es-MX')} palabras · cuando termines:`;
  show('read');
}
const Voice={sents:[],i:0,playing:false,token:0,voices:[],voice:null,rate:0.95,
  load(){const all=(speechSynthesis?.getVoices?.()||[]);const es=all.filter(v=>/^es(-|_|$)/i.test(v.lang));this.voices=es.length?es:all;
    const score=v=>(/es[-_]MX/i.test(v.lang)?6:/es[-_](US|419)/i.test(v.lang)?4:/^es/i.test(v.lang)?2:0)+(/natural|neural|online/i.test(v.name)?8:0)+(/google/i.test(v.name)?3:0)+(/dalia|jorge|paulina|sabina|camila|elvira|alvaro|lupe|pedro/i.test(v.name)?2:0);
    this.voices.sort((a,b)=>score(b)-score(a));const saved=store.get('voice','');this.voice=this.voices.find(v=>v.name===saved)||this.voices[0]||null;
    const sel=$('#vVoice');sel.innerHTML=this.voices.map((v,i)=>`<option value="${esc(v.name)}">${i===0?'★ ':''}${esc(v.name.replace(/Microsoft |Google /,''))} · ${v.lang}</option>`).join('')||'<option>Voz del sistema</option>';if(this.voice)sel.value=this.voice.name;
    if(!('speechSynthesis' in window)){$('#vHint').textContent='Tu navegador no tiene voz sintetizada. Prueba con Chrome o Edge.'}},
  play(from){if(!('speechSynthesis' in window)){toast('Tu navegador no permite lectura en voz alta.');return}if(from!=null)this.i=from;if(this.i>=this.sents.length)this.i=0;this.playing=true;this.ui();speechSynthesis.cancel();this.speak()},
  speak(){const tk=++this.token;const i=this.i;const u=new SpeechSynthesisUtterance(this.sents[i]);if(this.voice){u.voice=this.voice;u.lang=this.voice.lang}else u.lang='es-MX';u.rate=this.rate;u.pitch=1;
    this.mark(i);u.onboundary=e=>{if(tk!==this.token)return;if(e.name&&e.name!=='word')return;this.word(i,e.charIndex)};
    u.onend=()=>{if(tk!==this.token||!this.playing)return;this.i++;if(this.i<this.sents.length)this.speak();else{this.playing=false;this.ui();this.mark(-1);toast('Lectura terminada. ¿Listo para tus preguntas?')}};
    u.onerror=e=>{if(tk!==this.token)return;if(e.error!=='interrupted'&&e.error!=='canceled'){this.playing=false;this.ui()}};
    speechSynthesis.speak(u)},
  pause(){this.playing=false;this.token++;speechSynthesis.cancel();this.ui()},
  stop(){if(!('speechSynthesis' in window))return;this.playing=false;this.token++;speechSynthesis.cancel();this.mark(-1);this.ui()},
  step(d){const was=this.playing;this.i=Math.max(0,Math.min(this.sents.length-1,this.i+d));if(was)this.play();else this.mark(this.i)},
  mark(i){document.querySelectorAll('#rText .s.now,#rText .w.now').forEach(e=>e.classList.remove('now'));if(i<0)return;const el=document.querySelector(`#rText .s[data-i="${i}"]`);if(el){el.classList.add('now');const r=el.getBoundingClientRect();if(r.top<90||r.bottom>innerHeight-110)el.scrollIntoView({block:'center',behavior:'smooth'})}},
  word(i,ci){const s=document.querySelector(`#rText .s[data-i="${i}"]`);if(!s)return;s.querySelectorAll('.w.now').forEach(e=>e.classList.remove('now'));let best=null;for(const w of s.querySelectorAll('.w')){if(+w.dataset.o<=ci)best=w;else break}best&&best.classList.add('now')},
  ui(){$('#vPlayIc').innerHTML=this.playing?'<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>':'<path d="M8 5v14l11-7z"/>';$('#vPlay').setAttribute('aria-label',this.playing?'Pausar':'Reproducir');$('#vOrb').classList.toggle('live',this.playing);$('#paper').classList.toggle('voice-on',true)}
};
if('speechSynthesis' in window){Voice.load();speechSynthesis.onvoiceschanged=()=>Voice.load();}else Voice.load();
$('#vPlay').onclick=()=>Voice.playing?Voice.pause():Voice.play();
$('#vStop').onclick=()=>{Voice.stop();Voice.i=0};
$('#vPrev').onclick=()=>Voice.step(-1);$('#vNext').onclick=()=>Voice.step(1);
$('#vRate').oninput=e=>{Voice.rate=+e.target.value;$('#vRateV').textContent=Voice.rate.toFixed(2)+'×';if(Voice.playing)Voice.play()};
$('#vVoice').onchange=e=>{Voice.voice=Voice.voices.find(v=>v.name===e.target.value)||Voice.voice;store.set('voice',Voice.voice?.name||'');if(Voice.playing)Voice.play()};
$('#rText').addEventListener('click',e=>{const w=e.target.closest('.w.gl');if(w&&ST.glossN[w.dataset.g]){showPop(w,`<b>${esc(ST.glossN[w.dataset.g].w)}</b>${esc(ST.glossN[w.dataset.g].d)}`);return}
  if(window.getSelection().toString().trim())return;const s=e.target.closest('.s');if(s)Voice.play(+s.dataset.i)});
function speakPlain(text,orb){if(!('speechSynthesis' in window)){toast('Tu navegador no permite lectura en voz alta.');return}Voice.stop();const parts=splitSent(text.replace(/\n+/g,' '));let k=0;const tk=++Voice.token;orb&&orb.classList.add('live');
  const next=()=>{if(tk!==Voice.token||k>=parts.length){orb&&orb.classList.remove('live');return}const u=new SpeechSynthesisUtterance(parts[k++]);if(Voice.voice){u.voice=Voice.voice;u.lang=Voice.voice.lang}else u.lang='es-MX';u.rate=Voice.rate;u.onend=next;u.onerror=()=>orb&&orb.classList.remove('live');speechSynthesis.speak(u)};next()}
/* herramientas de lectura */
function segBind(id,fn){$(id).addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$(id).querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));fn(b.dataset.v)})}
segBind('#fsSeg',v=>$('#rText').style.setProperty('--fs',v));
segBind('#skinSeg',v=>$('#paper').dataset.skin=v);
$('#optDys').onchange=e=>$('#rText').classList.toggle('dys',e.target.checked);
$('#optRuler').onchange=e=>{$('#ruler').hidden=!e.target.checked};
$('#paper').addEventListener('mousemove',e=>{if($('#ruler').hidden)return;const r=$('#paper').getBoundingClientRect();const fs=parseFloat(getComputedStyle($('#rText')).fontSize);$('#ruler').style.top=(e.clientY-r.top-fs*1.1)+'px';$('#ruler').style.height=(fs*2.2)+'px'});
/* cronómetro de fluidez */
let tInt=null,tStart=0;
function tReset(){clearInterval(tInt);tInt=null;$('#tClock').textContent='0:00';$('#tBtn').textContent='Empezar a leer en silencio';$('#tMsg').textContent='Mide cuántas palabras lees por minuto. La referencia de la SEP para 3.º de secundaria es de 165 a 170 palabras por minuto.'}
$('#tBtn').onclick=()=>{if(!tInt){Voice.stop();tStart=Date.now();tInt=setInterval(()=>{const s=Math.floor((Date.now()-tStart)/1000);$('#tClock').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`},250);$('#tBtn').textContent='Terminé de leer';window.scrollTo({top:$('#paper').offsetTop-80,behavior:'smooth'})}
  else{clearInterval(tInt);tInt=null;const secs=(Date.now()-tStart)/1000;const ppm=Math.round(wc(ST.text.body)/(secs/60));ST.ppm=ppm;ST.readSecs=secs;
    const v=ppm<120?'Lectura pausada. Practica leer por frases completas, no palabra por palabra.':ppm<165?'Vas cerca de la referencia. Con práctica diaria de 10 minutos la alcanzas.':ppm<=260?'¡Estás en la referencia de la SEP o por encima! Asegúrate de comprender, no solo de ir rápido.':'Muy rápido: vuelve a leer las partes clave para comprobar que entendiste.';
    $('#tMsg').innerHTML=`<b class="num">${ppm} palabras por minuto.</b> ${v}`;$('#tBtn').textContent='Medir de nuevo'}};
/* selección → explicar */
let selText='';
document.addEventListener('selectionchange',()=>{if($('#s-read').hidden)return;const sel=window.getSelection();const t=sel.toString().trim();const fa=$('#floatAsk');
  if(!t||t.length>400||!sel.rangeCount||!$('#rText').contains(sel.anchorNode)){fa.hidden=true;return}
  selText=t;const r=sel.getRangeAt(0).getBoundingClientRect();const pr=$('#s-read').getBoundingClientRect();fa.style.left=(r.left+r.width/2-pr.left)+'px';fa.style.top=(r.top-pr.top)+'px';fa.hidden=false});
$('#floatAsk').addEventListener('mousedown',e=>e.preventDefault());
$('#floatAsk').onclick=()=>{$('#floatAsk').hidden=true;explain(selText)};
function showPop(el,html){const p=$('#pop');p.innerHTML=html;p.hidden=false;const r=el.getBoundingClientRect(),pr=$('#s-read').getBoundingClientRect();p.style.left=Math.max(8,Math.min(r.left-pr.left,pr.width-330))+'px';p.style.top=(r.bottom-pr.top+8)+'px';clearTimeout(showPop._t);showPop._t=setTimeout(hidePop,7000)}
function hidePop(){$('#pop').hidden=true}
document.addEventListener('click',e=>{if(!e.target.closest('#pop')&&!e.target.closest('.gl'))hidePop()});
function context(t,n=2600){const b=ST.text.body;const i=b.indexOf(t);if(i<0)return b.slice(0,n);return b.slice(Math.max(0,i-n/2),i+n/2)}
async function explain(q,free=false){
  const out=$('#askOut');const k=norm(q);
  if(!AI.on()){const g=ST.glossN?.[k];out.innerHTML=g?`<div class="say" style="grid-template-columns:auto 1fr"><span class="orb sm"></span><div><b>${esc(g.w)}:</b> ${esc(g.d)}</div></div>`:`<p class="muted">Para explicar frases o responder dudas, el administrador debe activar la IA. ${ST.glossN&&Object.keys(ST.glossN).length?'Mientras tanto, toca las palabras subrayadas con puntos para ver su significado.':''}</p>`;return}
  out.innerHTML='<span class="typing"><i></i><i></i><i></i> Claude está pensando…</span>';
  const prompt=free?`Eres Claude, tutor de lectura de un estudiante de 3.º de secundaria (14-15 años) en México. Responde su duda sobre el texto que está leyendo, en máximo 110 palabras, con lenguaje sencillo y un ejemplo si ayuda. Si la respuesta está en el texto, indica en qué parte. No inventes datos que no estén en el texto; si la duda no se puede responder con él, dilo.\n\nTÍTULO: ${ST.text.title}\nFRAGMENTO DEL TEXTO:\n"""${context(q,5000)}"""\n\nDUDA DEL ESTUDIANTE: ${q}`
    :`Eres Claude, tutor de lectura de un estudiante de 3.º de secundaria en México. Explica qué significa «${q}» EN ESTE CONTEXTO, en máximo 80 palabras: primero el significado sencillo, luego qué aporta al texto. Si es lenguaje figurado, dilo.\n\nTÍTULO: ${ST.text.title}\nCONTEXTO:\n"""${context(q)}"""`;
  try{await AI.ask(prompt,{tier:'quick',onText:({text})=>out.innerHTML=`<div><b style="font-size:12px;font-family:var(--mono);color:var(--muted)">${free?'TU DUDA':'«'+esc(q.slice(0,60))+'»'}</b>${md(text)}</div>`})}
  catch(e){out.innerHTML=`<p class="muted">${esc(AI.errMsg(e))}</p>`;}
}
$('#askBtn').onclick=()=>{const q=$('#askBox').value.trim();if(q.length<3)return;explain(q,true)};
$('#doneRead').onclick=()=>{Voice.stop();if(!ST.readSecs)ST.readSecs=(Date.now()-ST.readStart)/1000;startQuiz()};

function genPrompt(){
  const u=ST.user,p=ST.plan,b=baseline(u);const txt=ST.text.body.slice(0,14000);
  const mc=p.n-p.open-p.ord-p.vf;
  return `Eres Claude, especialista en evaluación de la comprensión lectora para 3.º de secundaria en México. Te basas en la Nueva Escuela Mexicana (campo formativo Lenguajes, eje de pensamiento crítico) y en los marcos internacionales PISA 2025 y PIRLS.

Crea una evaluación personalizada del TEXTO de abajo.

PERFIL DEL ESTUDIANTE
- Nivel diagnóstico: ${LV[b.lv]||'sin diagnóstico'} (${f1(b.cal)}/10${b.own?'':', referencia de grupo'}).
- Aciertos por proceso: ${[...'LGIC'].map(d=>`${DIMS[d]} ${pct(b.dims[d])}`).join('; ')}.
- Proceso a reforzar: ${DIMS[p.weak]}.

PLAN EXACTO (${p.n} preguntas en total)
- Por proceso: L (localizar información explícita) = ${p.dist.L}; G (sentido global: tema, idea principal, estructura, propósito) = ${p.dist.G}; I (inferir e interpretar: causas no dichas, lenguaje figurado, función de recursos, vocabulario en contexto, narrador) = ${p.dist.I}; C (evaluar y reflexionar: postura del autor, credibilidad, intención, aplicación a situaciones nuevas, valoración) = ${p.dist.C}.
- Por tipo: ${p.open} "abierta" (del proceso C${p.open>1?' o I':''}), ${p.ord} "ordenar" (proceso G, 4 elementos), ${p.vf} "vf" y ${mc} "opcion" con exactamente ${p.opts} opciones.
- Dificultad: ${p.diff}. Adecua el vocabulario a estudiantes de 14 y 15 años.

REGLAS DE CALIDAD
- Cada respuesta correcta debe poder justificarse con el texto. Una sola opción correcta.
- Distractores plausibles basados en errores típicos: quedarse en lo literal, generalizar, confundir detalle con idea principal, opinar sin apoyo del texto.
- Pon la opción correcta en posiciones distintas; la app las mezclará igualmente.
- No reveles la respuesta en el enunciado. Sin preguntas de memoria trivial.
- "evidencia": cita textual breve (máx. 25 palabras) que sostiene la respuesta.
- "pista": orienta sin decir la respuesta. "explicacion": por qué es correcta, en 1 o 2 oraciones.

FORMATO: responde SOLO con JSON válido, sin texto adicional:
{"tipoTexto":"...","preguntas":[
 {"tipo":"opcion","proceso":"L|G|I|C","enunciado":"...","opciones":["..."],"correcta":0,"pista":"...","explicacion":"...","evidencia":"..."},
 {"tipo":"vf","proceso":"...","enunciado":"afirmación a juzgar","correcta":true,"pista":"...","explicacion":"...","evidencia":"..."},
 {"tipo":"ordenar","proceso":"G","enunciado":"Ordena…","items":["primero","segundo","tercero","cuarto"],"pista":"...","explicacion":"..."},
 {"tipo":"abierta","proceso":"C","enunciado":"...","criterios":["criterio 1","criterio 2","criterio 3"],"palabrasClave":["..."],"respuestaModelo":"...","pista":"..."}
]}
En "ordenar", "items" va en el ORDEN CORRECTO.

TÍTULO: ${ST.text.title}
TEXTO:
"""
${txt}
"""`;
}
function normAIQ(raw){
  const arr=Array.isArray(raw)?raw:(raw&&raw.preguntas)||[];const out=[];
  for(const q of arr){const d=String(q.proceso||'').toUpperCase()[0];if(!'LGIC'.includes(d)||!q.enunciado)continue;const t=String(q.tipo||'').toLowerCase();
    if(t==='opcion'&&Array.isArray(q.opciones)&&q.opciones.length>=2&&Number.isInteger(+q.correcta)&&q.opciones[+q.correcta]!=null){const c=q.opciones[+q.correcta];out.push({d,t:'opcion',q:q.enunciado,o:[c,...q.opciones.filter((_,i)=>i!==+q.correcta)],h:q.pista,e:q.explicacion,ev:q.evidencia})}
    else if(t==='vf'&&typeof q.correcta==='boolean')out.push({d,t:'vf',q:q.enunciado,a:q.correcta,h:q.pista,e:q.explicacion,ev:q.evidencia});
    else if(t==='ordenar'&&Array.isArray(q.items)&&q.items.length>=3)out.push({d,t:'ordenar',q:q.enunciado,items:q.items.slice(0,5),h:q.pista,e:q.explicacion});
    else if(t==='abierta')out.push({d,t:'abierta',q:q.enunciado,cr:q.criterios||[],kw:(q.palabrasClave||[]).map(norm),m:q.respuestaModelo||'',h:q.pista});}
  return out;
}
function pickFromBank(bank,plan){
  const need={...plan.dist};const out=[];const used=new Set();
  const pref=it=>((it.lv||2)<=plan.maxlv?0:1);
  const take=(filter,n,sorter)=>{if(n<=0)return 0;const c=shuffle(bank.map((it,i)=>({it,i})).filter(o=>!used.has(o.i)&&filter(o.it)));
    c.sort((a,b)=>pref(a.it)-pref(b.it)||(sorter?sorter(a.it,b.it):0));const got=c.slice(0,n);got.forEach(o=>{used.add(o.i);out.push(o.it);need[o.it.d]--});return got.length};
  take(it=>it.t==='abierta',plan.open,(a,b)=>(a.d==='C'?0:1)-(b.d==='C'?0:1));
  take(it=>it.t==='ordenar',plan.ord);
  take(it=>it.t==='vf'&&need[it.d]>0,plan.vf);
  for(const d of 'LGIC')take(it=>it.d===d&&(it.t==='opcion'),need[d]);
  for(const d of 'LGIC')take(it=>it.d===d&&it.t!=='abierta',need[d]);
  for(const d of 'IC')take(it=>it.d===d,need[d]);
  take(it=>it.t!=='abierta',plan.n-out.length);
  return out;
}
/* ---- generador local (sin IA) ---- */
const STOP=new Set('de la que el en y a los del se las por un para con no una su al lo como más mas pero sus le ya o este sí si porque esta entre cuando muy sin sobre también me hasta hay donde quien desde todo nos durante todos uno les ni contra otros ese eso ante ellos e esto mí antes algunos qué unos yo otro otras otra él tanto esa estos mucho quienes nada muchos cual poco ella estar estas algunas algo nosotros mi mis tú te ti tu tus ellas nosotras vosotros os mío mía tuyo suyo nuestro fue era son es ser han ha había sido tiene tienen puede pueden hace hacer así aquí allí cada vez veces solo sólo tan ese esa aún aun luego pues entonces cómo dónde cuál cuáles'.split(' '));
function keywords(text,n=40){const f={};(text.toLowerCase().match(/[a-záéíóúüñ]{4,}/g)||[]).forEach(w=>{if(!STOP.has(w))f[w]=(f[w]||0)+1});return Object.entries(f).sort((a,b)=>b[1]*Math.log(b[0].length)-a[1]*Math.log(a[0].length)).slice(0,n).map(x=>x[0])}
function offlineBank(text){
  const paras=text.split(/\n\s*\n/).map(p=>p.replace(/\s*\n\s*/g,' ').trim()).filter(p=>wc(p)>=8);
  const sents=paras.flatMap((p,pi)=>splitSent(p).map(s=>({s,pi}))).filter(o=>{const n=wc(o.s);return n>=7&&n<=45});
  const kws=keywords(text);const top=kws.slice(0,20);const bank=[];
  const pickOthers=(kw,exclude,n)=>shuffle(kws.filter(w=>w!==kw&&!exclude.includes(w)&&Math.abs(w.length-kw.length)<=4)).slice(0,n);
  shuffle(sents).forEach(o=>{if(bank.filter(b=>b.t==='opcion'&&b.d==='L').length>=5)return;const inS=top.filter(w=>new RegExp('\\b'+w+'\\b','i').test(o.s));if(!inS.length)return;const kw=inS[0];const ot=pickOthers(kw,o.s.toLowerCase().split(/\W+/),3);if(ot.length<3)return;
    bank.push({d:'L',t:'opcion',lv:1,q:`Completa la oración tal como aparece en el texto: «${o.s.replace(new RegExp('\\b'+kw+'\\b','i'),'_____')}»`,o:[kw,...ot],h:'Busca la oración en el texto; empieza igual.',e:`La palabra que aparece en el texto es «${kw}».`,ev:o.s})});
  shuffle(sents).slice(0,6).forEach((o,i)=>{const inS=top.filter(w=>new RegExp('\\b'+w+'\\b','i').test(o.s));if(i%2===0||!inS.length){bank.push({d:'L',t:'vf',lv:1,q:o.s,a:true,h:'Localiza la oración en el texto y compárala palabra por palabra.',e:'Es verdadero: la oración aparece así en el texto.',ev:o.s})}else{const kw=inS[0];const ot=pickOthers(kw,[],1)[0];if(!ot)return;bank.push({d:'L',t:'vf',lv:2,q:o.s.replace(new RegExp('\\b'+kw+'\\b','i'),ot),a:false,h:'Hay una palabra cambiada. Compárala con el texto.',e:`Es falso: en el texto dice «${kw}», no «${ot}».`,ev:o.s})}});
  if(paras.length>=4){const idx=[0,Math.floor(paras.length/3),Math.floor(2*paras.length/3),paras.length-1];const it=[...new Set(idx)].map(i=>splitSent(paras[i])[0]).filter(Boolean).map(s=>s.length>140?s.slice(0,137)+'…':s);if(it.length>=3)bank.push({d:'G',t:'ordenar',lv:2,q:'Ordena estos fragmentos según aparecen en el texto.',items:it,h:'Piensa en cómo empieza, cómo se desarrolla y cómo termina el texto.',e:'Este es el orden en que avanza el texto.'})}
  const t3=top.slice(0,3),far=kws.slice(-12);
  if(t3.length===3&&far.length>=6)bank.push({d:'G',t:'opcion',lv:2,q:'¿Qué grupo de palabras resume mejor los temas centrales del texto?',o:[t3.join(', '),[t3[0],far[0],far[1]].join(', '),[far[2],far[3],t3[1]].join(', '),[far[4],far[5],far[6]||far[0]].join(', ')],h:'Piensa en las palabras que se repiten a lo largo de todo el texto.',e:`Las palabras «${t3.join('», «')}» son las que más se repiten y articulan el texto.`});
  const s1=sents.find(o=>wc(o.s)>12&&o.pi>0)||sents[0];
  bank.push({d:'G',t:'abierta',lv:1,q:'Escribe en dos o tres oraciones de qué trata el texto y cuál es su idea principal.',cr:['Menciona el tema central.','Expresa la idea principal con sus palabras.','No se queda en un detalle aislado.'],kw:top.slice(0,8),m:''});
  if(s1)bank.push({d:'I',t:'abierta',lv:2,q:`Explica con tus palabras qué quiere decir esta parte del texto y qué se puede inferir de ella: «${s1.s}»`,cr:['Explica el sentido del fragmento.','Hace una inferencia (algo que no está dicho directamente).','Se apoya en el texto.'],kw:keywords(s1.s,8),m:''});
  if(top.length>=2)bank.push({d:'I',t:'abierta',lv:2,q:`¿Qué relación hay entre «${top[0]}» y «${top[1]}» en el texto? Explícalo con un ejemplo del texto.`,cr:['Identifica la relación (causa, comparación, consecuencia…).','Da un ejemplo del texto.','Explica con sus palabras.'],kw:[top[0],top[1]],m:''});
  bank.push({d:'C',t:'abierta',lv:2,q:'¿Cuál crees que fue la intención del autor al escribir este texto? Justifícalo con una frase del texto.',cr:['Identifica una intención (informar, convencer, entretener, advertir…).','Cita o parafrasea una frase del texto.','Explica la relación.'],kw:['informar','convencer','entretener','advertir','ensenar','explicar','reflexion',...top.slice(0,4)],m:''});
  bank.push({d:'C',t:'abierta',lv:3,q:'¿Estás de acuerdo con las ideas principales del texto? Da tu postura, una evidencia del texto y una explicación.',cr:['Postura clara.','Evidencia del texto.','Explicación propia.'],kw:top.slice(0,8),m:''});
  bank.push({d:'I',t:'abierta',lv:2,q:'Elige una palabra o expresión del texto que te haya parecido difícil o interesante y explica qué significa según el contexto.',cr:['Elige una palabra o expresión del texto.','Explica su significado en contexto.','Muestra cómo el contexto ayuda a entenderla.'],kw:top.slice(0,10),m:''});
  return bank;
}
function localGrade(item,ans){
  const a=norm(ans);const n=wc(ans);let s=0;const got=[],miss=[];
  if(n>=15){s++;got.push('Tu respuesta tiene suficiente desarrollo.')}else miss.push('Desarrolla más tu idea (al menos 2 o 3 oraciones).');
  const kw=(item.kw||[]).map(norm).filter(Boolean);const tk=keywords(ST.text.body,25).map(norm);const hit=[...kw,...tk].some(k=>k.length>3&&a.includes(k.slice(0,Math.max(4,k.length-2))));
  if(hit){s++;got.push('Retomas ideas o palabras clave del texto.')}else miss.push('Apóyate en una idea o frase concreta del texto.');
  if(/(porque|ya que|por eso|debido|puesto que|por lo tanto|es decir|por ejemplo|asi que)/.test(a)&&/(creo|pienso|considero|opino|estoy de acuerdo|no estoy|me parece|en mi opinion|para mi|significa|quiere decir|se infiere|el autor)/.test(a)){s++;got.push('Explicas y razonas tu respuesta.')}else miss.push('Usa conectores como «porque», «ya que» o «por ejemplo» para justificar.');
  if(n<4)s=0;
  return {puntaje:s,retro:(got.length?'<b>Lo logrado:</b> '+got.join(' '):'')+(miss.length?' <b>Para mejorar:</b> '+miss.join(' '):''),local:true};
}
async function startQuiz(){
  const sec=$('#s-quiz');ST.cur=0;ST.answers=[];ST.hints=0;
  sec.innerHTML=`<div class="loading"><span class="orb"></span><h3 style="font-size:24px">${AI.on()?'Claude está creando tus preguntas…':'Preparando tus preguntas…'}</h3><p id="genMsg">${AI.on()?`Estoy leyendo «${esc(ST.text.title)}» y diseñando ${ST.plan.n} preguntas para tu nivel. Suele tardar entre 20 y 60 segundos.`:'Uso el banco de preguntas de la app.'}</p>${AI.on()?'<button class="btn ghost sm" id="genCancel">Cancelar y usar preguntas sin IA</button>':''}</div>`;
  show('quiz');
  let qs=[];ST.source='';
  if(AI.on()){
    const ctl=new AbortController();$('#genCancel').onclick=()=>ctl.abort();
    const tips=['Tip: una inferencia es lo que el texto dice sin decirlo directamente.','Tip: la idea principal abarca todo el texto, no solo un párrafo.','Tip: pregúntate siempre «¿para qué escribió esto el autor?».','Tip: en las preguntas abiertas usa Postura → Evidencia → Explicación.'];let ti=0;
    const tInt=setInterval(()=>{const m=$('#genMsg');if(m)m.textContent=tips[ti++%tips.length]},6000);
    try{const raw=await AI.ask(genPrompt(),{json:true,signal:ctl.signal,cache:false});qs=normAIQ(raw);if(raw&&raw.tipoTexto&&!ST.text.preset)ST.text.kind=raw.tipoTexto;ST.source='Claude (IA)'}
    catch(e){if(e.code!=='cancelled')toast(AI.errMsg(e)+' Usaré preguntas sin IA.',4200);}
    clearInterval(tInt);
    if(qs.length<Math.ceil(ST.plan.n*.6))qs=[];
  }
  if(!qs.length){
    if(ST.text.preset){qs=pickFromBank(ST.text.preset.bank,ST.plan);ST.source='Banco curado por Claude'}
    else{qs=pickFromBank(offlineBank(ST.text.body),ST.plan);ST.source='Generador automático sin IA';if(!AI.on())toast('Sin IA activa, las preguntas son automáticas y más básicas. Actívala en Configurar IA para mejores preguntas.',5000)}
  }
  // preparar: barajar opciones, recortar a nivel R
  ST.questions=qs.map((q,i)=>{const c={...q,id:i};
    if(q.t==='opcion'){let opts=q.o.slice(0,ST.plan.opts);const correct=opts[0];opts=shuffle(opts);c.opts=opts;c.ans=opts.indexOf(correct)}
    if(q.t==='ordenar'){c.correctOrder=q.items.slice();let sh=shuffle(q.items);let tries=0;while(sh.join('|')===q.items.join('|')&&tries++<5)sh=shuffle(q.items);c.cur=sh}
    return c});
  // orden pedagógico: L → G → I → C
  const ord={L:0,G:1,I:2,C:3};ST.questions.sort((a,b)=>ord[a.d]-ord[b.d]||(a.t==='abierta')-(b.t==='abierta'));ST.questions.forEach((q,i)=>q.id=i);
  ST.quizStart=Date.now();renderQ();
}

const TNAME={opcion:'Opción múltiple',vf:'Verdadero o falso',ordenar:'Ordenar',abierta:'Respuesta escrita'};
function renderQ(){
  const sec=$('#s-quiz');const q=ST.questions[ST.cur];const n=ST.questions.length;const a=ST.answers[ST.cur];
  const dots=ST.questions.map((_,i)=>{const r=ST.answers[i];return `<i class="${i===ST.cur?'cur':r?(r.score>=.99?'ok':r.score>0?'part':'bad'):''}" title="Pregunta ${i+1}"></i>`}).join('');
  let body='';
  if(q.t==='opcion')body=`<div class="opts">${q.opts.map((o,i)=>`<button class="opt" data-i="${i}" aria-pressed="false"><b>${'ABCDE'[i]}</b><span>${esc(o)}</span></button>`).join('')}</div>`;
  if(q.t==='vf')body=`<div class="quote">${esc(q.q)}</div><div class="vf"><button class="opt" data-i="1" aria-pressed="false">Verdadero</button><button class="opt" data-i="0" aria-pressed="false">Falso</button></div>`;
  if(q.t==='ordenar')body=`<div class="order" id="ord"></div>`;
  if(q.t==='abierta')body=`<div class="field"><textarea id="openAns" rows="6" placeholder="Escribe tu respuesta. Recuerda: postura o idea → evidencia del texto → explicación."></textarea><span class="hint" id="wcount">0 palabras</span></div>${q.cr&&q.cr.length?`<details><summary class="hint" style="cursor:pointer">Ver qué se va a evaluar</summary><ul class="hint" style="margin:6px 0 0">${q.cr.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></details>`:''}`;
  const stem=q.t==='vf'?'¿Es verdadera o falsa esta afirmación, según el texto?':q.q;
  sec.innerHTML=`<div class="quiz">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><span class="eyebrow">Paso 3 · ${esc(ST.text.title)}</span><div class="hint">Preguntas: ${esc(ST.source)}</div></div><button class="btn ghost sm" id="peek">📖 Consultar el texto</button></div>
    <div class="dots">${dots}</div>
    <div class="qcard">
      <div class="qh"><span class="tag mono">${ST.cur+1} / ${n}</span><span class="tag"><i style="background:${DCOL[q.d]}"></i>${DIMS[q.d]}</span><span class="tag">${TNAME[q.t]}</span></div>
      <h3>${esc(stem)}</h3>
      ${body}
      <div id="fbBox"></div>
      <div class="qfoot">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${q.h?`<button class="btn ghost sm" id="hintBtn">💡 Pista${ST.plan.hcost?` (−${ST.plan.hcost===.25?'¼':'½'} pt)`:''}</button>`:''}${'speechSynthesis' in window?'<button class="btn ghost sm" id="readQ">🔊 Leer pregunta</button>':''}</div>
        <div style="display:flex;gap:8px"><button class="btn" id="checkBtn" disabled>${q.t==='abierta'?'Enviar respuesta':'Comprobar'}</button><button class="btn lamp" id="nextBtn" hidden>${ST.cur<n-1?'Siguiente →':'Ver mis resultados →'}</button></div>
      </div>
      <p class="hint">${FRAME[q.d]} · ${NEM}</p>
    </div></div>`;
  let pick=null;
  sec.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(ST.answers[ST.cur])return;sec.querySelectorAll('.opt').forEach(x=>x.setAttribute('aria-pressed',x===b));pick=+b.dataset.i;$('#checkBtn').disabled=false});
  if(q.t==='ordenar'){const draw=()=>{$('#ord').innerHTML=q.cur.map((it,i)=>`<div class="oitem" data-i="${i}"><b>${i+1}</b><span>${esc(it)}</span><span class="mv"><button aria-label="Subir" data-m="-1" ${i===0?'disabled':''}>↑</button><button aria-label="Bajar" data-m="1" ${i===q.cur.length-1?'disabled':''}>↓</button></span></div>`).join('')};draw();$('#checkBtn').disabled=false;
    $('#ord').onclick=e=>{const b=e.target.closest('button[data-m]');if(!b||ST.answers[ST.cur])return;const i=+b.closest('.oitem').dataset.i,j=i+ +b.dataset.m;[q.cur[i],q.cur[j]]=[q.cur[j],q.cur[i]];draw();$('#ord').querySelector(`.oitem[data-i="${j}"] button[data-m="${b.dataset.m}"]`)?.focus()}}
  if(q.t==='abierta'){const ta=$('#openAns');ta.oninput=()=>{const w=wc(ta.value);$('#wcount').textContent=w+' palabra'+(w===1?'':'s');$('#checkBtn').disabled=w<3};ta.focus()}
  const hb=$('#hintBtn');if(hb)hb.onclick=()=>{q.hintUsed=true;ST.hints++;hb.disabled=true;$('#fbBox').innerHTML=`<div class="fb part"><span>💡 ${esc(q.h)}</span></div>`};
  const rq=$('#readQ');if(rq)rq.onclick=()=>speakPlain(stem+'. '+(q.t==='opcion'?q.opts.map((o,i)=>'ABCDE'[i]+'. '+o).join('. '):q.t==='vf'?q.q:''));
  $('#peek').onclick=()=>openDrawer(`<button class="btn ghost sm" data-do="closeDrawer" style="justify-self:end">Cerrar ✕</button><span class="eyebrow">${esc(ST.text.kind)}</span><h3 style="font-family:var(--read);font-weight:500;font-size:24px">${esc(ST.text.title)}</h3><div class="text${ST.text.poem?' poem':''}" style="--fs:17px">${ST.text.body.split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,ST.text.poem?'<br>':' ')}</p>`).join('')}</div>`);
  $('#checkBtn').onclick=async()=>{
    const btn=$('#checkBtn');btn.disabled=true;let res;
    if(q.t==='opcion'){const ok=pick===q.ans;res={score:ok?1:0,given:q.opts[pick]};sec.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const i=+b.dataset.i;if(i===q.ans)b.classList.add('right');else if(i===pick)b.classList.add('wrong')})}
    if(q.t==='vf'){const ok=(pick===1)===q.a;res={score:ok?1:0,given:pick===1?'Verdadero':'Falso'};sec.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const v=+b.dataset.i===1;if(v===q.a)b.classList.add('right');else if(+b.dataset.i===pick)b.classList.add('wrong')})}
    if(q.t==='ordenar'){const right=q.cur.filter((it,i)=>it===q.correctOrder[i]).length;res={score:right===q.cur.length?1:right/q.cur.length*.5,given:q.cur.join(' → ')};
      $('#ord').querySelectorAll('.oitem').forEach((el,i)=>{el.classList.add(q.cur[i]===q.correctOrder[i]?'right':'wrong');el.querySelectorAll('button').forEach(b=>b.disabled=true)})}
    if(q.t==='abierta'){const ans=$('#openAns').value.trim();$('#openAns').disabled=true;$('#fbBox').innerHTML='<div class="fb part"><span class="typing"><i></i><i></i><i></i> Evaluando tu respuesta…</span></div>';let g=null;
      if(AI.on()){try{g=await AI.ask(gradePrompt(q,ans),{json:true,tier:'default',cache:false});g.puntaje=Math.max(0,Math.min(3,Math.round(+g.puntaje||0)))}catch(e){g=null}}
      if(!g)g=localGrade(q,ans);
      res={score:g.puntaje/3,given:ans,rub:g.puntaje,retro:g.retro,fort:g.fortaleza,mej:g.mejora,local:!!g.local}}
    if(q.hintUsed&&ST.plan.hcost&&res.score>0)res.score=Math.max(0,res.score-ST.plan.hcost);
    res.d=q.d;res.t=q.t;res.hint=!!q.hintUsed;ST.answers[ST.cur]=res;
    const cls=res.score>=.99?'ok':res.score>0?'part':'bad';const title=q.t==='abierta'?`Tu respuesta: ${res.rub}/3`:res.score>=.99?pickRand(['¡Correcto!','¡Muy bien!','¡Exacto!','¡Así es!']):res.score>0?'Casi':'No es correcta';
    let extra='';
    if(q.t==='abierta'){extra=`<span class="rub">${[1,2,3].map(i=>`<i class="${res.rub>=i?'on':''}"></i>`).join('')}</span><div>${res.local?res.retro:md(String(res.retro||''))}</div>${res.fort?`<div><b>Fortaleza:</b> ${esc(res.fort)}</div>`:''}${res.mej?`<div><b>Para mejorar:</b> ${esc(res.mej)}</div>`:''}${q.m?`<details><summary style="cursor:pointer;font-weight:600">Ver una respuesta modelo</summary><p style="margin-top:6px">${esc(q.m)}</p></details>`:''}${res.local?'<span class="hint">Evaluación automática sin IA (orientativa).</span>':''}`}
    else{if(res.score<.99){if(q.t==='opcion')extra+=`<div>La respuesta correcta es <b>${'ABCDE'[q.ans]}: ${esc(q.opts[q.ans])}</b></div>`;if(q.t==='vf')extra+=`<div>La afirmación es <b>${q.a?'verdadera':'falsa'}</b>.</div>`;if(q.t==='ordenar')extra+=`<div>Orden correcto: ${q.correctOrder.map((x,i)=>`<br><b>${i+1}.</b> ${esc(x)}`).join('')}</div>`}
      if(q.e)extra+=`<div>${esc(q.e)}</div>`;if(q.ev)extra+=`<div class="ev">«${esc(q.ev)}»</div>`}
    $('#fbBox').innerHTML=`<div class="fb ${cls}"><b class="t">${title}</b>${extra}</div>`;
    btn.hidden=true;$('#nextBtn').hidden=false;$('#nextBtn').focus();const hb2=$('#hintBtn');if(hb2)hb2.disabled=true;
    sec.querySelector('.dots').children[ST.cur].className=cls==='ok'?'ok':cls;
  };
  $('#nextBtn').onclick=()=>{if(ST.cur<n-1){ST.cur++;renderQ();window.scrollTo({top:0})}else finishQuiz()};
}
const pickRand=a=>a[Math.floor(Math.random()*a.length)];
function gradePrompt(q,ans){return `Eres Claude, docente que evalúa comprensión lectora de un estudiante de 3.º de secundaria en México (14-15 años). Evalúa su respuesta abierta con justicia y calidez; no penalices la ortografía.

PREGUNTA: ${q.q}
CRITERIOS (cada uno vale 1 punto): ${(q.cr||[]).map((c,i)=>`${i+1}) ${c}`).join(' ')}
${q.m?`RESPUESTA DE REFERENCIA (orientativa, se aceptan otras): ${q.m}`:''}
TEXTO LEÍDO (fragmento): """${ST.text.body.slice(0,6000)}"""
RESPUESTA DEL ESTUDIANTE: """${ans}"""

Responde SOLO JSON: {"puntaje":0-3,"retro":"2 oraciones dirigidas al estudiante (tú)","fortaleza":"1 oración","mejora":"1 oración concreta con un ejemplo de cómo mejorarla"}`}

async function finishQuiz(){
  const A=ST.answers;const qs=ST.questions;const n=qs.length;const total=A.reduce((s,a)=>s+(a?a.score:0),0);
  const cal=10*total/n;const dims={};const cnt={};for(const d of 'LGIC'){const xs=A.filter(a=>a&&a.d===d);cnt[d]=xs.length;dims[d]=xs.length?100*mean(xs.map(a=>a.score)):null}
  const b=baseline(ST.user);const mins=(Date.now()-ST.quizStart)/60000;
  ST.result={cal,dims,cnt,n,total,lv:lvl(cal),before:b,mins,hints:A.filter(a=>a&&a.hint).length,date:new Date().toISOString(),open:A.filter(a=>a&&a.t==='abierta')};
  const rec={text:ST.text.title,kind:ST.text.kind,src:ST.source,preset:ST.text.preset?ST.text.preset.id:'',cal:+cal.toFixed(2),n,dims,before:+b.cal.toFixed(2),ppm:ST.ppm,mins:+mins.toFixed(1),hints:ST.result.hints,open3:ST.result.open.filter(a=>a.rub>=3).length,words:wc(ST.text.body),own:!ST.text.preset,lv:lvl(cal),plan:ST.plan.lv};
  const before=computeProgress(ST.user);ST.result.saved=false;
  $('#s-quiz').innerHTML='<div class="loading"><span class="orb"></span><h3>Guardando tu avance…</h3></div>';
  try{const r=await API.call('/me/session',{rec});ST.user.sessions=r.sessions;ST.result.saved=true}
  catch(e){ST.user.sessions=[...ST.user.sessions,Object.assign({date:Date.now()},rec)];toast('No se pudo guardar en el servidor: '+e.message,5000)}
  const after=computeProgress(ST.user);
  ST.result.xpGain=after.xp-before.xp;ST.result.newBadges=after.badges.filter(x=>x.got&&!before.badges.find(y=>y.id===x.id).got);ST.result.rankUp=after.rank.i>before.rank.i?after.rank:null;ST.result.prog=after;
  renderResults();
}
function radar(before,after){
  const W=400,H=300,cx=200,cy=150,R=104;const axes=['L','G','I','C'];const ang=i=>-Math.PI/2+i*Math.PI/2;
  const pt=(v,i)=>[cx+Math.cos(ang(i))*R*v/100,cy+Math.sin(ang(i))*R*v/100];
  const poly=vals=>axes.map((d,i)=>pt(vals[d]??0,i).map(n=>n.toFixed(1)).join(',')).join(' ');
  let s=`<svg class="radar" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:420px" role="img" aria-label="Comparación por proceso">`;
  [25,50,75,100].forEach(v=>s+=`<polygon class="rg" points="${axes.map((d,i)=>pt(v,i).join(',')).join(' ')}"/>`);
  axes.forEach((d,i)=>{const [x,y]=pt(100,i);s+=`<line class="ax" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;const [lx,ly]=pt(122,i);s+=`<text x="${lx}" y="${ly+4}" text-anchor="middle" style="font-weight:600">${DSHORT[d]}</text>`});
  s+=`<polygon points="${poly(before)}" style="fill:var(--sea);fill-opacity:.12;stroke:var(--sea);stroke-width:2;stroke-dasharray:5 4"/>`;
  s+=`<polygon points="${poly(after)}" style="fill:var(--lamp);fill-opacity:.35;stroke:var(--lamp);stroke-width:2.5"/>`;
  axes.forEach((d,i)=>{if(after[d]==null)return;const [x,y]=pt(after[d],i);s+=`<circle cx="${x}" cy="${y}" r="5" style="fill:var(--lamp);stroke:var(--panel);stroke-width:2"/>`});
  return s+'</svg>';
}
function deltaChip(d,unit=''){if(d==null||isNaN(d))return '<span class="delta eq">—</span>';const r=Math.round(d*10)/10;const cls=r>0.05?'up':r<-0.05?'down':'eq';return `<span class="delta ${cls}">${r>0?'▲':r<0?'▼':'='} ${Math.abs(r).toFixed(unit==='%'?0:1)}${unit}</span>`}
function localReport(){
  const R=ST.result,b=R.before,u=ST.user;const d=R.cal-b.cal;const best=[...'LGIC'].filter(x=>R.dims[x]!=null).sort((a,c)=>R.dims[c]-R.dims[a]);const top=best[0],low=best[best.length-1];
  const imp=[...'LGIC'].filter(x=>R.dims[x]!=null).map(x=>({x,dd:R.dims[x]-b.dims[x]})).sort((a,c)=>c.dd-a.dd);
  const TIPS={L:['Antes de responder, localiza la oración exacta en el texto y subráyala.','Lee la pregunta dos veces e identifica la palabra clave que debes buscar.','Usa la lectura en voz alta de Faro Lector para seguir el texto línea por línea.'],
    G:['Al terminar cada párrafo, escribe en tu cuaderno una frase que diga de qué trató.','Pregúntate: ¿qué idea une a todo el texto, desde el inicio hasta el final?','Distingue la idea principal (abarca todo) de los detalles (una sola parte).'],
    I:['Busca «pistas»: si el texto dice A y B, ¿qué puedes concluir aunque no lo diga?','Cuando encuentres una metáfora, pregúntate: ¿qué se compara con qué y por qué?','Usa «Pregúntale a Claude» para explorar el sentido de frases figuradas.'],
    C:['Identifica la postura del autor: ¿qué quiere que pienses o hagas?','En tus respuestas usa la fórmula Postura → Evidencia del texto → Explicación.','Compara lo que dice el texto con tu experiencia y con otras fuentes.']};
  const verdict=d>=1?`¡Avanzaste de forma notable! Subiste <b>${f1(d)} puntos</b> respecto a ${b.own?'tu diagnóstico':b.label.toLowerCase()}.`:d>=.3?`Mejoraste <b>${f1(d)} puntos</b> respecto a ${b.own?'tu diagnóstico':b.label.toLowerCase()}. Vas en la dirección correcta.`:d>-.3?`Mantuviste un nivel muy similar al de ${b.own?'tu diagnóstico':b.label.toLowerCase()} (${f1(b.cal)}). Es una base estable para seguir creciendo.`:`Esta vez obtuviste <b>${f1(Math.abs(d))} puntos menos</b> que en ${b.own?'tu diagnóstico':b.label.toLowerCase()}. No te desanimes: este texto y estas preguntas fueron distintos${ST.plan.lv==='D'||ST.plan.lv==='S'?' y más exigentes':''}; analicemos dónde estuvo la dificultad.`;
  let h=`## Conclusión\n`;
  h+=`Obtuviste **${f1(R.cal)} de 10** (${Math.round(R.total*10)/10} de ${R.n} puntos) en «${ST.text.title}», nivel **${LV[R.lv]}**. ${verdict.replace(/<\/?b>/g,'**')}\n\n`;
  h+=`## Lo que hiciste muy bien\n- Tu proceso más sólido fue **${DIMS[top].toLowerCase()}** (${pct(R.dims[top])}).\n`;
  if(imp[0]&&imp[0].dd>0)h+=`- Donde más creciste fue en **${DIMS[imp[0].x].toLowerCase()}**: de ${pct(b.dims[imp[0].x])} a ${pct(R.dims[imp[0].x])}.\n`;
  const perfect=R.open.filter(a=>a.rub>=3).length;if(perfect)h+=`- Escribiste ${perfect} respuesta${perfect>1?'s':''} abierta${perfect>1?'s':''} con la máxima valoración: sabes argumentar.\n`;
  if(R.hints===0)h+=`- Resolviste todo sin usar pistas: lectura autónoma.\n`;
  h+=`\n## Lo que puedes mejorar\n`;
  if(low!==top)h+=`- Tu proceso más bajo fue **${DIMS[low].toLowerCase()}** (${pct(R.dims[low])}).\n`;
  const fails=ST.questions.map((q,i)=>({q,a:R?ST.answers[i]:null})).filter(o=>o.a&&o.a.score<.99);
  fails.slice(0,3).forEach(o=>h+=`- En «${o.q.t==='vf'?o.q.q.slice(0,90):o.q.q.slice(0,90)}${o.q.q.length>90?'…':''}» (${DSHORT[o.q.d]}) ${o.q.t==='abierta'?'tu respuesta necesita más sustento del texto':'conviene volver al texto y buscar la evidencia'}.\n`);
  if(!fails.length)h+=`- ¡Ningún error! El siguiente reto es un texto de mayor dificultad.\n`;
  h+=`\n## Comparativo con ${b.own?'tu diagnóstico':'la referencia'}\n`;
  [...'LGIC'].forEach(x=>{if(R.dims[x]==null)return;const dd=R.dims[x]-b.dims[x];h+=`- ${DIMS[x]}: ${pct(b.dims[x])} → **${pct(R.dims[x])}** (${dd>=0?'+':''}${Math.round(dd)} puntos porcentuales)\n`});
  if(ST.ppm)h+=`- Velocidad lectora: **${ST.ppm} palabras por minuto** (referencia SEP de 3.º de secundaria: 165–170).\n`;
  h+=`\n## Tu plan para las próximas dos semanas\n`;TIPS[low].forEach(t=>h+=`- ${t}\n`);
  h+=`- Lee al menos 15 minutos diarios un texto de tu interés y resume cada párrafo en una línea.\n- Regresa a Faro Lector con ${low==='C'||low==='I'?'un texto argumentativo o literario':'un texto informativo'} y compara tu resultado.\n`;
  h+=`\n## Un mensaje para ti\n${d>=0?'Leer bien no es leer rápido: es hacerse buenas preguntas. Hoy demostraste que puedes hacerlo, y cada lectura te acerca a leer con luz propia.':'Un resultado no te define: te muestra el camino. Los buenos lectores también se equivocan; la diferencia es que vuelven al texto para entender por qué. ¡Tú puedes!'}\n`;
  return h;
}
function reportPrompt(){
  const R=ST.result,b=R.before,u=ST.user;
  const items=ST.questions.map((q,i)=>{const a=ST.answers[i];return `${i+1}. [${DIMS[q.d]} · ${TNAME[q.t]}] ${q.t==='vf'?'Afirmación: ':''}${q.q.slice(0,160)} → ${a?(a.score>=.99?'correcta':a.score>0?`parcial (${Math.round(a.score*100)}%)`:'incorrecta'):'sin responder'}${a&&a.t==='abierta'?` · respuesta: «${String(a.given).slice(0,300)}» (${a.rub}/3)`:''}${a&&a.hint?' · usó pista':''}`}).join('\n');
  return `Eres Claude, tutor de comprensión lectora de un estudiante de 3.º de secundaria en México (NEM, campo formativo Lenguajes; marcos PISA y PIRLS). Escribe su informe de resultados dirigido a él o ella (tú), en español de México, honesto, cálido y específico. Máximo 420 palabras. Usa estos encabezados exactos con "## ": Conclusión, Lo que hiciste muy bien, Lo que puedes mejorar, Comparativo con tu diagnóstico, Tu plan para las próximas dos semanas, Un mensaje para ti. Usa viñetas "- " y **negritas** para lo clave. No inventes datos.

ESTUDIANTE: ${u.type==='known'?`con diagnóstico, ${gName(u.g)}`:'sin diagnóstico previo'} · punto de partida: ${b.label} = ${f1(b.cal)}/10 (${LV[b.lv]}).
Diagnóstico por proceso: ${[...'LGIC'].map(d=>`${DIMS[d]} ${pct(b.dims[d])}`).join('; ')}.
${u.type==='known'?`Errores del diagnóstico inicial: ${DB.Q.filter(q=>!u.stu.ans[q.k]).map(q=>q.skill).join(', ')||'ninguno'}.`:''}
HOY · texto: «${ST.text.title}» (${ST.text.kind}). Calificación: ${f1(R.cal)}/10 (${LV[R.lv]}), ${Math.round(R.total*10)/10} de ${R.n} puntos. Por proceso: ${[...'LGIC'].map(d=>`${DIMS[d]} ${R.dims[d]==null?'sin preguntas':pct(R.dims[d])}`).join('; ')}. Pistas usadas: ${R.hints}. Tiempo de evaluación: ${f1(R.mins)} min.${ST.ppm?` Velocidad lectora: ${ST.ppm} palabras/min (referencia SEP 3.º sec: 165-170).`:''}
DETALLE DE RESPUESTAS:
${items}

En "Comparativo" contrasta cada proceso antes y después con cifras y explica qué significa el cambio (considera que el texto y la dificultad fueron distintos). En "Plan" da 4 acciones concretas y medibles, una de ellas usando tecnología de forma responsable.`;
}
function renderResults(){
  const R=ST.result,b=R.before;const sec=$('#s-res');const d=R.cal-b.cal;
  const hist=ST.user.sessions.slice(-12);
  sec.innerHTML=`
  <div class="head"><span class="eyebrow">Paso 4 · Resultados · ${esc(ST.text.title)}</span><h2>${d>=.3?'¡Tu lectura brilló!':d>-.3?'Resultado firme':'Cada lectura enseña algo'}</h2></div>
  <div class="grid2">
    <div class="card">
      <div class="bigcmp">
        <div class="n"><span>${esc(b.label)}</span><b class="num" style="color:var(--muted)">${f1(b.cal)}</b><span class="chip ${b.lv}" style="justify-self:start">${LV[b.lv]}</span></div>
        <span class="arrow" aria-hidden="true">→</span>
        <div class="n"><span>Hoy</span><b class="num">${f1(R.cal)}</b><span class="chip ${R.lv}" style="justify-self:start">${LV[R.lv]}</span></div>
        <div style="display:grid;gap:6px">${deltaChip(d)}<span class="hint">${Math.round(R.total*10)/10} de ${R.n} puntos · ${f1(R.mins)} min${R.hints?` · ${R.hints} pista${R.hints>1?'s':''}`:''}</span></div>
      </div>
      <div style="display:grid;gap:10px">
        ${[...'LGIC'].map(x=>`<div style="display:grid;grid-template-columns:minmax(0,150px) 1fr auto;gap:10px;align-items:center;font-size:13.5px"><span><b>${DSHORT[x]}</b> <span class="muted">(${R.cnt[x]})</span></span>
          <div style="display:grid;gap:3px"><div class="track" style="height:8px"><i class="fill" style="width:${b.dims[x]}%;background:var(--sea);opacity:.45"></i></div><div class="track" style="height:10px"><i class="fill" style="width:${R.dims[x]??0}%;background:var(--lamp)"></i></div></div>
          <span style="display:flex;gap:6px;align-items:center"><span class="num muted">${pct(b.dims[x])}</span>→<b class="num">${R.dims[x]==null?'—':pct(R.dims[x])}</b>${R.dims[x]==null?'':deltaChip(R.dims[x]-b.dims[x],'%')}</span></div>`).join('')}
        <div class="legend"><span><i class="sw" style="background:var(--sea);opacity:.45"></i>${esc(b.label)}</span><span><i class="sw" style="background:var(--lamp)"></i>Hoy</span></div>
      </div>
    </div>
    <div class="card" style="justify-items:center">
      <h3 style="justify-self:start">Tu mapa lector</h3>
      ${radar(b.dims,R.dims)}
      <div class="legend"><span><i class="sw" style="background:var(--sea)"></i>${esc(b.label)} (línea punteada)</span><span><i class="sw" style="background:var(--lamp)"></i>Hoy</span></div>
    </div>
  </div>
  <div class="say"><span class="orb" id="repOrb"></span><div class="bub"><span class="who">CLAUDE · ANÁLISIS DE TU RESULTADO ${AI.on()?'':'· MODO SIN IA'}</span><div id="report"><span class="typing"><i></i><i></i><i></i> Claude está analizando tus respuestas…</span></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn soft sm" id="repSpeak">🔊 Escuchar</button><button class="btn ghost sm" id="repCopy">📋 Copiar informe</button><button class="btn ghost sm" id="repSave">⬇️ Descargar informe</button></div></div></div>
  <div class="card"><h3>Pregunta por pregunta</h3><div class="scroll"><table><thead><tr><th>#</th><th>Proceso</th><th>Tipo</th><th>Pregunta</th><th>Resultado</th></tr></thead><tbody>
    ${ST.questions.map((q,i)=>{const a=ST.answers[i];const c=a.score>=.99?'ok':a.score>0?'part':'bad';return `<tr><td class="num">${i+1}</td><td><span class="tag"><i style="background:${DCOL[q.d]}"></i>${DSHORT[q.d]}</span></td><td>${TNAME[q.t]}</td><td>${esc((q.t==='vf'&&!q.q.startsWith('«')?'«'+q.q+'»':q.q).slice(0,150))}</td><td class="mark ${c}">${q.t==='abierta'?a.rub+'/3':c==='ok'?'✓ Correcta':c==='part'?'◐ Parcial':'✗ Incorrecta'}${a.hint?' <span class="hint">(pista)</span>':''}</td></tr>`}).join('')}
  </tbody></table></div></div>
  ${achievementsCard()}
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn lamp lg" id="again">📚 Leer otro texto</button><button class="btn ghost lg" id="retry">↻ Nuevas preguntas de este texto</button><button class="btn ghost lg" id="toDiag">Ver mi diagnóstico</button></div>`;
  show('res');
  if(d>=.5||R.newBadges&&R.newBadges.length||R.rankUp)setTimeout(confetti,300);
  wireAchievementsCard();
  $('#again').onclick=()=>{renderLibrary();show('lib')};
  $('#retry').onclick=()=>startQuiz();
  $('#toDiag').onclick=()=>renderDiag();
  const out=$('#report');let reportText='';
  const done=t=>{reportText=t;out.innerHTML=md(t);$('#repOrb').classList.remove('live')};
  $('#repOrb').classList.add('live');
  if(AI.on()){AI.ask(reportPrompt(),{onText:({text})=>{reportText=text;out.innerHTML=md(text)},cache:false}).then(done).catch(e=>{done(localReport());toast(AI.errMsg(e)+' Mostré el análisis automático.',4000)})}
  else done(localReport());
  $('#repSpeak').onclick=()=>speakPlain(out.innerText,$('#repOrb'));
  const full=()=>{const R=ST.result;return `FARO LECTOR · INFORME DE LECTURA\n${ST.user.name} · ${gName(ST.user.g)}\nFecha: ${new Date(R.date).toLocaleString('es-MX')}\nTexto: ${ST.text.title} (${ST.text.kind})\nPreguntas: ${ST.source}\n\nCalificación: ${f1(R.before.cal)} (${R.before.label}) → ${f1(R.cal)} hoy\n${[...'LGIC'].map(x=>`${DIMS[x]}: ${pct(R.before.dims[x])} → ${R.dims[x]==null?'—':pct(R.dims[x])}`).join('\n')}${ST.ppm?`\nVelocidad lectora: ${ST.ppm} ppm`:''}\n\n${reportText.replace(/\*\*/g,'')}\n\nDETALLE\n${ST.questions.map((q,i)=>{const a=ST.answers[i];return `${i+1}. [${DSHORT[q.d]}] ${q.q}\n   Respuesta: ${a.given}\n   Resultado: ${q.t==='abierta'?a.rub+'/3':a.score>=.99?'correcta':a.score>0?'parcial':'incorrecta'}`}).join('\n')}`};
  $('#repCopy').onclick=()=>copyText(full());
  $('#repSave').onclick=()=>saveFile(`FaroLector_${ST.user.name.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.txt`,full());
}


/* =====================================================================
   MOTIVACIÓN · FRASES
   ===================================================================== */
const DEFAULT_QUOTES = [
  {t:'Un viaje de mil leguas comienza con un solo paso.',a:'Lao-Tse'},
  {t:'Conocer a los demás es inteligencia; conocerse a sí mismo es sabiduría.',a:'Lao-Tse'},
  {t:'Aprender sin pensar es inútil; pensar sin aprender es peligroso.',a:'Confucio'},
  {t:'No es que tengamos poco tiempo, sino que perdemos mucho.',a:'Séneca'},
  {t:'No son las cosas las que nos perturban, sino las opiniones que tenemos de ellas.',a:'Epicteto'},
  {t:'El alma se tiñe del color de sus pensamientos.',a:'Marco Aurelio'},
  {t:'Nadie se baña dos veces en el mismo río.',a:'Heráclito'},
  {t:'La mente no es un vaso que hay que llenar, sino un fuego que hay que encender.',a:'Plutarco'},
  {t:'Todo lo que somos es el resultado de lo que hemos pensado.',a:'Dhammapada'},
  {t:'La lectura de todos los buenos libros es como una conversación con las mejores personas de los siglos pasados.',a:'René Descartes'},
  {t:'El que lee mucho y anda mucho, ve mucho y sabe mucho.',a:'Miguel de Cervantes'},
  {t:'Yo no estudio para saber más, sino para ignorar menos.',a:'Sor Juana Inés de la Cruz'},
  {t:'Ser culto es el único modo de ser libre.',a:'José Martí'},
  {t:'Yo fui el arquitecto de mi propio destino.',a:'Amado Nervo'},
  {t:'Cuando planté rosales, coseché siempre rosas.',a:'Amado Nervo'},
  {t:'Solo sé que no sé nada.',a:'Sócrates (atribuida)'},
  {t:'Cada página que comprendes es una luz que nadie te puede apagar.',a:'Faro Lector'},
  {t:'Leer no es pasar los ojos por las palabras: es dejar que las palabras te pregunten algo.',a:'Faro Lector'},
  {t:'Hoy no compites con nadie más que con quien eras ayer.',a:'Faro Lector'}
];
function quotes(){const q=API.cfg&&Array.isArray(API.cfg.quotes)&&API.cfg.quotes.length?API.cfg.quotes:DEFAULT_QUOTES;return q}
let quoteOffset=0;
function quoteOfDay(k=0){const q=quotes();const d=Math.floor(Date.now()/864e5);return q[((d+k+quoteOffset)%q.length+q.length)%q.length]}
function quoteHTML(q,id='qod'){return `<figure class="quote-card" id="${id}"><blockquote>«${esc(q.t)}»</blockquote><figcaption>— ${esc(q.a)}</figcaption><button class="linkbtn" data-do="nextQuote" data-t="${id}">Otra frase ↻</button></figure>`}
ACT.nextQuote=el=>{quoteOffset++;const box=document.getElementById(el.dataset.t);if(box)box.outerHTML=quoteHTML(quoteOfDay(),el.dataset.t)};

/* =====================================================================
   LOGROS · RANGOS · INSIGNIAS
   ===================================================================== */
const RANKS=[{min:0,name:'Grumete',icon:'⚓'},{min:150,name:'Marinero',icon:'🧭'},{min:400,name:'Timonel',icon:'☸️'},{min:800,name:'Navegante',icon:'🗺️'},{min:1400,name:'Capitán',icon:'⭐'},{min:2200,name:'Guardián del Faro',icon:'🗼'},{min:3500,name:'Leyenda del Faro',icon:'🌟'}];
const BADGES=[
  {id:'first',icon:'🕯️',name:'Primera luz',desc:'Terminaste tu primera lectura.'},
  {id:'five',icon:'🔥',name:'Constancia',desc:'Completaste 5 lecturas.'},
  {id:'fifteen',icon:'🏮',name:'Faro encendido',desc:'Completaste 15 lecturas.'},
  {id:'streak3',icon:'📅',name:'Racha de 3 días',desc:'Leíste 3 días seguidos.'},
  {id:'streak7',icon:'🌈',name:'Semana brillante',desc:'Leíste 7 días seguidos.'},
  {id:'up',icon:'🚀',name:'Superación',desc:'Superaste tu punto de partida por 1 punto o más.'},
  {id:'record',icon:'🏅',name:'Récord personal',desc:'Superaste tu mejor calificación anterior.'},
  {id:'levelup',icon:'📈',name:'Subí de nivel',desc:'Alcanzaste un nivel de logro mayor que el de tu diagnóstico.'},
  {id:'perfect',icon:'💎',name:'Lectura perfecta',desc:'Obtuviste 10 en una lectura.'},
  {id:'inf',icon:'🔎',name:'Detective de inferencias',desc:'100 % en preguntas inferenciales.'},
  {id:'crit',icon:'⚖️',name:'Pensamiento crítico',desc:'100 % en evaluar y reflexionar.'},
  {id:'eagle',icon:'🦅',name:'Visión global',desc:'100 % en literal y sentido global en la misma lectura.'},
  {id:'fast',icon:'⚡',name:'Lector veloz',desc:'Leíste a 165 palabras por minuto o más.'},
  {id:'pen',icon:'🖋️',name:'Pluma de oro',desc:'Una respuesta escrita con 3 de 3.'},
  {id:'solo',icon:'🧗',name:'Sin pistas',desc:'Una lectura de 10+ preguntas sin usar pistas.'},
  {id:'explorer',icon:'🧳',name:'Explorador',desc:'Leíste 3 textos diferentes.'},
  {id:'library',icon:'📚',name:'Biblioteca completa',desc:'Leíste los 5 textos de la biblioteca.'},
  {id:'own',icon:'📄',name:'Mi propio texto',desc:'Subiste y leíste un texto propio.'},
  {id:'k1',icon:'📖',name:'Mil palabras',desc:'Leíste 1,000 palabras en total.'},
  {id:'k10',icon:'🏛️',name:'Diez mil palabras',desc:'Leíste 10,000 palabras en total.'}
];
function streakOf(days){ // days: Set de 'YYYY-MM-DD'
  if(!days.size)return {cur:0,best:0};
  const sorted=[...days].sort();let best=1,run=1;
  for(let i=1;i<sorted.length;i++){const a=new Date(sorted[i-1]+'T12:00'),b=new Date(sorted[i]+'T12:00');if(Math.round((b-a)/864e5)===1){run++;best=Math.max(best,run)}else run=1}
  let cur=0;const t=new Date();for(let k=0;k<400;k++){const d=new Date(t);d.setDate(t.getDate()-k);const key=dayKey(d);if(days.has(key))cur++;else if(k===0)continue;else break}
  return {cur,best:Math.max(best,cur)};
}
function computeProgress(u){
  const S=[...(u.sessions||[])].sort((a,b)=>a.date-b.date);const diagCal=u.type==='known'?u.stu.cal:null;const diagLv=u.type==='known'?u.stu.lv:null;
  let xp=0,best=0;const got={};const days=new Set();const texts=new Set();const presets=new Set();let words=0,mins=0;const xpList=[];
  S.forEach((s,i)=>{const dk=dayKey(s.date);const newDay=!days.has(dk);const prevDay=(()=>{const d=new Date(s.date);d.setDate(d.getDate()-1);return days.has(dayKey(d))})();
    let x=Math.round(s.cal*10)+Math.min(15,s.n||0);if(i>0&&s.cal>best){x+=15;got.record=got.record||s.date}if(!s.hints&&(s.n||0)>=8)x+=10;x+=10*(s.open3||0);if(s.ppm>=165)x+=10;if(newDay&&prevDay)x+=10;
    xp+=x;xpList.push(x);best=Math.max(best,s.cal);days.add(dk);texts.add(norm(s.text));if(s.preset)presets.add(s.preset);words+=s.words||0;mins+=s.mins||0;
    const base=diagCal!=null?diagCal:s.before;
    const mark=(k,c)=>{if(c&&!got[k])got[k]=s.date};
    mark('first',i===0);mark('five',i===4);mark('fifteen',i===14);mark('up',s.cal>=base+1);mark('perfect',s.cal>=9.95);
    mark('levelup',diagLv&&LVRANK[lvl(s.cal)]>LVRANK[diagLv]);mark('inf',s.dims&&s.dims.I===100);mark('crit',s.dims&&s.dims.C===100);mark('eagle',s.dims&&s.dims.L===100&&s.dims.G===100);
    mark('fast',s.ppm>=165);mark('pen',(s.open3||0)>=1);mark('solo',!s.hints&&(s.n||0)>=10);mark('explorer',texts.size>=3);mark('library',presets.size>=5);mark('own',s.own);mark('k1',words>=1000);mark('k10',words>=10000);
    const sk=streakOf(days);mark('streak3',sk.best>=3);mark('streak7',sk.best>=7);
  });
  const ri=RANKS.reduce((acc,r,i)=>xp>=r.min?i:acc,0);const rank=Object.assign({i:ri},RANKS[ri]);const next=RANKS[ri+1]||null;
  const sk=streakOf(days);const cals=S.map(s=>s.cal);
  return {xp,xpList,rank,next,pctNext:next?Math.round(100*(xp-rank.min)/(next.min-rank.min)):100,
    badges:BADGES.map(b=>Object.assign({},b,{got:!!got[b.id],date:got[b.id]||null})),
    stats:{n:S.length,avg:mean(cals),best:cals.length?Math.max(...cals):0,last:cals[cals.length-1]??null,first:cals[0]??null,words,mins,streak:sk.cur,bestStreak:sk.best,days,texts:texts.size},sessions:S,diagCal};
}
function rankBadge(p,big){return `<span class="rankb${big?' big':''}" title="${p.xp} XP"><i>${p.rank.icon}</i><span><b>${esc(p.rank.name)}</b><small>${p.xp.toLocaleString('es-MX')} XP</small></span></span>`}
function xpBar(p){return `<div class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.pctNext}"><i style="width:${p.pctNext}%"></i></div><span class="hint">${p.next?`${(p.next.min-p.xp).toLocaleString('es-MX')} XP para ${p.next.icon} ${esc(p.next.name)}`:'¡Rango máximo alcanzado!'}</span>`}
function progressStrip(p){
  const got=p.badges.filter(b=>b.got);
  return `<div class="card pstrip"><div class="pstrip-l"><span class="eyebrow">Mi trayecto</span><div class="pstrip-a">${rankBadge(p)}<div style="display:grid;gap:4px;min-width:0">${xpBar(p)}</div></div>
   <div class="pstrip-b"><span class="mini-badges">${got.slice(-8).map(b=>`<i title="${esc(b.name)}">${b.icon}</i>`).join('')||'<span class="hint">Tus insignias aparecerán aquí</span>'}</span><span class="hint">${p.stats.n} lectura${p.stats.n===1?'':'s'} · racha de ${p.stats.streak} día${p.stats.streak===1?'':'s'}</span></div>
   <button class="btn soft" id="goPath" style="justify-self:start">🏆 Ver mi trayecto y logros</button></div>
   ${quoteHTML(quoteOfDay(),'qodDiag')}</div>`;
}
function wireProgressStrip(){const b=$('#goPath');if(b)b.onclick=()=>renderPath()}
function achievementsCard(){
  const R=ST.result;if(!R||!R.prog)return '';const p=R.prog;
  return `<div class="card ach">
   <div class="ach-top"><div><span class="eyebrow">Logros de esta lectura</span><h3>+${R.xpGain} XP ${R.rankUp?`· ¡Ascendiste a ${R.rankUp.icon} ${esc(R.rankUp.name)}!`:''}</h3></div>${rankBadge(p)}</div>
   ${xpBar(p)}
   ${R.newBadges&&R.newBadges.length?`<div class="newbadges">${R.newBadges.map(b=>`<div class="badge got popin"><i>${b.icon}</i><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`).join('')}</div>`:'<p class="hint">Sigue leyendo para desbloquear nuevas insignias.</p>'}
   ${quoteHTML(quoteOfDay(1),'qodRes')}
   <div><button class="btn soft sm" id="goPath2">🏆 Ver mi trayecto completo</button>${R.saved?'':' <span class="hint bad">Esta lectura no se guardó en el servidor.</span>'}</div></div>`;
}
function wireAchievementsCard(){const b=$('#goPath2');if(b)b.onclick=()=>renderPath()}

/* =====================================================================
   MI TRAYECTO
   ===================================================================== */
function lineChart(S,base,opt={}){
  const W=640,H=230,m={l:32,r:14,t:14,b:28};if(!S.length)return '<p class="muted">Aún no hay lecturas para graficar.</p>';
  const n=S.length;const x=i=>m.l+(n===1?(W-m.l-m.r)/2:i*(W-m.l-m.r)/(n-1));const y=v=>H-m.b-v/10*(H-m.t-m.b);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" class="lchart" role="img" aria-label="Calificaciones por lectura">`;
  for(let v=0;v<=10;v+=2)s+=`<line class="gl" x1="${m.l}" x2="${W-m.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${m.l-6}" y="${y(v)+4}" text-anchor="end">${v}</text>`;
  if(base!=null)s+=`<line x1="${m.l}" x2="${W-m.r}" y1="${y(base)}" y2="${y(base)}" class="basel"/><text x="${W-m.r}" y="${y(base)-6}" text-anchor="end" class="basetx">${esc(opt.baseLabel||'Diagnóstico')} ${f1(base)}</text>`;
  const pts=S.map((q,i)=>[x(i),y(q.cal)]);
  s+=`<path d="M${pts.map(p=>p.join(',')).join('L')}L${pts[pts.length-1][0]},${H-m.b}L${pts[0][0]},${H-m.b}Z" class="area"/>`;
  s+=`<path d="M${pts.map(p=>p.join(',')).join('L')}" class="ln"/>`;
  S.forEach((q,i)=>s+=`<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="${i===n-1?6:4.5}" class="pt${i===n-1?' last':''}"><title>${fmtDate(q.date)} · ${esc(q.text)} · ${f1(q.cal)}</title></circle>`);
  const step=Math.ceil(n/8);S.forEach((q,i)=>{if(i%step===0||i===n-1)s+=`<text x="${pts[i][0]}" y="${H-8}" text-anchor="middle">${fmtDate(q.date)}</text>`});
  return s+'</svg>';
}
function calendarHeat(days){
  const cells=[];const t=new Date();const start=new Date(t);start.setDate(t.getDate()-34);
  for(let i=0;i<35;i++){const d=new Date(start);d.setDate(start.getDate()+i);const k=dayKey(d);cells.push(`<i class="${days.has(k)?'on':''}${i===34?' today':''}" title="${d.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'short'})}${days.has(k)?' · leíste':''}"></i>`)}
  return `<div class="cal">${cells.join('')}</div>`;
}
function renderPath(){
  const u=ST.user;const p=computeProgress(u);const S=p.sessions;const b=baseline(u);
  const last3=S.slice(-3);const now={};for(const d of 'LGIC'){const v=last3.map(s=>s.dims&&s.dims[d]).filter(v=>v!=null);now[d]=v.length?mean(v):null}
  const bestS=S.reduce((a,s)=>!a||s.cal>a.cal?s:a,null);
  const sec=$('#s-path');
  sec.innerHTML=`
  <div class="path-hero">
    <div class="path-id"><span class="av big">${esc(initials(u.name))}</span><div><span class="eyebrow">Mi trayecto lector</span><h2>${esc(u.name)}</h2><span class="ink2">${esc(gName(u.g))}</span></div></div>
    <div class="path-rank">${rankBadge(p,true)}<div style="display:grid;gap:4px;min-width:200px">${xpBar(p)}</div></div>
  </div>
  <div class="kpis">
    <div class="kpi"><b class="num">${p.stats.n}</b><span>lecturas terminadas</span></div>
    <div class="kpi"><b class="num">${p.stats.n?f1(p.stats.avg):'—'}</b><span>promedio</span></div>
    <div class="kpi"><b class="num">${p.stats.n?f1(p.stats.best):'—'}</b><span>mejor calificación</span></div>
    <div class="kpi"><b class="num">${p.stats.n?`${p.stats.last-b.cal>=0?'+':''}${f1(p.stats.last-b.cal)}`:'—'}</b><span>última vs ${b.own?'diagnóstico':'referencia'}</span></div>
    <div class="kpi"><b class="num">${p.stats.streak}</b><span>días de racha (mejor: ${p.stats.bestStreak})</span></div>
    <div class="kpi"><b class="num">${p.stats.words.toLocaleString('es-MX')}</b><span>palabras leídas</span></div>
  </div>
  <div class="grid2">
    <div class="card"><h3>Mi evolución</h3>${lineChart(S.slice(-20),b.cal,{baseLabel:b.own?'Diagnóstico':'Referencia'})}<p class="hint">Cada punto es una lectura. La línea punteada es tu punto de partida.</p></div>
    <div class="card"><h3>Mis procesos de lectura</h3>
      ${dimBars([...'LGIC'].map(d=>({d,me:now[d]??0,marks:[{v:b.dims[d],col:'var(--ink)',label:b.own?'Diagnóstico':'Referencia'}]})))}
      <div class="legend"><span><i class="sw" style="background:var(--dI)"></i>Promedio de tus últimas 3 lecturas</span><span><i class="sw" style="background:var(--ink);width:3px"></i>${b.own?'Tu diagnóstico':'Referencia'}</span></div>
      ${bestS?`<p class="ink2" style="font-size:14px">Tu mejor lectura: <b>${esc(bestS.text)}</b> con <b>${f1(bestS.cal)}</b> (${fmtDate(bestS.date)}).</p>`:''}
    </div>
  </div>
  <div class="grid2">
    <div class="card"><h3>Mis días de lectura</h3>${calendarHeat(p.stats.days)}<p class="hint">Últimas 5 semanas. Cada cuadro encendido es un día en que leíste.</p></div>
    <div class="say"><span class="orb" id="motOrb"></span><div class="bub"><span class="who">CLAUDE · TU MENSAJE DE HOY</span><div id="motMsg">${localMotivation(p,b)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn soft sm" id="motSpeak">🔊 Escuchar</button>${AI.on()?'<button class="btn ghost sm" id="motAI">✨ Claude, motívame</button>':''}</div></div></div>
  </div>
  <div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h3>Mis insignias</h3><span class="hint">${p.badges.filter(x=>x.got).length} de ${p.badges.length} desbloqueadas</span></div>
    <div class="badges">${p.badges.map(x=>`<div class="badge${x.got?' got':''}"><i>${x.got?x.icon:'🔒'}</i><b>${esc(x.name)}</b><small>${esc(x.desc)}</small>${x.got?`<em>${fmtDate(x.date)}</em>`:''}</div>`).join('')}</div></div>
  <div class="card"><h3>Rangos del faro</h3><div class="ranks">${RANKS.map((r,i)=>`<div class="rk${i<=p.rank.i?' on':''}${i===p.rank.i?' cur':''}"><i>${r.icon}</i><b>${esc(r.name)}</b><small>${r.min.toLocaleString('es-MX')} XP</small></div>`).join('')}</div>
    <p class="hint">Ganas XP con cada lectura: tu calificación × 10, las preguntas respondidas, récords, lecturas sin pistas, respuestas escritas perfectas, velocidad lectora y días seguidos.</p></div>
  ${S.length?`<div class="card"><h3>Historial</h3><div class="scroll"><table><thead><tr><th>Fecha</th><th>Texto</th><th>Calif.</th><th>L</th><th>G</th><th>I</th><th>C</th><th>ppm</th><th>XP</th></tr></thead><tbody>${S.map((s,i)=>({s,i})).reverse().map(({s,i})=>`<tr><td>${fmtDT(s.date)}</td><td>${esc(s.text)}</td><td class="num"><b>${f1(s.cal)}</b></td>${[...'LGIC'].map(d=>`<td class="num">${s.dims&&s.dims[d]!=null?pct(s.dims[d]):'—'}</td>`).join('')}<td class="num">${s.ppm||'—'}</td><td class="num">+${p.xpList[i]}</td></tr>`).join('')}</tbody></table></div></div>`:''}
  ${quoteHTML(quoteOfDay(2),'qodPath')}
  <div class="row-center"><button class="btn lamp lg" id="pathRead">📚 Leer algo nuevo</button><button class="btn ghost lg" id="pathDiag">Ver mi diagnóstico</button></div>`;
  show('path');
  $('#pathRead').onclick=()=>{renderLibrary();show('lib')};$('#pathDiag').onclick=()=>renderDiag();
  $('#motSpeak').onclick=()=>speakPlain($('#motMsg').innerText,$('#motOrb'));
  const ai=$('#motAI');if(ai)ai.onclick=async()=>{ai.disabled=true;$('#motOrb').classList.add('live');const box=$('#motMsg');box.innerHTML='<span class="typing"><i></i><i></i><i></i> Claude está escribiendo…</span>';
    try{await AI.ask(motivationPrompt(p,b),{onText:({text})=>box.innerHTML=md(text)})}catch(e){box.innerHTML=localMotivation(p,b)+`<p class="hint">${esc(AI.errMsg(e))}</p>`}$('#motOrb').classList.remove('live')};
}
function localMotivation(p,b){
  const s=p.stats;if(!s.n)return `<p>Tu trayecto empieza hoy. Elige un texto que te dé curiosidad, léelo con calma y deja que Faro Lector te acompañe. <b>La primera luz siempre es la más importante.</b></p>`;
  const d=s.last-b.cal;const got=p.badges.filter(x=>x.got).length;
  let h=`<p>Llevas <b>${s.n} lectura${s.n>1?'s':''}</b>, ${s.words.toLocaleString('es-MX')} palabras leídas y <b>${got} insignia${got===1?'':'s'}</b>. `;
  h+=d>=1?`Tu última calificación supera tu punto de partida por <b>${f1(d)} puntos</b>: eso es superación real.`:d>=0?`Te mantienes a la altura de tu punto de partida; el siguiente paso es romper tu récord de <b>${f1(s.best)}</b>.`:`Tu última lectura quedó por debajo de tu punto de partida, y está bien: los grandes lectores también tropiezan. Vuelve al texto y pregúntate por qué.`;
  h+='</p>';
  if(s.streak>=2)h+=`<p>🔥 Llevas <b>${s.streak} días seguidos</b> leyendo. ¡No rompas la racha!</p>`;else h+=`<p>Reto: lee mañana también para empezar una racha.</p>`;
  if(p.next)h+=`<p>Te faltan <b>${(p.next.min-p.xp).toLocaleString('es-MX')} XP</b> para convertirte en <b>${p.next.icon} ${esc(p.next.name)}</b>.</p>`;
  return h;
}
function motivationPrompt(p,b){
  const s=p.stats;const S=p.sessions.slice(-8).map(x=>`${fmtDate(x.date)}: «${x.text}» ${f1(x.cal)}/10 (L ${x.dims.L==null?'-':Math.round(x.dims.L)}, G ${x.dims.G==null?'-':Math.round(x.dims.G)}, I ${x.dims.I==null?'-':Math.round(x.dims.I)}, C ${x.dims.C==null?'-':Math.round(x.dims.C)})`).join('\n');
  return `Eres Claude, tutor de lectura y entrenador motivacional de un estudiante de 3.º de secundaria en México (14-15 años). Escríbele un mensaje breve (máximo 130 palabras), cálido, auténtico y específico, en segunda persona. Reconoce un logro concreto con cifras, señala un reto alcanzable para esta semana y termina con una frase inspiradora corta sobre la lectura o el crecimiento personal, de un filósofo o pensador de dominio público, citada con su autor (solo si estás seguro de la cita; si no, escribe una frase propia).
Datos: punto de partida ${b.label} ${f1(b.cal)}/10. Lecturas: ${s.n}. Promedio ${f1(s.avg)}. Mejor ${f1(s.best)}. Última ${s.last==null?'-':f1(s.last)}. Racha actual ${s.streak} días. Palabras leídas ${s.words}. Rango ${p.rank.name} (${p.xp} XP). Insignias: ${p.badges.filter(x=>x.got).map(x=>x.name).join(', ')||'ninguna'}.
Últimas lecturas:
${S||'ninguna'}`;
}

/* =====================================================================
   FIRMA · ESCUDO ORIGINAL
   ===================================================================== */
let crestN=0;
function crestSVG(size=96){
  const id='cr'+(++crestN);
  return `<svg viewBox="0 0 120 132" width="${size}" height="${Math.round(size*1.1)}" aria-hidden="true" class="crest">
  <defs>
    <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00F0FF"/><stop offset=".55" stop-color="#7C4DFF"/><stop offset="1" stop-color="#FF2BD6"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1A33"/><stop offset="1" stop-color="#05070F"/></linearGradient>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE3A3" stop-opacity=".9"/><stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/></linearGradient>
    <filter id="${id}g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <path d="M60 4 L110 26 V70 C110 100 88 118 60 128 C32 118 10 100 10 70 V26 Z" fill="url(#${id}b)" stroke="url(#${id}a)" stroke-width="3.5" filter="url(#${id}g)"/>
  <path d="M60 14 L100 32 V70 C100 94 83 109 60 118 C37 109 20 94 20 70 V32 Z" fill="none" stroke="url(#${id}a)" stroke-width="1" opacity=".55"/>
  <g stroke="#00F0FF" stroke-width="1.2" opacity=".55" fill="none"><path d="M24 44 H38 L44 50"/><path d="M96 44 H82 L76 50"/><path d="M26 86 H40 L46 80"/><path d="M94 86 H80 L74 80"/></g>
  <g fill="#00F0FF" opacity=".8"><circle cx="24" cy="44" r="2"/><circle cx="96" cy="44" r="2"/><circle cx="26" cy="86" r="2"/><circle cx="94" cy="86" r="2"/></g>
  <path d="M60 36 L104 22 L104 50 Z" fill="url(#${id}c)" opacity=".75"/>
  <path d="M54 44 H66 L69 82 H51 Z" fill="#E9F3FF"/><rect x="53" y="34" width="14" height="10" rx="2" fill="#FFD27A"/><path d="M51 34 H69 L60 27 Z" fill="#7C4DFF"/>
  <path d="M52.5 56 H67.5 M52 68 H68" stroke="#FF2BD6" stroke-width="3"/>
  <path d="M36 94 Q48 88 60 94 Q72 88 84 94 V100 Q72 94 60 100 Q48 94 36 100 Z" fill="url(#${id}a)" opacity=".9"/>
  <text x="60" y="116" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="11" fill="#E8F7FF" letter-spacing="2">CA</text>
</svg>`;
}
function renderSignature(){
  $('#sig').innerHTML=`<div class="sig-card"><div class="sig-crest">${crestSVG(92)}</div>
   <div class="sig-txt"><span class="sig-k">ELABORADO Y DISEÑADO POR</span><b class="sig-n">Ing. Cristóbal Apolinar</b><span class="sig-s">Faro Lector · ${esc(API.cfg?API.cfg.school:'Secundaria General N.º 20')} · Tecnología con énfasis en informática · 2026</span><span class="sig-s dim">Inteligencia artificial: Claude · Acceso cifrado y protegido</span></div>
   <span class="sig-scan" aria-hidden="true"></span></div>`;
}


/* =====================================================================
   CENTRO DE MANDO · ADMINISTRADOR
   ===================================================================== */
const ADM = { ov:null, users:[], groups:[], tab:'res', f:{q:'',g:'',st:''} };
async function renderAdmin(tab){
  if(tab)ADM.tab=tab;
  const sec=$('#s-admin');show('admin');
  sec.innerHTML=`<div class="loading"><span class="orb"></span><h3>Cargando el Centro de mando…</h3></div>`;
  try{ADM.ov=await API.call('/admin/overview');}catch(e){sec.innerHTML=`<div class="card"><p>${esc(e.message)}</p></div>`;return}
  admDerive();admShell();
}
function admDerive(){
  const ov=ADM.ov;const D=new Map();
  ov.diag.forEach(s=>{s.cal=s.pts/9;s.lv=lvl(s.cal);s.dims=dimsOf(s);D.set(String(s.id),s)});
  const now=Date.now();
  ADM.users=ov.users.map(u=>{
    const d=u.src==='diag'?D.get(u.id)||null:null;const S=[...(ov.sessions[u.id]||[])].sort((a,b)=>a.date-b.date);
    const p=computeProgress({type:d?'known':'new',stu:d,sessions:S});const last=S[S.length-1]||null;
    const base=d?d.cal:null;
    return Object.assign({},u,{d,S,p,n:S.length,last,lastCal:last?last.cal:null,best:S.length?Math.max(...S.map(s=>s.cal)):null,avg:S.length?mean(S.map(s=>s.cal)):null,
      delta:last&&base!=null?last.cal-base:(last?last.cal-last.before:null),active7:!!(last&&now-last.date<7*864e5),idle:last?Math.floor((now-last.date)/864e5):null,
      access:u.hasPw?'pw':u.hasInit?'code':'none'});
  });
  ADM.groups=[...new Set(ADM.users.map(u=>u.g))].sort((a,b)=>a.localeCompare(b,'es'));
}
const ATABS=[['res','🛰️ Resumen'],['grp','👥 Grupos'],['alu','🎓 Alumnos'],['pro','🧩 Procesos y textos'],['diag','📊 Diagnóstico original'],['sug','💡 Sugerencias'],['seg','🛡️ Seguridad y accesos'],['fra','💬 Frases']];
function admShell(){
  const U=ADM.users;const withPw=U.filter(u=>u.hasPw).length;
  $('#s-admin').innerHTML=`
  <div class="cmd-hero"><div class="cmd-id">${crestSVG(58)}<div><span class="eyebrow neon">Centro de mando</span><h2>Administrador · ${esc(ADM.ov.settings.school)}</h2><span class="cmd-sub">${U.length} estudiantes · ${withPw} con contraseña · ${API.demo?'modo demostración':'servidor protegido'}</span></div></div>
   <div class="cmd-act"><button class="btn ghost sm" data-do="admRefresh">↻ Actualizar</button><button class="btn ghost sm" data-do="admExport">⬇️ Exportar CSV</button></div></div>
  <nav class="tabs" role="tablist">${ATABS.map(([k,t])=>`<button role="tab" data-do="admTab" data-t="${k}" aria-selected="${ADM.tab===k}">${t}</button>`).join('')}</nav>
  <div id="admBody"></div>`;
  admTab();
}
ACT.admTab=el=>{ADM.tab=el.dataset.t;$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b===el));admTab()};
ACT.admRefresh=()=>renderAdmin();
function admTab(){const f={res:admResumen,grp:admGrupos,alu:admAlumnos,pro:admProcesos,diag:admDiag,sug:admSug,seg:admSeg,fra:admFrases}[ADM.tab];$('#admBody').innerHTML='';f($('#admBody'))}
const kpi=(v,l,sub)=>`<div class="kpi"><b class="num">${v}</b><span>${l}</span>${sub?`<small>${sub}</small>`:''}</div>`;
const accessChip=u=>u.access==='pw'?'<span class="acc ok">🔒 Contraseña</span>':u.access==='code'?'<span class="acc code">🎟️ Código pendiente</span>':'<span class="acc none">○ Sin registrar</span>';
function avgOf(arr,f){const v=arr.map(f).filter(x=>x!=null&&!isNaN(x));return v.length?mean(v):null}

/* ---------- RESUMEN ---------- */
function admResumen(box){
  const U=ADM.users;const all=U.flatMap(u=>u.S.map(s=>Object.assign({u},s)));const now=Date.now();
  const diagAvg=avgOf(U,u=>u.d&&u.d.cal),curAvg=avgOf(U,u=>u.lastCal),dAvg=avgOf(U,u=>u.delta);
  const days=[];for(let i=29;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const k=dayKey(d);days.push({k,d,n:all.filter(s=>dayKey(s.date)===k).length})}
  const maxN=Math.max(4,...days.map(d=>d.n));
  const bars=`<svg viewBox="0 0 620 170" width="100%" class="bchart" role="img" aria-label="Lecturas por día">${[0,.5,1].map(f=>`<line class="gl" x1="30" x2="615" y1="${140-f*120}" y2="${140-f*120}"/><text x="24" y="${144-f*120}" text-anchor="end">${Math.round(maxN*f)}</text>`).join('')}
    ${days.map((d,i)=>{const h=d.n/maxN*120;return `<rect x="${34+i*19.3}" y="${140-h}" width="14" height="${Math.max(h,d.n?2:0)}" rx="3" class="bar"><title>${d.d.toLocaleDateString('es-MX',{day:'numeric',month:'short'})}: ${d.n} lecturas</title></rect>`}).join('')}
    ${days.map((d,i)=>i%5===0||i===29?`<text x="${41+i*19.3}" y="160" text-anchor="middle">${d.d.getDate()}/${d.d.getMonth()+1}</text>`:'').join('')}</svg>`;
  const lvCount=(arr)=>({D:arr.filter(c=>c>=9).length,S:arr.filter(c=>c>=8&&c<9).length,E:arr.filter(c=>c>=6&&c<8).length,R:arr.filter(c=>c<6).length});
  const dl=lvCount(U.filter(u=>u.d).map(u=>u.d.cal)),cl=lvCount(U.filter(u=>u.lastCal!=null).map(u=>u.lastCal));
  const stack=(c,label)=>{const t=Object.values(c).reduce((a,b)=>a+b,0)||1;return `<div class="lvrow"><span>${label}</span><div class="stackbar">${['D','S','E','R'].map(k=>c[k]?`<i class="lv${k}" style="width:${100*c[k]/t}%" title="${LV[k]}: ${c[k]}">${c[k]}</i>`:'').join('')}</div></div>`};
  const attention=U.filter(u=>(u.lastCal!=null&&u.lastCal<6)||(u.d&&u.d.lv==='R'&&!u.n)||(u.n>=2&&u.S[u.n-1].cal<u.S[0].cal-1));const attN=attention.length;attention.splice(12);
  const stars=U.filter(u=>u.delta!=null).sort((a,b)=>b.delta-a.delta).slice(0,6);
  const top=U.filter(u=>u.n).sort((a,b)=>b.p.xp-a.p.xp).slice(0,6);
  box.innerHTML=`
  <div class="kpis">${kpi(U.length,'estudiantes')}${kpi(pct(100*U.filter(u=>u.hasPw).length/Math.max(1,U.length)),'con contraseña',`${U.filter(u=>u.access==='code').length} con código pendiente`)}${kpi(all.length,'lecturas realizadas')}${kpi(U.filter(u=>u.active7).length,'activos en 7 días')}${kpi(diagAvg!=null?f1(diagAvg):'—','promedio diagnóstico')}${kpi(curAvg!=null?f1(curAvg):'—','promedio actual','última lectura de cada alumno')}${kpi(dAvg!=null?(dAvg>=0?'+':'')+f1(dAvg):'—','mejora promedio')}</div>
  <div class="grid2">
    <div class="card"><h3>Lecturas por día · últimos 30 días</h3>${bars}</div>
    <div class="card"><h3>Niveles de logro: diagnóstico vs. hoy</h3>${stack(dl,'Diagnóstico')}${stack(cl,'Hoy')}
      <div class="legend">${['D','S','E','R'].map(k=>`<span><i class="sw lv${k}"></i>${LV[k]}</span>`).join('')}</div><p class="hint">«Hoy» considera la última lectura de cada alumno que ya practicó.</p></div>
  </div>
  <div class="grid3">
    <div class="card"><h3>🚀 Mayor superación</h3>${stars.length?`<ol class="rank-list">${stars.map(u=>`<li data-do="admStudent" data-id="${esc(u.id)}"><span>${esc(u.name)} <small>${esc(gName(u.g))}</small></span><b class="${u.delta>=0?'up':'down'}">${u.delta>=0?'+':''}${f1(u.delta)}</b></li>`).join('')}</ol>`:'<p class="muted">Aún no hay lecturas.</p>'}</div>
    <div class="card"><h3>🏆 Más XP</h3>${top.length?`<ol class="rank-list">${top.map(u=>`<li data-do="admStudent" data-id="${esc(u.id)}"><span>${u.p.rank.icon} ${esc(u.name)} <small>${esc(gName(u.g))}</small></span><b>${u.p.xp.toLocaleString('es-MX')}</b></li>`).join('')}</ol>`:'<p class="muted">Aún no hay lecturas.</p>'}</div>
    <div class="card"><h3>⚠️ Requieren atención</h3>${attention.length?`<ul class="rank-list">${attention.map(u=>`<li data-do="admStudent" data-id="${esc(u.id)}"><span>${esc(u.name)} <small>${esc(gName(u.g))}</small></span><b class="down">${u.lastCal!=null?f1(u.lastCal):'sin leer'}</b></li>`).join('')}</ul>${attN>12?`<button class="linkbtn" data-do="admRisk">Ver los ${attN}</button>`:''}`:'<p class="muted">Nadie por ahora.</p>'}</div>
  </div>`;
}
ACT.admStudent=el=>admStudentDrawer(el.dataset.id);
ACT.admRisk=()=>{ADM.f={q:'',g:'',st:'risk'};ADM.tab='alu';$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t==='alu'));admTab()};

/* ---------- GRUPOS ---------- */
function admGrupos(box){
  const rows=ADM.groups.map(g=>{const U=ADM.users.filter(u=>u.g===g);const S=U.flatMap(u=>u.S);
    const pd={};for(const d of 'LGIC')pd[d]=avgOf(S,s=>s.dims&&s.dims[d]);const weak=[...'LGIC'].filter(d=>pd[d]!=null).sort((a,b)=>pd[a]-pd[b])[0];
    return {g,n:U.length,pw:U.filter(u=>u.hasPw).length,act:U.filter(u=>u.active7).length,ses:S.length,diag:avgOf(U,u=>u.d&&u.d.cal),cur:avgOf(U,u=>u.lastCal),dl:avgOf(U,u=>u.delta),weak,pd}});
  box.innerHTML=`<div class="card"><h3>Grupos</h3><div class="scroll"><table><thead><tr><th>Grupo</th><th>Alumnos</th><th>Con contraseña</th><th>Activos 7 d</th><th>Lecturas</th><th>Diagnóstico</th><th>Actual</th><th>Δ</th><th>L</th><th>G</th><th>I</th><th>C</th><th>A reforzar</th></tr></thead><tbody>
   ${rows.map(r=>`<tr class="clk" data-do="admGroup" data-g="${esc(r.g)}"><td><b>${esc(gName(r.g))}</b></td><td class="num">${r.n}</td><td class="num">${r.pw} <small class="muted">(${pct(100*r.pw/r.n)})</small></td><td class="num">${r.act}</td><td class="num">${r.ses}</td><td class="num">${r.diag!=null?f1(r.diag):'—'}</td><td class="num"><b>${r.cur!=null?f1(r.cur):'—'}</b></td><td>${r.dl!=null?deltaChip(r.dl):'—'}</td>${[...'LGIC'].map(d=>`<td class="num">${r.pd[d]!=null?pct(r.pd[d]):'—'}</td>`).join('')}<td>${r.weak?DSHORT[r.weak]:'—'}</td></tr>`).join('')}
   </tbody></table></div><p class="hint">L, G, I y C: promedio de aciertos por proceso en las lecturas practicadas en Faro Lector. Toca un grupo para ver a sus alumnos.</p></div>`;
}
ACT.admGroup=el=>{ADM.f.g=el.dataset.g;ADM.tab='alu';$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t==='alu'));admTab()};

/* ---------- ALUMNOS ---------- */
function admAlumnos(box){
  box.innerHTML=`<div class="card">
   <div class="controls"><input type="search" id="afQ" placeholder="Buscar alumno…" value="${esc(ADM.f.q)}" aria-label="Buscar alumno">
    <select id="afG" aria-label="Grupo"><option value="">Todos los grupos</option>${ADM.groups.map(g=>`<option value="${esc(g)}"${ADM.f.g===g?' selected':''}>${esc(gName(g))}</option>`).join('')}</select>
    <select id="afS" aria-label="Estado"><option value="">Todos</option><option value="pw">Con contraseña</option><option value="code">Código pendiente</option><option value="none">Sin registrar</option><option value="act">Activos 7 días</option><option value="idle">Sin lecturas</option><option value="risk">Requieren atención</option></select>
    <button class="btn sm" data-do="admAdd">＋ Agregar estudiante</button><button class="btn ghost sm" data-do="admCodesFiltered">🎟️ Códigos para la lista</button></div>
   <p class="hint" id="afCount"></p><div class="scroll"><table class="stbl"><thead><tr><th>Nombre</th><th>Grupo</th><th>Acceso</th><th>Diag.</th><th>Lecturas</th><th>Última</th><th>Mejor</th><th>Δ</th><th>Rango</th></tr></thead><tbody id="afBody"></tbody></table></div></div>`;
  $('#afS').value=ADM.f.st;
  const draw=()=>{ADM.f.q=$('#afQ').value;ADM.f.g=$('#afG').value;ADM.f.st=$('#afS').value;const L=admFiltered();
    $('#afCount').textContent=`${L.length} estudiante${L.length===1?'':'s'}`;
    $('#afBody').innerHTML=L.map(u=>`<tr class="clk" data-do="admStudent" data-id="${esc(u.id)}"><td><b>${esc(u.name)}</b>${u.src==='self'?' <span class="tag">autorregistro</span>':u.src==='admin'?' <span class="tag">agregado</span>':''}</td><td>${esc(gName(u.g))}</td><td>${accessChip(u)}</td><td class="num">${u.d?f1(u.d.cal):'—'}</td><td class="num">${u.n}</td><td class="num">${u.lastCal!=null?`<b>${f1(u.lastCal)}</b> <small class="muted">${fmtDate(u.last.date)}</small>`:'—'}</td><td class="num">${u.best!=null?f1(u.best):'—'}</td><td>${u.delta!=null?deltaChip(u.delta):'—'}</td><td>${u.n?`${u.p.rank.icon} ${esc(u.p.rank.name)}`:'—'}</td></tr>`).join('')||'<tr><td colspan="9" class="muted">Nadie coincide con los filtros.</td></tr>';};
  ['afQ','afG','afS'].forEach(id=>$('#'+id).addEventListener('input',draw));draw();
}
function admFiltered(){const q=norm(ADM.f.q);return ADM.users.filter(u=>(!ADM.f.g||u.g===ADM.f.g)&&(!q||norm(u.name).includes(q))&&(!ADM.f.st||
  (ADM.f.st==='act'?u.active7:ADM.f.st==='idle'?!u.n:ADM.f.st==='risk'?((u.lastCal!=null&&u.lastCal<6)||(u.d&&u.d.lv==='R'&&!u.n)):u.access===ADM.f.st))).sort((a,b)=>a.g.localeCompare(b.g,'es')||a.name.localeCompare(b.name,'es'))}
ACT.admCodesFiltered=()=>{const L=admFiltered();admCodesDialog(L.map(u=>u.id),`${L.length} estudiantes de la lista actual`)};
ACT.admAdd=()=>{
  openModal(`<h3>Agregar estudiante</h3><form id="addF" class="miniform"><div class="field"><label for="adN">Nombre completo</label><input id="adN" maxlength="80"></div>
   <div class="field"><label for="adG">Grupo</label><input id="adG" maxlength="14" list="adGl" placeholder="Ej. A, B, F"><datalist id="adGl">${ADM.groups.map(g=>`<option value="${esc(g)}">`).join('')}</datalist></div>
   <label class="chk"><input type="checkbox" id="adC" checked> Generar código de inicio</label><p class="hint bad" id="adM"></p>
   <div class="row-end"><button type="button" class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn">Agregar</button></div></form>`);
  $('#addF').onsubmit=async e=>{e.preventDefault();try{const r=await API.call('/admin/users',{op:'add',name:$('#adN').value,g:$('#adG').value.replace(/^3\s*[.°º]*\s*/,''),code:$('#adC').checked});
    await renderAdmin('alu');if(r.code)showCodes([{name:r.user.name,g:r.user.g,code:r.code}]);else toast('Estudiante agregado')}catch(err){$('#adM').textContent=err.message}};
};
function admStudentDrawer(id){
  const u=ADM.users.find(x=>x.id===id);if(!u)return;const p=u.p;const b=u.d?{cal:u.d.cal,dims:u.d.dims}:null;
  const last3=u.S.slice(-3);const now={};for(const d of 'LGIC'){const v=last3.map(s=>s.dims&&s.dims[d]).filter(v=>v!=null);now[d]=v.length?mean(v):null}
  openDrawer(`<button class="btn ghost sm" data-do="closeDrawer" style="justify-self:end">Cerrar ✕</button>
   <div class="path-id"><span class="av big">${esc(initials(u.name))}</span><div><span class="eyebrow">${esc(gName(u.g))} · ${u.src==='diag'?'con diagnóstico':u.src==='self'?'autorregistro':'agregado por ti'}</span><h3 style="font-size:24px">${esc(u.name)}</h3>${accessChip(u)}</div></div>
   <div class="kpis sm">${kpi(u.d?f1(u.d.cal):'—','diagnóstico')}${kpi(u.n,'lecturas')}${kpi(u.lastCal!=null?f1(u.lastCal):'—','última')}${kpi(u.best!=null?f1(u.best):'—','mejor')}${kpi(u.n?p.xp:'—','XP',u.n?p.rank.icon+' '+p.rank.name:'')}${kpi(p.stats.streak,'racha')}</div>
   ${u.n?`<div class="card flat"><h4>Evolución</h4>${lineChart(u.S.slice(-20),b?b.cal:null)}</div>`:''}
   <div class="card flat"><h4>Procesos</h4>${dimBars([...'LGIC'].map(d=>({d,me:now[d]??(b?b.dims[d]:0),marks:b?[{v:b.dims[d],col:'var(--ink)',label:'Diagnóstico'}]:[]})))}<p class="hint">${u.n?'Barra: promedio de sus últimas 3 lecturas. Marca: diagnóstico.':'Sin lecturas aún: se muestra el diagnóstico.'}</p></div>
   ${u.d?`<details class="card flat"><summary><b>Diagnóstico: ${u.d.pts}/90 · ${18-u.d.ans.reduce((a,x)=>a+x,0)} errores</b></summary><div class="errlist" style="margin-top:10px">${DB.Q.filter(q=>!u.d.ans[q.k]).map(q=>`<div class="err"><span class="c">${q.code} · ${esc(q.skill)}</span><span>Eligió: <q>${esc(u.d.wrong[q.k])}</q></span></div>`).join('')}</div><p class="hint">Conclusión IA (${u.d.rc}/3): ${esc(u.d.oc||'—')}</p></details>`:''}
   <div class="card flat"><h4>Insignias (${p.badges.filter(x=>x.got).length})</h4><div class="mini-badges big">${p.badges.filter(x=>x.got).map(x=>`<i title="${esc(x.name)}">${x.icon}</i>`).join('')||'<span class="hint">Ninguna aún</span>'}</div></div>
   ${u.n?`<div class="card flat"><h4>Lecturas</h4><div class="scroll"><table><thead><tr><th>Fecha</th><th>Texto</th><th>Calif.</th><th>ppm</th></tr></thead><tbody>${[...u.S].reverse().map(s=>`<tr><td>${fmtDT(s.date)}</td><td>${esc(s.text)}</td><td class="num"><b>${f1(s.cal)}</b></td><td class="num">${s.ppm||'—'}</td></tr>`).join('')}</tbody></table></div></div>`:''}
   <div class="card flat danger-zone"><h4>🛡️ Acciones de cuenta</h4>
    <div class="actgrid">
     <button class="btn sm" data-do="stCode" data-id="${esc(u.id)}">🎟️ Restablecer y generar código</button>
     <button class="btn ghost sm" data-do="stSetPw" data-id="${esc(u.id)}">🔑 Asignar contraseña</button>
     <button class="btn ghost sm" data-do="stUnlock" data-id="${esc(u.id)}">🔓 Desbloquear</button>
     <button class="btn ghost sm" data-do="stEdit" data-id="${esc(u.id)}">✏️ Editar nombre o grupo</button>
     <button class="btn ghost sm" data-do="stClear" data-id="${esc(u.id)}">🧹 Borrar historial</button>
     <button class="btn danger sm" data-do="stDel" data-id="${esc(u.id)}">🗑️ Eliminar estudiante</button>
    </div><div id="stConfirm"></div></div>`);
}
function stConfirm(html,onYes,word){
  const box=$('#stConfirm');box.innerHTML=`<div class="confirm">${html}${word?`<div class="field"><label for="cfW">Escribe <b>${word}</b> para confirmar</label><input id="cfW" autocomplete="off"></div>`:''}<div class="row-end"><button class="btn ghost sm" id="cfNo">Cancelar</button><button class="btn danger sm" id="cfYes">Confirmar</button></div></div>`;
  $('#cfNo').onclick=()=>box.innerHTML='';$('#cfYes').onclick=async()=>{if(word&&$('#cfW').value.trim().toUpperCase()!==word){toast('Escribe la palabra exacta para confirmar.');return}$('#cfYes').disabled=true;try{await onYes()}catch(e){toast(e.message,4000);$('#cfYes').disabled=false}};
  box.scrollIntoView({block:'nearest'});
}
ACT.stCode=el=>{const u=ADM.users.find(x=>x.id===el.dataset.id);stConfirm(`<p>Se borrará la contraseña de <b>${esc(u.name)}</b> y se generará un <b>código de inicio</b> nuevo (válido 30 días). Con él creará una contraseña nueva.</p>`,async()=>{const r=await API.call('/admin/users',{op:'resetpw',id:u.id,code:true});closeDrawer();await renderAdmin();showCodes([{name:u.name,g:u.g,code:r.code}])})};
ACT.stSetPw=el=>{const u=ADM.users.find(x=>x.id===el.dataset.id);
  openModal(`<h3>Asignar contraseña a ${esc(u.name)}</h3><form id="spF" class="miniform">${pwField('spP','Nueva contraseña','new-password')}${pwMeterHTML('spM')}<button type="button" class="linkbtn" id="spGen">Generar una segura</button><p class="hint bad" id="spE"></p><div class="row-end"><button type="button" class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn">Guardar</button></div></form>`);
  const i=wirePw('spP');bindPwMeter(i,$('#spM'),u.name);
  $('#spGen').onclick=()=>{const w=['faro','luz','libro','mar','nube','sol','río','pluma','mapa','astro','brújula','ola'];const r=new Uint32Array(3);crypto.getRandomValues(r);i.value=`${w[r[0]%w.length]}-${w[r[1]%w.length]}-${10+r[2]%90}`;i.type='text';i.dispatchEvent(new Event('input'))};
  $('#spF').onsubmit=async e=>{e.preventDefault();try{await API.call('/admin/users',{op:'setpw',id:u.id,password:i.value});closeModal();toast('Contraseña asignada. Entrégala al alumno de forma privada.',4500);renderAdmin()}catch(err){$('#spE').textContent=err.message}}};
ACT.stUnlock=async el=>{try{await API.call('/admin/users',{op:'unlock',id:el.dataset.id});toast('Cuenta desbloqueada')}catch(e){toast(e.message)}};
ACT.stEdit=el=>{const u=ADM.users.find(x=>x.id===el.dataset.id);
  openModal(`<h3>Editar estudiante</h3><form id="edF" class="miniform"><div class="field"><label for="edN">Nombre</label><input id="edN" value="${esc(u.name)}" maxlength="80"></div><div class="field"><label for="edG">Grupo</label><input id="edG" value="${esc(u.g)}" maxlength="14"></div><p class="hint bad" id="edE"></p><div class="row-end"><button type="button" class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn">Guardar</button></div></form>`);
  $('#edF').onsubmit=async e=>{e.preventDefault();try{await API.call('/admin/users',{op:'edit',id:u.id,name:$('#edN').value,g:$('#edG').value});closeModal();closeDrawer();toast('Datos actualizados');renderAdmin()}catch(err){$('#edE').textContent=err.message}}};
ACT.stClear=el=>{const u=ADM.users.find(x=>x.id===el.dataset.id);stConfirm(`<p>Se borrarán las ${u.n} lecturas, XP e insignias de <b>${esc(u.name)}</b>. No se puede deshacer.</p>`,async()=>{await API.call('/admin/users',{op:'clearsessions',id:u.id});closeDrawer();toast('Historial borrado');renderAdmin()},'BORRAR')};
ACT.stDel=el=>{const u=ADM.users.find(x=>x.id===el.dataset.id);stConfirm(`<p>Se eliminará a <b>${esc(u.name)}</b> (${esc(gName(u.g))}) con su contraseña e historial. No se puede deshacer.</p>`,async()=>{await API.call('/admin/users',{op:'delete',id:u.id});closeDrawer();toast('Estudiante eliminado');renderAdmin()},'ELIMINAR')};

/* ---------- CÓDIGOS DE INICIO ---------- */
function admCodesDialog(ids,label){
  openModal(`<h3>Generar códigos de inicio</h3><p class="ink2">Para ${esc(label)}. Cada código sirve una sola vez, durante 30 días, para que el alumno cree su contraseña.</p>
   <label class="chk"><input type="checkbox" id="cdForce"> Incluir a quienes ya tienen contraseña (se les borrará y deberán crear otra)</label>
   <div class="row-end"><button class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn" id="cdGo">Generar</button></div>`);
  $('#cdGo').onclick=async()=>{$('#cdGo').disabled=true;$('#cdGo').textContent='Generando…';try{const r=await API.call('/admin/codes',{ids,force:$('#cdForce').checked});await renderAdmin();if(r.codes.length)showCodes(r.codes);else{closeModal();toast('Todos ya tenían contraseña. Marca la casilla para incluirlos.',4500)}}catch(e){toast(e.message);closeModal()}};
}
function showCodes(codes){
  const sorted=[...codes].sort((a,b)=>a.g.localeCompare(b.g,'es')||a.name.localeCompare(b.name,'es'));
  const csv='﻿grupo,nombre,codigo\n'+sorted.map(c=>`"${gName(c.g)}","${c.name.replace(/"/g,'""')}","${c.code}"`).join('\n');
  openModal(`<h3>🎟️ Códigos de inicio (${sorted.length})</h3><p class="callout warn">⚠️ <span>Por seguridad, los códigos <b>solo se muestran ahora</b>. Imprímelos o descárgalos y entrégalos a cada alumno en privado.</span></p>
   <div class="scroll codes-box"><table><thead><tr><th>Grupo</th><th>Nombre</th><th>Código</th></tr></thead><tbody>${sorted.map(c=>`<tr><td>${esc(gName(c.g))}</td><td>${esc(c.name)}</td><td class="mono code">${esc(c.code)}</td></tr>`).join('')}</tbody></table></div>
   <div class="row-end"><button class="btn ghost" id="cdCopy">📋 Copiar</button><button class="btn ghost" id="cdCsv">⬇️ CSV</button><button class="btn ghost" id="cdPrint">🖨️ Imprimir tarjetas</button><button class="btn" data-do="closeModal">Listo</button></div>`,true);
  $('#cdCopy').onclick=()=>copyText(sorted.map(c=>`${gName(c.g)}\t${c.name}\t${c.code}`).join('\n'));
  $('#cdCsv').onclick=()=>saveFile('codigos_inicio_faro_lector.csv',csv,'text/csv');
  $('#cdPrint').onclick=()=>{$('#printArea').innerHTML=`<div class="print-cards">${sorted.map(c=>`<div class="pcard"><div class="pc-h">Faro Lector · ${esc(API.cfg.school)}</div><div class="pc-n">${esc(c.name)}</div><div class="pc-g">${esc(gName(c.g))}</div><div class="pc-l">Tu código de inicio</div><div class="pc-c">${esc(c.code)}</div><div class="pc-f">Úsalo una sola vez para crear tu contraseña. No lo compartas. Vence en 30 días.</div></div>`).join('')}</div>`;document.body.classList.add('printing');setTimeout(()=>{try{window.print()}catch{}setTimeout(()=>{document.body.classList.remove('printing');$('#printArea').innerHTML=''},500)},100)};
}

/* ---------- PROCESOS Y TEXTOS ---------- */
function admProcesos(box){
  const U=ADM.users;const S=U.flatMap(u=>u.S.map(s=>Object.assign({g:u.g},s)));const D=ADM.ov.diag;
  const dAvg={},pAvg={};for(const d of 'LGIC'){dAvg[d]=avgOf(D,s=>s.dims[d]);pAvg[d]=avgOf(S,s=>s.dims&&s.dims[d])}
  const texts={};S.forEach(s=>{(texts[s.text]=texts[s.text]||[]).push(s)});
  const T=Object.entries(texts).map(([t,a])=>({t,n:a.length,cal:mean(a.map(s=>s.cal)),dims:Object.fromEntries([...'LGIC'].map(d=>[d,avgOf(a,s=>s.dims&&s.dims[d])]))})).sort((a,b)=>b.n-a.n);
  const qp=DB.Q.map(q=>({q,p:100*mean(D.map(s=>s.ans[q.k])),g:Object.fromEntries(ADM.groups.map(g=>{const a=D.filter(s=>s.g===g);return [g,a.length?100*mean(a.map(s=>s.ans[q.k])):null]}))}));
  const heat=v=>v==null?'':`style="background:color-mix(in srgb,var(--sea) ${Math.round(Math.max(0,Math.min(100,(v-40)/60*100))*.75)}%,var(--panel));color:${v>=75?'var(--sea-ink)':'var(--ink)'}"`;
  box.innerHTML=`
  <div class="card"><h3>Procesos de lectura: diagnóstico vs. práctica en Faro Lector</h3>
   ${[...'LGIC'].map(d=>`<div class="cmprow"><span><b>${DSHORT[d]}</b> <small class="muted">${DIMS[d]}</small></span><div style="display:grid;gap:3px"><div class="track" style="height:8px"><i class="fill" style="width:${dAvg[d]||0}%;background:var(--sea);opacity:.45"></i></div><div class="track" style="height:10px"><i class="fill" style="width:${pAvg[d]||0}%;background:${DCOL[d]}"></i></div></div><span class="num">${dAvg[d]!=null?pct(dAvg[d]):'—'} → <b>${pAvg[d]!=null?pct(pAvg[d]):'—'}</b></span></div>`).join('')}
   <div class="legend"><span><i class="sw" style="background:var(--sea);opacity:.45"></i>Diagnóstico (sep 2026)</span><span><i class="sw" style="background:var(--dI)"></i>Promedio de todas las lecturas practicadas</span></div></div>
  <div class="card"><h3>Textos más leídos</h3>${T.length?`<div class="scroll"><table><thead><tr><th>Texto</th><th>Lecturas</th><th>Promedio</th><th>L</th><th>G</th><th>I</th><th>C</th></tr></thead><tbody>${T.map(r=>`<tr><td>${esc(r.t)}</td><td class="num">${r.n}</td><td class="num"><b>${f1(r.cal)}</b></td>${[...'LGIC'].map(d=>`<td class="num">${r.dims[d]!=null?pct(r.dims[d]):'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="muted">Aún no hay lecturas registradas.</p>'}</div>
  <div class="card"><h3>Reactivos del diagnóstico por grupo (% de acierto)</h3><div class="scroll"><table class="heat"><thead><tr><th>Reactivo</th><th>Habilidad</th><th>Escuela</th>${ADM.groups.filter(g=>D.some(s=>s.g===g)).map(g=>`<th>${esc(g)}</th>`).join('')}</tr></thead><tbody>
   ${qp.sort((a,b)=>a.p-b.p).map(r=>`<tr><td class="mono">${r.q.code}</td><td>${esc(r.q.skill)} <small class="muted">${DSHORT[r.q.dim]}</small></td><td class="num" ${heat(r.p)}><b>${pct(r.p)}</b></td>${ADM.groups.filter(g=>D.some(s=>s.g===g)).map(g=>`<td class="num" ${heat(r.g[g])}>${r.g[g]!=null?pct(r.g[g]):'—'}</td>`).join('')}</tr>`).join('')}
   </tbody></table></div><p class="hint">Ordenados del más difícil al más fácil. El análisis completo está en la pestaña «Diagnóstico original».</p></div>`;
}

/* ---------- DIAGNÓSTICO ORIGINAL ---------- */
async function admDiag(box){
  box.innerHTML='<div class="card"><p class="muted">Cargando el análisis…</p></div>';
  try{const r=await API.call('/admin/analysis');box.innerHTML='<iframe class="anframe" title="Análisis de la evaluación diagnóstica"></iframe>';box.querySelector('iframe').srcdoc=r.html}catch(e){box.innerHTML=`<div class="card"><p>${esc(e.message)}</p></div>`}
}

/* ---------- SUGERENCIAS ---------- */
function admRules(){
  const U=ADM.users;const out=[];
  ADM.groups.forEach(g=>{const G=U.filter(u=>u.g===g);const S=G.flatMap(u=>u.S);const reg=G.filter(u=>u.hasPw).length;
    if(reg<G.length*0.6)out.push({k:'acceso',t:`${gName(g)}: solo ${reg} de ${G.length} alumnos tienen contraseña.`,a:'Genera los códigos de inicio del grupo e imprímelos como tarjetas para entregarlos en clase.'});
    const pd={};for(const d of 'LGIC')pd[d]=avgOf(S.length?S:G.filter(u=>u.d).map(u=>({dims:u.d.dims})),s=>s.dims&&s.dims[d]);
    const w=[...'LGIC'].filter(d=>pd[d]!=null).sort((a,b)=>pd[a]-pd[b])[0];
    if(w)out.push({k:'proceso',t:`${gName(g)}: el proceso más débil es ${DIMS[w].toLowerCase()} (${pct(pd[w])}).`,a:{L:'Practicar la localización con subrayado digital y preguntas de «¿dónde lo dice?».',G:'Pedir resúmenes de 280 caracteres por párrafo y un título alternativo para cada texto.',I:'Aplicar la secuencia «Detectives de pistas digitales»: pista → inferencia → comprobación.',C:'Usar el «Semáforo de verificación» y debates con postura, evidencia y contraargumento.'}[w]});
    const act=G.filter(u=>u.active7).length;if(S.length&&act<G.length*0.3)out.push({k:'participación',t:`${gName(g)}: solo ${act} alumnos leyeron en los últimos 7 días.`,a:'Asigna una lectura semanal obligatoria en Faro Lector y reconoce en clase las nuevas insignias.'});});
  const risk=U.filter(u=>u.d&&u.d.lv==='R'&&!u.n);if(risk.length)out.push({k:'atención',t:`${risk.length} alumnos con nivel «Requiere apoyo» en el diagnóstico aún no han practicado.`,a:'Agenda una sesión guiada en el aula de medios para que hagan su primera lectura acompañados.'});
  const down=U.filter(u=>u.n>=2&&u.S[u.n-1].cal<u.S[0].cal-1);if(down.length)out.push({k:'retroceso',t:`${down.length} alumnos bajaron más de 1 punto entre su primera y su última lectura.`,a:'Revisa su historial: puede deberse a textos más difíciles. Sugiere textos de dificultad accesible.'});
  return out;
}
function admSug(box){
  const R=admRules();
  box.innerHTML=`<div class="grid2"><div class="card"><h3>Sugerencias automáticas</h3>${R.length?`<div class="sugs">${R.map(r=>`<div class="sug"><span class="tag">${r.k}</span><b>${esc(r.t)}</b><span>${esc(r.a)}</span></div>`).join('')}</div>`:'<p class="muted">Sin alertas por ahora.</p>'}</div>
   <div class="say"><span class="orb" id="sugOrb"></span><div class="bub"><span class="who">CLAUDE · ANÁLISIS PEDAGÓGICO</span><div id="sugOut"><p>Puedo analizar los datos de toda la escuela (diagnóstico y lecturas practicadas) y proponerte un plan por grupo para Tecnología con énfasis en informática.</p></div>
    ${AI.on()?'<div class="row"><button class="btn" id="sugGo">✨ Claude, analiza mi escuela</button><button class="btn ghost sm" id="sugCopy" hidden>📋 Copiar</button></div>':'<p class="hint">Activa la IA en «Seguridad y accesos» para recibir el análisis de Claude.</p>'}</div></div></div>`;
  const go=$('#sugGo');if(go)go.onclick=async()=>{go.disabled=true;$('#sugOrb').classList.add('live');const o=$('#sugOut');o.innerHTML='<span class="typing"><i></i><i></i><i></i> Claude está analizando a toda la escuela… (hasta 1 minuto)</span>';
    try{const t=await AI.ask(admPrompt(R),{tier:'default'});o.innerHTML=md(t);$('#sugCopy').hidden=false;$('#sugCopy').onclick=()=>copyText(t)}catch(e){o.innerHTML=`<p class="muted">${esc(AI.errMsg(e))}</p>`}$('#sugOrb').classList.remove('live');go.disabled=false};
}
function admPrompt(R){
  const U=ADM.users;const lines=ADM.groups.map(g=>{const G=U.filter(u=>u.g===g);const S=G.flatMap(u=>u.S);const pd=[...'LGIC'].map(d=>`${d} ${(x=>x==null?'-':Math.round(x))(avgOf(S,s=>s.dims&&s.dims[d]))}`).join(' ');const dd=[...'LGIC'].map(d=>`${d} ${(x=>x==null?'-':Math.round(x))(avgOf(G.filter(u=>u.d),u=>u.d.dims[d]))}`).join(' ');
    return `- ${gName(g)}: ${G.length} alumnos, ${G.filter(u=>u.hasPw).length} registrados, ${G.filter(u=>u.active7).length} activos 7d, ${S.length} lecturas. Diagnóstico prom ${(x=>x==null?'-':f1(x))(avgOf(G,u=>u.d&&u.d.cal))} (${dd}). Práctica prom ${(x=>x==null?'-':f1(x))(avgOf(G,u=>u.lastCal))} (${pd}).`}).join('\n');
  const att=U.filter(u=>(u.lastCal!=null&&u.lastCal<6)||(u.d&&u.d.lv==='R')).slice(0,25).map(u=>`${u.name} (${gName(u.g)}): diag ${u.d?f1(u.d.cal):'-'}, lecturas ${u.n}, última ${u.lastCal!=null?f1(u.lastCal):'-'}`).join('; ');
  return `Eres Claude, asesor pedagógico experto en comprensión lectora (NEM, PISA, PIRLS) de un docente de Tecnología con énfasis en informática de 3.er grado de secundaria en México. Analiza estos datos reales y escribe un informe práctico en español de México (máximo 650 palabras) con encabezados "## ": Diagnóstico general, Grupo por grupo, Alumnos prioritarios, Estrategias para la clase de Tecnología, Próximos 15 días. Usa viñetas y **negritas**. Sé concreto, con cifras; no inventes datos.
Procesos: L=localizar información, G=sentido global, I=inferir e interpretar, C=evaluar y reflexionar (porcentajes de acierto).
GRUPOS:
${lines}
ALUMNOS CON ALERTA: ${att||'ninguno'}
ALERTAS AUTOMÁTICAS: ${R.map(r=>r.t).join(' | ')||'ninguna'}`;
}

/* ---------- SEGURIDAD Y ACCESOS ---------- */
function admSeg(box){
  const s=ADM.ov.settings;
  box.innerHTML=`<div class="grid2">
   <div class="card"><h3>🎟️ Códigos de inicio por grupo</h3><p class="ink2" style="font-size:14px">Genera códigos para que cada alumno cree su contraseña de forma segura. Evita que otra persona «reclame» su cuenta.</p>
    <div class="field"><label for="cgG">Grupo</label><select id="cgG"><option value="">Todos los grupos</option>${ADM.groups.map(g=>`<option value="${esc(g)}">${esc(gName(g))} · ${ADM.users.filter(u=>u.g===g&&!u.hasPw).length} sin contraseña</option>`).join('')}</select></div>
    <button class="btn" id="cgGo">Generar códigos</button></div>
   <div class="card"><h3>⚙️ Reglas de acceso</h3><form id="setF" class="miniform">
    <label class="switch"><input type="checkbox" id="sFree" ${s.freeReg?'checked':''}><span></span><b>Registro libre la primera vez</b><small>Si está activo, un alumno sin código puede crear su contraseña al elegir su nombre. Desactívalo para exigir código de inicio (más seguro).</small></label>
    <label class="switch"><input type="checkbox" id="sSelf" ${s.selfSignup?'checked':''}><span></span><b>Permitir autorregistro de alumnos nuevos</b><small>Botón «Soy nuevo» en la pantalla de entrada.</small></label>
    <label class="switch"><input type="checkbox" id="sAi" ${s.aiEnabled?'checked':''}><span></span><b>Inteligencia artificial (Claude)</b><small>${AI.on()||s.aiEnabled?'':'Requiere ANTHROPIC_API_KEY en Netlify.'}</small></label>
    <div class="field"><label for="sLim">Consultas a Claude por alumno por hora</label><input id="sLim" type="number" min="5" max="500" value="${s.aiPerHour}"></div>
    <div class="field"><label for="sSch">Nombre de la escuela</label><input id="sSch" value="${esc(s.school)}" maxlength="80"></div>
    <div class="field"><label for="sGate">Código de acceso de la escuela ${s.gate?'<span class="acc ok">activo</span>':'<span class="acc none">desactivado</span>'}</label><input id="sGate" placeholder="${s.gate?'Escribe uno nuevo para cambiarlo':'Ej. Faro20'}" maxlength="40" autocomplete="off"><small class="hint">Si lo activas, la lista de nombres solo se muestra a quien escriba este código (lo compartes en clase). ${s.gate?'<button type="button" class="linkbtn" id="gateOff">Desactivar código</button>':''}</small></div>
    <p class="hint" id="setMsg"></p><button class="btn">Guardar reglas</button></form></div>
   <div class="card"><h3>🔑 Mi contraseña de administrador</h3><form id="apF" class="miniform">${pwField('apC','Contraseña actual','current-password')}${pwField('apN','Nueva contraseña (10+, letras y números)','new-password')}${pwMeterHTML('apM')}${pwField('apN2','Repite la nueva','new-password')}<p class="hint bad" id="apE"></p><button class="btn">Cambiar contraseña</button></form></div>
   <div class="card"><h3>🚨 Emergencia</h3><p class="ink2" style="font-size:14px">Cierra de inmediato todas las sesiones abiertas (alumnos y otros dispositivos). Úsalo si sospechas que alguien entró sin permiso.</p><button class="btn danger" id="logoutAll">Cerrar todas las sesiones</button>
    <h4 style="margin-top:14px">Protecciones activas</h4><ul class="shield-list"><li>Contraseñas cifradas con PBKDF2-SHA256 (310,000 iteraciones) y sal única</li><li>Bloqueo tras 5 intentos fallidos (15 min alumnos, 30 min administrador)</li><li>Límite de intentos por equipo y de consultas a la IA</li><li>Sesiones firmadas (HMAC) que caducan y se revocan al cambiar la contraseña</li><li>Cierre automático por inactividad</li><li>La clave de Claude vive solo en el servidor</li><li>Encabezados de seguridad (CSP, HSTS, nosniff)</li></ul></div>
  </div>
  <div class="card"><h3>📜 Bitácora de seguridad</h3><div class="scroll"><table><thead><tr><th>Fecha</th><th>Evento</th><th>Detalle</th></tr></thead><tbody>${(ADM.ov.audit||[]).map(a=>`<tr><td>${fmtDT(a.t)}</td><td><span class="tag ${/fallo|bloqueo/.test(a.type)?'bad':''}">${esc(a.type)}</span></td><td>${esc(a.d)}</td></tr>`).join('')||'<tr><td colspan="3" class="muted">Sin eventos.</td></tr>'}</tbody></table></div></div>`;
  $('#cgGo').onclick=()=>{const g=$('#cgG').value;const ids=ADM.users.filter(u=>!g||u.g===g).map(u=>u.id);admCodesDialog(ids,g?gName(g):'todos los grupos')};
  const save=async extra=>{try{const r=await API.call('/admin/settings',Object.assign({freeReg:$('#sFree').checked,selfSignup:$('#sSelf').checked,aiEnabled:$('#sAi').checked,aiPerHour:+$('#sLim').value,school:$('#sSch').value},extra||{}));ADM.ov.settings=r.settings;Object.assign(API.cfg,{freeReg:r.settings.freeReg,selfSignup:r.settings.selfSignup,gate:r.settings.gate,school:r.settings.school});try{API.cfg=await (API.demo?API.core.handle({method:'GET',path:'/config',headers:{},body:null,ip:'demo'}).then(x=>x.body):fetch('/api/config',{cache:'no-store'}).then(x=>x.json()))}catch{}updatePill();if(r.token)API.setToken(r.token,'admin');toast('Cambios guardados');admTab()}catch(e){$('#setMsg').textContent=e.message}};
  $('#setF').onsubmit=e=>{e.preventDefault();const g=$('#sGate').value.trim();save(g?{gateCode:g}:{})};
  const off=$('#gateOff');if(off)off.onclick=()=>save({gateCode:''});
  const n=wirePw('apN');wirePw('apC');wirePw('apN2');bindPwMeter(n,$('#apM'),'');
  $('#apF').onsubmit=async e=>{e.preventDefault();if(n.value!==$('#apN2').value){$('#apE').textContent='Las contraseñas no coinciden.';return}try{const r=await API.call('/admin/password',{current:$('#apC').value,password:n.value});API.setToken(r.token,'admin');toast('Contraseña de administrador actualizada');admTab()}catch(err){$('#apE').textContent=err.message}};
  $('#logoutAll').onclick=()=>{openModal(`<h3>¿Cerrar todas las sesiones?</h3><p>Todos los alumnos tendrán que volver a escribir su contraseña. Tu sesión seguirá abierta.</p><div class="row-end"><button class="btn ghost" data-do="closeModal">Cancelar</button><button class="btn danger" id="laYes">Sí, cerrar todas</button></div>`);$('#laYes').onclick=()=>{closeModal();save({logoutAll:true})}};
}

/* ---------- FRASES ---------- */
function admFrases(box){
  let Q=(ADM.ov.settings.quotes&&ADM.ov.settings.quotes.length?ADM.ov.settings.quotes:DEFAULT_QUOTES).map(q=>Object.assign({},q));
  const draw=()=>{box.innerHTML=`<div class="card"><h3>💬 Frases motivadoras</h3><p class="ink2" style="font-size:14px">Aparecen en la entrada, en el diagnóstico, en los resultados y en «Mi trayecto». Puedes agregar tus autores favoritos.</p>
   <form id="qAdd" class="qadd"><input id="qT" placeholder="Frase" maxlength="320" aria-label="Frase"><input id="qA" placeholder="Autor" maxlength="80" aria-label="Autor"><button class="btn sm">Agregar</button></form>
   <ul class="qlist">${Q.map((q,i)=>`<li><span>«${esc(q.t)}» <small>— ${esc(q.a)}</small></span><button class="icon-btn sm" data-i="${i}" aria-label="Quitar">✕</button></li>`).join('')}</ul>
   <div class="row-end"><button class="btn ghost" id="qReset">Restaurar frases originales</button><button class="btn" id="qSave">Guardar frases</button></div></div>`;
   $('#qAdd').onsubmit=e=>{e.preventDefault();const t=$('#qT').value.trim(),a=$('#qA').value.trim()||'Anónimo';if(t.length<4)return;Q.unshift({t,a});draw()};
   box.querySelectorAll('.qlist button').forEach(b=>b.onclick=()=>{Q.splice(+b.dataset.i,1);draw()});
   $('#qReset').onclick=async()=>{try{const r=await API.call('/admin/settings',{quotes:null});ADM.ov.settings=r.settings;API.cfg.quotes=null;Q=DEFAULT_QUOTES.map(q=>Object.assign({},q));draw();toast('Frases originales restauradas')}catch(e){toast(e.message)}};
   $('#qSave').onclick=async()=>{try{const r=await API.call('/admin/settings',{quotes:Q});ADM.ov.settings=r.settings;API.cfg.quotes=r.settings.quotes;toast('Frases guardadas')}catch(e){toast(e.message)}};};
  draw();
}

/* ---------- EXPORTAR ---------- */
ACT.admExport=()=>{
  const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;
  const rows=[['grupo','nombre','acceso','diagnostico','lecturas','ultima','mejor','promedio','delta','xp','rango','insignias','racha','palabras']].concat(ADM.users.map(u=>[gName(u.g),u.name,u.access,u.d?f1(u.d.cal):'',u.n,u.lastCal!=null?f1(u.lastCal):'',u.best!=null?f1(u.best):'',u.avg!=null?f1(u.avg):'',u.delta!=null?f1(u.delta):'',u.p.xp,u.p.rank.name,u.p.badges.filter(b=>b.got).length,u.p.stats.streak,u.p.stats.words]));
  const ses=[['grupo','nombre','fecha','texto','calificacion','literal','global','inferencial','critico','ppm','minutos','preguntas']].concat(ADM.users.flatMap(u=>u.S.map(s=>[gName(u.g),u.name,new Date(s.date).toISOString(),s.text,f1(s.cal),...[...'LGIC'].map(d=>s.dims&&s.dims[d]!=null?Math.round(s.dims[d]):''),s.ppm||'',s.mins,s.src])));
  saveFile('faro_lector_alumnos.csv','﻿'+rows.map(r=>r.map(q).join(',')).join('\n'),'text/csv');
  setTimeout(()=>saveFile('faro_lector_lecturas.csv','﻿'+ses.map(r=>r.map(q).join(',')).join('\n'),'text/csv'),700);
};


/* =====================================================================
   INICIO
   ===================================================================== */
(async function init(){
  renderLibrary();
  try{ await API.init(); }
  catch(e){ $('#lgPick').hidden=true; lgMsg(e.message,true); renderSignature(); show('login'); return; }
  updatePill(); renderSignature();
  $('#loginQuote').innerHTML=quoteHTML(quoteOfDay(),'qodLogin');
  if(API.demo){ const b=$('#demoBanner'); b.hidden=false; }
  const tok=sess.get('tok'), role=sess.get('role');
  if(tok){
    API.token=tok; API.role=role;
    try{
      if(role==='admin'){ setChip('Administrador','Centro de mando'); bumpIdle(); await renderAdmin(); return; }
      await loadMe(); bumpIdle(); renderDiag(); return;
    }catch(e){ API.clear(); }
  }
  resetLogin(); show('login');
})();
