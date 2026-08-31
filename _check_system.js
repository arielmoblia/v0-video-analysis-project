const http = require('http');

const services = [
  { name: 'tol.ar (3003)', url: 'http://localhost:3003' },
  { name: 'tiendaonline (3006)', url: 'http://localhost:3006' },
  { name: 'Control Center (3007)', url: 'http://localhost:3007' },
  { name: 'WhatsApp (3200)', url: 'http://localhost:3200' }
];

let pendientes = services.length;
const results = [];

services.forEach(s => {
  const req = http.get(s.url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      results.push({ name: s.name, status: res.statusCode, ok: true });
      pendientes--;
      if (pendientes === 0) mostrar();
    });
  });
  req.on('error', (e) => {
    results.push({ name: s.name, status: 'FALLA', ok: false, error: e.message });
    pendientes--;
    if (pendientes === 0) mostrar();
  });
  req.setTimeout(5000, () => {
    results.push({ name: s.name, status: 'TIMEOUT', ok: false, error: 'No respondió en 5s' });
    req.destroy();
    pendientes--;
    if (pendientes === 0) mostrar();
  });
});

function mostrar() {
  console.log('=== CHECK DEL SISTEMA ===');
  let todosOk = true;
  results.forEach(r => {
    console.log(r.ok ? '✅' : '❌', r.name, '-', r.status);
    if (!r.ok) todosOk = false;
  });
  console.log(todosOk ? '✅ TODO OK' : '⚠️  HAY FALLAS');
  process.exit(0);
}
