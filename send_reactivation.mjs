const BASE = process.env.BASE_URL || "http://localhost:3003"

const payload = {
  emails: [
    "koikepamela77@gmail.com",
    "braianzanyk03@gmail.com",
    "fariasnicolas667@gmail.com",
    "lauutaromiranda2011@gmail.com",
    "brizuelaoriella@gmail.com",
    "agustin.herrera77@outlook.com",
    "lareinasofia07@gmail.com",
    "jirehempre@gmail.com",
    "nicoyeri1912@gmail.com",
    "thiagoporte057@gmail.com"
  ],
  stores: [
    { email: "koikepamela77@gmail.com", subdomain: "draizmuebles" },
    { email: "braianzanyk03@gmail.com", subdomain: "axotec" },
    { email: "fariasnicolas667@gmail.com", subdomain: "eniciph" },
    { email: "lauutaromiranda2011@gmail.com", subdomain: "ropas" },
    { email: "brizuelaoriella@gmail.com", subdomain: "glowwbeautystore" },
    { email: "agustin.herrera77@outlook.com", subdomain: "rastrocriollo" },
    { email: "lareinasofia07@gmail.com", subdomain: "thiagosport" },
    { email: "jirehempre@gmail.com", subdomain: "siemprejireh" },
    { email: "nicoyeri1912@gmail.com", subdomain: "enic" },
    { email: "thiagoporte057@gmail.com", subdomain: "importadosthcuts" }
  ],
  subject: "Tu tienda en TOL.AR te está esperando 🚀",
  html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 12px;">
<div style="text-align: center; padding: 30px 0;">
<img src="https://tol.ar/logo.png" alt="TOL.AR" style="height: 50px;"/>
</div>
<h1 style="color: #111827; font-size: 24px; text-align: center;">¡Hola, [nombre de la tienda]! 👋</h1>
<p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
Hace unos días creaste tu tienda en <strong>TOL.AR</strong> y queremos ayudarte a que despegue. 🚀
</p>
<p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
Sabemos que empezar puede ser abrumador, por eso te damos algunos consejos rápidos:
</p>
<ul style="color: #4b5563; font-size: 15px; line-height: 1.8;">
  <li>✅ <strong>Subí fotos llamativas</strong> de tus productos — las tiendas con fotos venden 3x más</li>
  <li>✅ <strong>Completá la descripción</strong> de tu tienda y agregá tus redes sociales</li>
  <li>✅ <strong>Configurá Mercado Pago</strong> para empezar a cobrar ya</li>
  <li>✅ <strong>Compartí tu link</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">https://[nombre de la tienda].tol.ar</code> en tus redes</li>
</ul>
<div style="text-align: center; margin: 30px 0;">
<a href="https://[nombre de la tienda].tol.ar/admin" 
   style="background: #111827; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
  IR A MI TIENDA
</a>
</div>
<p style="color: #4b5563; font-size: 14px; text-align: center;">
Si necesitás ayuda, respondé este mail o escribinos a soporte@tiendaonline.com.ar
</p>
<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
<p style="color: #9ca3af; font-size: 12px; text-align: center;">TOL.AR — Creá tu tienda online gratis en 5 minutos</p>
</div>`
}

async function main() {
  try {
    const res = await fetch(`${BASE}/api/super-admin/send-promo-mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    console.log("Resultado:", JSON.stringify(data, null, 2))
  } catch (err) {
    console.error("Error:", err.message)
  }
}

main()
