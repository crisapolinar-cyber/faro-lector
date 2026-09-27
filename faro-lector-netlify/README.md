# Faro Lector 2.0

**Elaborado y diseñado por Ing. Cristóbal Apolinar**
Secundaria General N.º 20 · Tecnología con énfasis en informática

Faro Lector es una aplicación de comprensión lectora con inteligencia artificial (Claude). Esta versión tiene cuentas con contraseña, un Centro de mando para el administrador y un registro de logros guardado en la nube.

---

## 1. Qué hay en esta carpeta

| Carpeta o archivo | Para qué sirve |
|---|---|
| `public/` | La aplicación que ven los alumnos (HTML, CSS y JavaScript). No contiene datos de los alumnos. |
| `netlify/functions/api.mjs` | El servidor seguro: contraseñas, sesiones, progreso y Centro de mando. |
| `netlify/functions/ai-worker.mjs` | Consulta a Claude en segundo plano, para que las respuestas largas no se corten. |
| `netlify/functions/lib/` | El núcleo de seguridad, el diagnóstico (privado) y el análisis original. |
| `netlify.toml` | Configuración de Netlify y encabezados de seguridad. |

Los datos de los alumnos (diagnóstico, contraseñas cifradas y lecturas) se guardan en **Netlify Blobs**, el almacenamiento privado de tu sitio. Nunca se envían al navegador de otro alumno.

---

## 2. Publicar en Netlify (una sola vez, unos 15 minutos)

> ⚠️ **Netlify Drop** (arrastrar la carpeta) **no sirve**, porque solo publica páginas estáticas y esta aplicación necesita funciones de servidor. Usa la opción A o la B.

### Opción A: con GitHub (recomendada)
1. Crea una cuenta gratuita en <https://github.com> y un repositorio **privado** llamado `faro-lector`.
2. Sube **todo el contenido** de esta carpeta: arrastra los archivos a la página del repositorio con *Add file → Upload files*.
3. En <https://app.netlify.com> elige **Add new site → Import an existing project → GitHub** y selecciona `faro-lector`.
4. Deja la configuración como aparece (Netlify lee `netlify.toml`) y pulsa **Deploy**.

### Opción B: con la terminal
```bash
npm install -g netlify-cli
cd faro-lector-netlify
npm install
netlify login
netlify deploy --prod
```

---

## 3. Variables de entorno (obligatorio)

En Netlify, ve a **Site configuration → Environment variables → Add a variable** y crea estas tres:

| Variable | Qué poner |
|---|---|
| `SESSION_SECRET` | Un texto largo y aleatorio de **al menos 32 caracteres**, por ejemplo 64 letras y números al azar. Sirve para firmar las sesiones. No lo compartas. |
| `ADMIN_SETUP_CODE` | Un código que tú inventes, por ejemplo `Faro-Admin-2026-xyz`. Se usa **una sola vez** para crear tu cuenta de administrador. |
| `ANTHROPIC_API_KEY` | Tu clave de API de Claude, que obtienes en <https://console.anthropic.com>. Si no la pones, la app funciona sin IA. |

Opcionales:

| Variable | Valor predeterminado |
|---|---|
| `CLAUDE_MODEL` | `claude-sonnet-5` |
| `CLAUDE_MODEL_QUICK` | `claude-haiku-4-5-20251001` |
| `CLAUDE_MODEL_COMPLEX` | `claude-opus-5-5` |

Después de crear o cambiar variables, ve a **Deploys → Trigger deploy → Deploy site** para que se apliquen.

> 💡 En la consola de Anthropic puedes fijar un **límite de gasto mensual**. Además, la app limita a cada alumno a un número de consultas por hora, que ajustas en el Centro de mando.

---

## 4. Primer uso como administrador
1. Abre tu sitio y pulsa **🛡️ Administrador**, abajo en la tarjeta de entrada.
2. Escribe tu `ADMIN_SETUP_CODE` y crea tu contraseña: 10 caracteres o más, con letras y números.
3. Ya estás en el **Centro de mando**. Te recomiendo:
   - **Seguridad y accesos → Códigos de inicio**: genera los códigos de cada grupo e imprímelos como tarjetas.
   - Desactiva **Registro libre la primera vez**, para que nadie pueda crear la contraseña de otro compañero.
   - Opcional: activa un **código de acceso de la escuela**, para que la lista de nombres solo la vea quien lo conozca.

### Cómo entra un alumno
1. Elige su grupo y su nombre.
2. **La primera vez** escribe su código de inicio (o, si dejaste activo el registro libre, entra directo) y **crea su contraseña**.
3. Las siguientes veces elige su nombre y escribe su contraseña.
4. Si la olvida, en el Centro de mando: **Alumnos → su nombre → Restablecer y generar código**.

---

## 5. Insertar en Google Sites
1. Copia la dirección de tu sitio de Netlify, por ejemplo `https://faro-lector.netlify.app`.
2. En Google Sites: **Insertar → Incorporar → Por URL**, pega la dirección y elige **Toda la página**.
3. Ajusta el tamaño del recuadro para que sea alto (mínimo 900 px).
4. Agrega también un **botón** con el texto «Abrir Faro Lector en pantalla completa» que enlace a la misma dirección. Algunos navegadores limitan las funciones dentro de un recuadro incrustado, y en pantalla completa todo funciona mejor, sobre todo en celulares.

La app ya está configurada para permitir que Google Sites la incruste, y bloquea que otros sitios la copien dentro de los suyos.

---

## 6. Seguridad incluida
- Contraseñas cifradas con **PBKDF2-SHA256** (310,000 iteraciones) y una sal única por usuario. Nadie, ni siquiera el administrador, puede ver una contraseña.
- **Bloqueo** después de 5 intentos fallidos: 15 minutos para alumnos y 30 para el administrador.
- **Límites por equipo** de intentos de acceso, registros y consultas a la IA.
- Sesiones **firmadas (HMAC)** que caducan: 10 h para alumnos y 4 h para el administrador. Se invalidan al cambiar la contraseña. Botón de emergencia para cerrar todas.
- **Cierre automático por inactividad**: 30 min para alumnos y 20 para el administrador.
- **Códigos de inicio** de un solo uso que caducan en 30 días.
- La clave de Claude **solo existe en el servidor**.
- Encabezados de seguridad: **CSP estricta**, HSTS, nosniff y permisos de dispositivo bloqueados.
- **Bitácora** de eventos: accesos del administrador, bloqueos, altas, bajas y restablecimientos.
- Validación y limpieza de todo lo que se recibe, y protección contra inyección de código (XSS).

---

## 7. Actualizar la app
Sube los archivos nuevos a GitHub, en el mismo repositorio. Netlify vuelve a publicar solo y **los datos de los alumnos se conservan**, porque viven en Netlify Blobs.

---

*Faro Lector · Elaborado y diseñado por Ing. Cristóbal Apolinar · 2026*
