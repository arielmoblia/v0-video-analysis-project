import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo y descripcion */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/tol-logo.png" 
                alt="tol.ar" 
                width={28} 
                height={28}
                loading="lazy"
                quality={90}
              />
              <span className="text-xl">
                <span className="font-bold">tol</span><span className="font-normal text-slate-400">.ar</span>
              </span>
            </div>
            <p className="text-sm text-slate-300">
              La forma mas facil de crear tu tienda online en Argentina. Sin conocimientos tecnicos, sin complicaciones.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Seguinos en Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Seguinos en Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Suscribite a nuestro canal de YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Seguinos en Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Planes */}
          <div>
            <h4 className="font-semibold mb-4">Planes</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/plan-gratis" className="hover:text-white transition-colors">Plan Gratis</Link></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/pagos" className="hover:text-white transition-colors">Métodos de Pago</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} tol.ar - Todos los derechos reservados</p>
          <div className="flex gap-4">
            <Link href="/terminos" className="hover:text-slate-300 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-slate-300 transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
