export interface ArticuloBlog {
  slug: string
  titulo: string
  descripcion: string
  categoria: string
  fecha: string
  priority?: number
}

// Fuente unica de articulos del blog. Se usa para el listado de /blog Y para el sitemap.
// Agregar un articulo aca alcanza para que aparezca en ambos lugares.
export const articulos: ArticuloBlog[] = [
  {
    slug: "tiendabasica",
    titulo: "Tienda Básica: Llevar el Sistema de tol.ar a Toda Latinoamérica (2026)",
    descripcion:
      "La idea de Tienda Básica: un portal donde cada país de Latinoamérica elige su tienda, con el mismo motor de tol.ar por dentro, y sus propios medios de pago, envíos y facturación.",
    categoria: "Novedades",
    fecha: "2026-08-31",
    priority: 0.6,
  },
  {
    slug: "dominio-propio",
    titulo: "Dominio Propio para tu Tienda tol.ar: Guía Paso a Paso (2026)",
    descripcion:
      "Cómo conectar tu propio dominio (comprado en nic.ar) a tu tienda de tol.ar en vez de usar tunombre.tol.ar. Beneficios y pasos, explicado para gente sin experiencia técnica.",
    categoria: "Guías",
    fecha: "2026-08-30",
    priority: 0.7,
  },
  {
    slug: "nota-de-prensa1",
    titulo: "Nueva plataforma para tiendas online realmente gratis para emprendedores",
    descripcion:
      "Hace 12 meses se lanzó tol.ar, una plataforma para armar tiendas online sin necesidad de presupuesto. Simple, gratis y pensada para posicionar en buscadores y redes.",
    categoria: "Prensa",
    fecha: "2026-08-29",
    priority: 0.6,
  },
  {
    slug: "factura-electronica",
    titulo: "Factura Electrónica en tol.ar: Facturá Legal Sin Complicarte con AFIP (2026)",
    descripcion: "Cómo va a funcionar la facturación electrónica conectada a AFIP en tol.ar: qué es el CAE, quién factura, y los pasos para autorizar el sistema desde tu cuenta de AFIP.",
    categoria: "Guías",
    fecha: "2026-08-26",
    priority: 0.7,
  },
  {
    slug: "remitos-y-guias-de-envio",
    titulo: "Remito y Guía de Envío desde el Pedido, sin Salir de tol.ar (2026)",
    descripcion: "Cómo imprimir el remito de un pedido y generar la guía de envío con Enviamelo directamente desde el panel de tu tienda, sin cargar los datos a mano.",
    categoria: "Envios",
    fecha: "2026-08-26",
    priority: 0.7,
  },
  {
    slug: "scraping",
    titulo: "Scraping en tol.ar: Cómo Clonamos un Catálogo Completo (2026)",
    descripcion: "Cómo funciona el motor de scraping de tol.ar para clonar el catálogo de otra tienda: una versión para quien vende y otra técnica para quien programa.",
    categoria: "Guías",
    fecha: "2026-08-06",
    priority: 0.75,
  },
  {
    slug: "ia-no-hace-milagros-tienda-online-argentina",
    titulo: "La IA No Hace Milagros: Por Qué tu Tienda Sigue Vacía (2026)",
    descripcion: "La IA te arma la tienda en minutos, pero no vende sola. Por qué cientos de tiendas online quedan a medio hacer y qué hace falta para que la tuya no sea una más.",
    categoria: "Opinión",
    fecha: "2026-08-05",
    priority: 0.7,
  },
  {
    slug: "que-es-el-dropshipping",
    titulo: "¿Qué es el Dropshipping? Explicado Fácil, Sin Vueltas (2026)",
    descripcion: "Qué es el dropshipping en criollo: vender productos sin tenerlos guardados en tu casa. Con un ejemplo simple de todos los días.",
    categoria: "Guías",
    fecha: "2026-07-21",
  },
  {
    slug: "dropshipping-para-programadores",
    titulo: "Dropshipping en tol.ar Para Programadores: Cómo Funciona el Motor (2026)",
    descripcion: "Cómo funciona por dentro el motor de dropshipping de tol.ar: plataformas soportadas, stock real, bloqueos, reintentos y auto-suspensión de seguridad.",
    categoria: "Guías",
    fecha: "2026-07-21",
    priority: 0.75,
  },
  {
    slug: "cosas-legales-antes-de-usar-scraping",
    titulo: "Cosas Legales que Debés Saber Antes de Usar Scraping (Guía 2026)",
    descripcion: "Qué dice la ley argentina sobre copiar fotos, textos y catálogos de otra tienda: derechos de autor, marcas, competencia desleal y responsabilidad ante el consumidor.",
    categoria: "Guías",
    fecha: "2026-07-23",
    priority: 0.75,
  },
  {
    slug: "errores-comunes-tienda-online-argentina",
    titulo: "10 Errores Comunes al Crear una Tienda Online en Argentina (2026)",
    descripcion: "Los errores más frecuentes al armar una tienda online en Argentina y cómo evitarlos: medios de pago, envíos, fotos, precios y más.",
    categoria: "Guías",
    fecha: "2026-07-03",
  },
  {
    slug: "que-productos-vender-online-argentina",
    titulo: "Qué Productos Vender Online en Argentina (2026)",
    descripcion: "Los rubros con más demanda, nichos con menos competencia y cómo elegir qué vender si estás empezando.",
    categoria: "Guías",
    fecha: "2026-06-28",
  },
  {
    slug: "vender-online-monotributista-argentina",
    titulo: "Cómo Vender Online Siendo Monotributista en Argentina (2026)",
    descripcion: "Facturación, límites de ingresos y AFIP. Todo lo que necesitás saber para vender por internet como monotributista.",
    categoria: "Guías",
    fecha: "2026-06-28",
  },
  {
    slug: "como-cobrar-por-internet-argentina",
    titulo: "Cómo Cobrar por Internet en Argentina (2026)",
    descripcion: "MercadoPago, transferencia bancaria y más. Cuál es la mejor forma de cobrar tus ventas online según tu negocio.",
    categoria: "Pagos",
    fecha: "2026-06-28",
  },
  {
    slug: "tienda-online-vs-redes-sociales-argentina",
    titulo: "Tienda Online vs Redes Sociales: ¿Qué conviene para vender en Argentina? (2026)",
    descripcion: "La comparativa honesta entre vender por Instagram/Facebook y tener tu propia tienda. Ventajas, límites y cuándo usar cada uno.",
    categoria: "Comparativas",
    fecha: "2026-06-28",
  },
  {
    slug: "como-empezar-a-vender-online-sin-tecnologia",
    titulo: "Cómo Empezar a Vender Online Sin Saber de Tecnología (2026)",
    descripcion: "No necesitás saber programar ni diseñar. Si sabés usar WhatsApp, podés tener tu tienda online funcionando hoy. Guía paso a paso.",
    categoria: "Guías",
    fecha: "2026-06-28",
  },
  {
    slug: "mejor-plataforma-tienda-online-argentina",
    titulo: "¿Cuál es la mejor plataforma para crear una tienda online en Argentina? (2026)",
    descripcion: "Comparamos las principales opciones: precios reales, comisiones, facilidad de uso y para qué perfil de vendedor conviene cada una.",
    categoria: "Comparativas",
    fecha: "2026-06-25",
  },
  {
    slug: "plataformas-ecommerce-argentina-2026",
    titulo: "Plataformas de ecommerce en Argentina 2026: comparativa completa",
    descripcion: "Todas las opciones reales para vender online en Argentina, con precios actualizados y análisis de para quién conviene cada una.",
    categoria: "Comparativas",
    fecha: "2026-06-25",
  },
  {
    slug: "como-crear-tienda-online-gratis-argentina",
    titulo: "Cómo Crear una Tienda Online Gratis en Argentina: Guía Completa (2026)",
    descripcion: "Guía completa: requisitos legales, paso a paso, comparativa de plataformas, checklist y preguntas frecuentes. Sin mensualidad, sin comisiones por venta.",
    categoria: "Guías",
    fecha: "2026-08-15",
  },
  {
    slug: "cuanto-cuesta-tienda-online-argentina",
    titulo: "¿Cuánto Cuesta una Tienda Online en Argentina en 2026? Precios Reales",
    descripcion: "Los costos reales de cada plataforma. Mensualidades, comisiones por venta y costos ocultos comparados.",
    categoria: "Comparativas",
    fecha: "2026-06-23",
  },
  {
    slug: "vender-online-sin-comisiones-argentina",
    titulo: "Cómo Vender Online Sin Comisiones en Argentina (2026)",
    descripcion: "Qué plataformas cobran comisión y cuáles no. Cómo quedarte con más dinero de cada venta cuando vendés por internet.",
    categoria: "Guías",
    fecha: "2026-06-23",
  },
  {
    slug: "como-vender-ropa-online-argentina",
    titulo: "Cómo Vender Ropa Online en Argentina: Guía Completa 2026",
    descripcion: "Paso a paso para armar tu tienda de ropa online, sacar fotos que vendan, fijar precios y cobrar con MercadoPago.",
    categoria: "Ventas",
    fecha: "2026-06-28",
  },
  {
    slug: "mercadopago-tienda-online",
    titulo: "Cómo Integrar MercadoPago en tu Tienda Online",
    descripcion: "Comisiones actualizadas 2026 y configuración paso a paso para cobrar con MercadoPago en tu tienda.",
    categoria: "Pagos",
    fecha: "2026-06-04",
  },
  {
    slug: "como-vender-por-whatsapp-argentina",
    titulo: "Cómo Vender por WhatsApp en Argentina: Guía Completa 2026",
    descripcion: "WhatsApp Business, catálogo, respuestas automáticas y cómo cobrar. Todo lo que necesitás para vender por WhatsApp en Argentina.",
    categoria: "Ventas",
    fecha: "2026-06-28",
  },
  {
    slug: "envios-andreani-correo-argentino",
    titulo: "Andreani vs Correo Argentino: ¿Cuál Elegir para tu Tienda Online? (2026)",
    descripcion: "Precios, tiempos de entrega, cobertura y experiencia de usuario. Todo para elegir el servicio de envíos correcto para tu negocio.",
    categoria: "Envios",
    fecha: "2026-06-28",
  },
  {
    slug: "vender-sin-cuit-argentina",
    titulo: "Cómo Vender Online Sin CUIT en Argentina (2026)",
    descripcion: "¿Se puede vender por internet sin CUIT en Argentina? Qué permite la ley, qué te exigen las plataformas y cuándo conviene regularizarte.",
    categoria: "Guías",
    fecha: "2026-06-23",
  },
  {
    slug: "que-necesito-para-vender-online-argentina",
    titulo: "¿Qué Necesito para Vender Online en Argentina? (2026)",
    descripcion: "Lista completa de todo lo que necesitás para empezar: tienda, medio de pago, envíos, fotos y más. Sin tecnicismos.",
    categoria: "Guías",
    fecha: "2026-06-23",
  },
  {
    slug: "tienda-propia-vs-mercadolibre-argentina",
    titulo: "Tienda Propia vs MercadoLibre: ¿Qué conviene en Argentina? (2026)",
    descripcion: "¿Vender en MercadoLibre o tener tu propia tienda online? Comparativa honesta de comisiones, control de marca y datos de clientes.",
    categoria: "Comparativas",
    fecha: "2026-07-28",
  },
  {
    slug: "cuanto-cobra-tiendanube-de-comision-argentina",
    titulo: "Cuánto Cobra Tiendanube de Comisión: la Cuenta en Pesos (2026)",
    descripcion: "Cuánto te descuenta Tiendanube por costo de transacción en cada venta, con un ejemplo real en pesos, comparado con tol.ar que no cobra comisión.",
    categoria: "Comparativas",
    fecha: "2026-09-11",
  },
]
