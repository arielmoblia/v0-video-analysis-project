require('dotenv').config({ path: '/root/agentes/.env' });
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); if (req.method === 'OPTIONS') return res.sendStatus(200); next(); });
app.use(express.static('public'));

const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
const PROYECTO = '/var/www/tol.ar-dev';
const MEMORIA_ARIEL = '/root/agentes/core/ariel.md';
const MEMORIA_PROYECTO = '/root/agentes/tol.ar/memoria/proyecto.md';

function leerMemoria() {
  return fs.readFileSync(MEMORIA_ARIEL, 'utf8') + '\n\n' + fs.readFileSync(MEMORIA_PROYECTO, 'utf8');
}

function ejecutar(cmd) {
  try { return execSync(cmd, { cwd: PROYECTO, encoding: 'utf8', timeout: 15000 }); }
  catch(e) { return 'ERROR: ' + (e.stderr || e.message); }
}

function leerArchivo(ruta) {
  try { return fs.readFileSync(path.join(PROYECTO, ruta), 'utf8'); }
  catch(e) { return 'ERROR: ' + e.message; }
}

function escribirArchivo(ruta, contenido) {
  try {
    const dir = path.dirname(path.join(PROYECTO, ruta));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(PROYECTO, ruta), contenido, 'utf8');
    return 'OK';
  } catch(e) { return 'ERROR: ' + e.message; }
}

function buscarEnIndice(termino) {
  try {
    const idx = '/root/agentes/tol.ar/memoria/indice.md';
    if (!fs.existsSync(idx)) return 'Índice no disponible';
    const indice = fs.readFileSync(idx, 'utf8');
    const terms = termino.toLowerCase().split(/\s+/);
    const secciones = indice.split('\n## ');
    const relevantes = secciones.filter(s => terms.some(t => s.toLowerCase().includes(t)));
    if (!relevantes.length) return 'No encontré archivos para: ' + termino;
    return '## ' + relevantes.slice(0, 5).join('\n## ');
  } catch(e) { return 'Error: ' + e.message; }
}

function guardarEnKronos(tarea, archivos, antes, despues, notas) {
  try {
    const fecha = new Date().toISOString().split('T')[0];
    let categoria = 'tol.ar/general';
    if (archivos) {
      if (archivos.includes('hero')) categoria = 'tol.ar/frontend/hero';
      else if (archivos.includes('landing')) categoria = 'tol.ar/frontend/landing';
      else if (archivos.includes('frontend') || archivos.includes('components')) categoria = 'tol.ar/frontend';
      else if (archivos.includes('agente') || archivos.includes('index.js')) categoria = 'tol.ar/agente';
      else if (archivos.includes('supabase')) categoria = 'tol.ar/supabase';
      else if (archivos.includes('image') || archivos.includes('imagen')) categoria = 'tol.ar/imagenes';
      else if (archivos.includes('plan')) categoria = 'tol.ar/planes';
    }
    const dir = '/root/agentes/kronos/' + categoria;
    fs.mkdirSync(dir, { recursive: true });
    const nombre = fecha + '-' + tarea.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40) + '.md';
    const contenido = `# ${tarea}
fecha: ${fecha}
categoria: ${categoria}
archivos: ${archivos || 'N/A'}

## Problema
${notas || 'Sin descripción'}

## Cambio
ANTES: ${antes || 'N/A'}
DESPUES: ${despues || 'N/A'}

## Resultado
Exitoso
`;
    fs.writeFileSync(dir + '/' + nombre, contenido, 'utf8');
  } catch(e) { console.log('KRONOS error:', e.message); }
}

function esDespedida(texto) {
  const frases = ['hasta mañana', 'hasta maniana', 'buenas noches', 'buen fin de semana', 'hasta luego', 'nos vemos', 'chau', 'bye', 'hasta pronto'];
  const lower = texto.toLowerCase();
  return frases.some(f => lower.includes(f));
}

function guardarMemoriaAutomatica() {
  try {
    const memoria = leerMemoria();
    client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Basándote en esta conversación, actualizá el archivo proyecto.md agregando lo nuevo que se trabajó hoy. No borres nada importante. Conversación: ${JSON.stringify(historial.slice(-20))} Memoria actual: ${memoria} Devolvé SOLO el contenido nuevo y completo del proyecto.md, sin explicaciones.`
      }]
    }).then(res => {
      fs.writeFileSync(MEMORIA_PROYECTO, res.content[0].text, 'utf8');
      console.log('Memoria guardada automáticamente al cierre de sesión');
    }).catch(e => console.log('Error guardando memoria automática:', e.message));
  } catch(e) { console.log('Error guardando memoria automática:', e.message); }
}

let historial = [];
try { historial = JSON.parse(fs.readFileSync('/root/agentes/historial.json', 'utf8')); } catch(e) {}
let pendiente = null;

app.post('/chat', async (req, res) => {
  const { mensaje, imagen, imagenTipo } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const enviar = (tipo, texto) => {
    res.write(`data: ${JSON.stringify({ tipo: tipo === 'estado' ? 'progreso' : tipo === 'fin' ? 'final' : tipo, texto })}\n\n`);
  };

  const terminar = (respuesta) => {
    res.write(`data: ${JSON.stringify({ tipo: 'final', texto: respuesta })}\n\n`);
    res.end();
  };

  if (pendiente && mensaje.trim().toUpperCase() === 'APROBAR') {
    enviar('estado', 'Aplicando cambio...');
    const rutaKronos = pendiente.ruta;
    const contenidoKronos = pendiente.contenido;
    let codigoAntesKronos = '';
    try { codigoAntesKronos = fs.readFileSync(require('path').join('/var/www/tol.ar-dev', pendiente.ruta), 'utf8').substring(0, 500); } catch(e) {}
    const resultado = escribirArchivo(pendiente.ruta, pendiente.contenido);
    pendiente = null;
    historial.push({ role: 'user', content: 'APROBAR' });
    if (resultado !== 'OK') {
      historial.push({ role: 'assistant', content: 'Error al aplicar cambio: ' + resultado });
      return terminar('Error al aplicar: ' + resultado);
    }
    try { execSync('pm2 restart tol-dev --update-env', { encoding: 'utf8' }); } catch(e) {}
    enviar('estado', 'Build en tol.ar-dev (background)...');
    require('child_process').spawn('bash', ['-c', 'cd /var/www/tol.ar-dev && npm run build && pm2 restart tol-dev --update-env'], { detached: true, stdio: 'ignore' }).unref();
    await new Promise(r => setTimeout(r, 5000));
    let testResultado = '';
    try {
      const { chromium } = require('playwright');
      enviar('estado', 'Testeando con Playwright...');
      const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      const erroresJS = [];
      page.on('console', msg => { if (msg.type() === 'error') erroresJS.push(msg.text()); });
      await page.goto('http://157.173.212.229:3003', { waitUntil: 'networkidle', timeout: 30000 });
      const titulo = await page.title();
      await browser.close();
      testResultado = `Test OK. Título: ${titulo}${erroresJS.length ? '\nErrores JS: ' + erroresJS.join(', ') : ''}`;
    } catch(e) {
      testResultado = 'No pude verificar automáticamente: ' + e.message;
    }
    historial.push({ role: 'assistant', content: 'Cambio aplicado y testeado.' });
    const tareaKronos = historial.filter(m => m.role === 'user' && typeof m.content === 'string' && m.content.toUpperCase() !== 'APROBAR').slice(-2).map(m => m.content).join(' ');
    guardarEnKronos(
      tareaKronos.substring(0, 60),
      rutaKronos || 'desconocido',
      codigoAntesKronos || 'N/A',
      contenidoKronos ? contenidoKronos.substring(0, 500) : 'N/A',
      tareaKronos
    );
    fs.writeFileSync('/root/agentes/historial.json', JSON.stringify(historial.slice(-50)), 'utf8');
    return terminar(`Cambio aplicado en tol.ar-dev.\n\n${testResultado}`);
  }

  if (imagen) {
    const ext = (imagenTipo || 'image/png').split('/')[1].replace('jpeg','jpg');
    const nombre = 'img_' + Date.now() + '.' + ext;
    const rutaGuardada = '/var/www/tol.ar-dev/public/images/' + nombre;
    try {
      fs.mkdirSync('/var/www/tol.ar-dev/public/images', { recursive: true });
      fs.writeFileSync(rutaGuardada, Buffer.from(imagen, 'base64'));
    } catch(e) {}
    historial.push({ role: 'user', content: [
      { type: 'image', source: { type: 'base64', media_type: imagenTipo || 'image/png', data: imagen } },
      { type: 'text', text: (mensaje || 'Analizá esta imagen.') + '\n\nImagen guardada en el servidor: /images/' + nombre + ' (ruta completa: ' + rutaGuardada + ')' }
    ]});
  } else {
    historial.push({ role: 'user', content: mensaje });
  }

  const mandamientos = fs.existsSync('/root/agentes/mandamientos.txt') ? fs.readFileSync('/root/agentes/mandamientos.txt', 'utf8') : '';
  const sistema = `Sos un agente de desarrollo autónomo para tol.ar en ${PROYECTO}.

REGLA IMPORTANTE: Si el mensaje del usuario contiene signo de pregunta (?) o empieza con "podés", "sabés", "cómo", "qué", "cuándo", "dónde" — solo respondé con texto, NO uses ninguna herramienta ni propongas cambios. Solo actuá cuando el mensaje es una orden directa sin ?.

HERRAMIENTAS (usalas poniendo exactamente esto en tu respuesta):
BUSCAR_INDICE: palabra_clave
EJECUTAR: comando_aqui
LEER: /ruta/relativa/al/proyecto
PROPONER_CAMBIO: /ruta/del/archivo
<
contenido completo del archivo nuevo