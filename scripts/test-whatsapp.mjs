const response = await fetch('http://localhost:3003/api/super-admin/whatsapp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accion: "broadcast",
    datos: {
      numbers: ["18504837710"],
      message: "Hola! 👋 Soy el Jefe de tol.ar. Sistema de broadcast funcionando correctamente.",
      interval: 3000
    }
  })
});
const data = await response.json();
console.log(JSON.stringify(data, null, 2));
