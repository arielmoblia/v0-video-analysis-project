const SUBDOMAIN_RE = /^[a-z0-9-]+$/i

// Si el link a esta página de cosita vino desde "Leer más" en el admin de un
// cliente (con ?tienda=subdominio), el botón de activar debe volver a su
// admin para completar la compra ahí. Si no, sigue yendo a /plan-cositas.
export function getActivarHref(tienda: string | undefined, featureCode: string): string {
  if (tienda && SUBDOMAIN_RE.test(tienda)) {
    return `https://${tienda}.tol.ar/admin?activar=${featureCode}`
  }
  return "/plan-cositas"
}
