// Marca el ingreso del dueño de una tienda a SU PROPIO panel de administración.
// Se guarda en page_views (misma tabla que las visitas normales) con este page_path fijo,
// con store_id = la tienda real (no TOLAR_STORE_ID), para poder distinguirlo tanto de las
// visitas reales de compradores a la tienda como de las visitas a tol.ar.
export const ADMIN_PANEL_PAGE_PATH = "__admin_panel__"
