import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export const metadata = {
  title: "Términos y Condiciones | tol.ar",
  description: "Términos y condiciones de uso de la plataforma tol.ar",
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
          <p className="text-muted-foreground mb-8">Última actualización: Enero 2026</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Al acceder y utilizar la plataforma tol.ar, aceptás estos términos y condiciones en su totalidad. 
                Si no estás de acuerdo con alguna parte de estos términos, no debés utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
              <p className="text-muted-foreground leading-relaxed">
                tol.ar es una plataforma que permite crear tiendas online. Ofrecemos diferentes planes 
                (Gratis, Cositas, Socio y A Medida) con distintas funcionalidades y precios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Registro y Cuenta</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Debés proporcionar información veraz y actualizada al registrarte.</li>
                <li>Sos responsable de mantener la confidencialidad de tu contraseña.</li>
                <li>No podés usar nombres de tienda ofensivos o que violen derechos de terceros.</li>
                <li>Nos reservamos el derecho de suspender cuentas que violen estos términos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Uso Aceptable</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">No está permitido usar tol.ar para:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Vender productos ilegales o prohibidos por la ley argentina.</li>
                <li>Realizar actividades fraudulentas o engañosas.</li>
                <li>Violar derechos de propiedad intelectual de terceros.</li>
                <li>Enviar spam o contenido no solicitado.</li>
                <li>Intentar acceder a sistemas o datos de otros usuarios.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Pagos y Facturación</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Los precios están expresados en dólares estadounidenses (USD).</li>
                <li>Los pagos se procesan a través de proveedores seguros (Stripe, MercadoPago).</li>
                <li>Las funcionalidades pagas (cositas) son de pago único, no recurrente.</li>
                <li>No ofrecemos reembolsos una vez activada una funcionalidad.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Propiedad Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                El contenido que subas a tu tienda (productos, imágenes, descripciones) es de tu propiedad. 
                Sin embargo, nos otorgás una licencia para mostrarlo en la plataforma. 
                La marca tol.ar, su logo y el código de la plataforma son propiedad exclusiva nuestra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground leading-relaxed">
                tol.ar se proporciona "tal cual". No garantizamos disponibilidad ininterrumpida del servicio. 
                No somos responsables por pérdidas de ventas, datos o daños indirectos derivados del uso de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Modificaciones</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos modificar estos términos en cualquier momento. Te notificaremos por email sobre cambios importantes. 
                El uso continuado de la plataforma implica aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Ley Aplicable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estos términos se rigen por las leyes de la República Argentina. 
                Cualquier disputa será resuelta en los tribunales de la Ciudad Autónoma de Buenos Aires.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para consultas sobre estos términos, contactanos en: <br />
                <a href="mailto:legal@tol.ar" className="text-primary hover:underline">legal@tol.ar</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
