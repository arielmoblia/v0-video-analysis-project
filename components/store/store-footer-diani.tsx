"use client"

import { useEffect, useState } from "react"
import type { Store, Category } from "@/lib/store-context"
import { withProtocol } from "@/lib/utils"
import { Instagram, Facebook, Youtube } from "lucide-react"
import Link from "next/link"
import { ContactModal } from "./contact-modal"
import { ArrepentimientoModal } from "./arrepentimiento-modal"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface StoreFooterDianiProps {
  store: Store
  categories: Category[]
  subdomain?: string
}

// Footer "Minimalista" (diani): fondo BLANCO (no oscuro como Minimal), 4
// columnas finas sin iconos de contacto, texto chico #222/gris, tal cual el
// footer real de dianiswim.com.
export function StoreFooterDiani({ store, categories, subdomain }: StoreFooterDianiProps) {
  const [contactOpen, setContactOpen] = useState(false)
  const [arrepentimientoOpen, setArrepentimientoOpen] = useState(false)
  const [basePath, setBasePath] = useState(subdomain ? `/tienda/${subdomain}` : "")

  useEffect(() => {
    if (!subdomain) return
    const hostname = window.location.hostname
    if (hostname.includes("tol.ar") && !hostname.startsWith("www.") && hostname !== "tol.ar") {
      setBasePath("")
    }
  }, [subdomain])

  const hasSocialLinks =
    store.social_instagram ||
    store.social_facebook ||
    store.social_twitter ||
    store.social_tiktok ||
    store.social_whatsapp ||
    store.social_youtube

  return (
    <footer className="bg-white text-[#222] border-t border-neutral-100" role="contentinfo" aria-label={`Pie de pagina de ${store.site_title}`}>
      <div className="container mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h5 className="text-xs lowercase tracking-wide mb-4 text-neutral-400">ayuda</h5>
            <div className="space-y-2.5 text-[13px] text-neutral-600">
              <p>{store.email}</p>
              {store.phone && <p>{store.phone}</p>}
              {store.address && <p>{store.address}</p>}
            </div>
          </div>

          <div>
            <h5 className="text-xs lowercase tracking-wide mb-4 text-neutral-400">categorías</h5>
            {categories.length > 0 ? (
              <ul className="space-y-2.5 text-[13px] text-neutral-600">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`${basePath}/categoria/${cat.slug}`} className="hover:opacity-60 transition-opacity">
                      {cat.name.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-400 text-[13px]">próximamente</p>
            )}
          </div>

          <div>
            <h5 className="text-xs lowercase tracking-wide mb-4 text-neutral-400">legal</h5>
            <ul className="space-y-2.5 text-[13px] text-neutral-600">
              <li>
                <button
                  onClick={() => setArrepentimientoOpen(true)}
                  className="underline underline-offset-4 hover:opacity-60 transition-opacity"
                >
                  botón de arrepentimiento
                </button>
              </li>
              <li>
                <Link href="/terminos" className="hover:opacity-60 transition-opacity">
                  términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:opacity-60 transition-opacity">
                  política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:opacity-60 transition-opacity">
                  política de devoluciones
                </Link>
              </li>
              <li>
                <button onClick={() => setContactOpen(true)} className="hover:opacity-60 transition-opacity">
                  contacto
                </button>
              </li>
            </ul>
            {store.data_fiscal_url && (
              store.data_fiscal_link_url ? (
                <a
                  href={withProtocol(store.data_fiscal_link_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                  aria-label="Ver Data Fiscal de AFIP"
                >
                  <img src={store.data_fiscal_url} alt="Data Fiscal AFIP" className="h-16 w-16 rounded bg-white p-1 border border-neutral-100" />
                </a>
              ) : (
                <img src={store.data_fiscal_url} alt="Data Fiscal AFIP" className="h-16 w-16 rounded bg-white p-1 mt-4 border border-neutral-100" />
              )
            )}
          </div>

          {hasSocialLinks && (
            <div>
              <h5 className="text-xs lowercase tracking-wide mb-4 text-neutral-400">seguinos</h5>
              <div className="flex gap-4">
                {store.social_instagram && (
                  <a href={store.social_instagram} target="_blank" rel="noopener noreferrer" className="text-[#222] hover:opacity-60 transition-opacity" aria-label="Seguinos en Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {store.social_facebook && (
                  <a href={store.social_facebook} target="_blank" rel="noopener noreferrer" className="text-[#222] hover:opacity-60 transition-opacity" aria-label="Seguinos en Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {store.social_twitter && (
                  <a href={store.social_twitter} target="_blank" rel="noopener noreferrer" className="text-[#222] hover:opacity-60 transition-opacity" aria-label="Seguinos en X (Twitter)">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {store.social_tiktok && (
                  <a href={store.social_tiktok} target="_blank" rel="noopener noreferrer" className="text-[#222] hover:opacity-60 transition-opacity" aria-label="Seguinos en TikTok">
                    <TikTokIcon className="h-4 w-4" />
                  </a>
                )}
                {store.social_whatsapp && (
                  <a href={`https://wa.me/${store.social_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[#222] hover:opacity-60 transition-opacity" aria-label="Contactanos por WhatsApp">
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                )}
                {store.social_youtube && (
                  <a href={store.social_youtube} target="_blank" rel="noopener noreferrer" className="text-[#222] hover:opacity-60 transition-opacity" aria-label="Suscribite a nuestro canal de YouTube">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-100 pt-6 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-xs text-neutral-400">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {store.site_title}. Todos los derechos reservados.
          </p>
          <Link href="https://tol.ar" target="_blank" className="text-xs text-[#222] hover:opacity-60 transition-opacity font-medium">
            Creado gratis con <span className="font-bold">tol.ar</span>
          </Link>
        </div>
      </div>

      <ContactModal store={store} open={contactOpen} onOpenChange={setContactOpen} />
      <ArrepentimientoModal store={store} open={arrepentimientoOpen} onOpenChange={setArrepentimientoOpen} />
    </footer>
  )
}
