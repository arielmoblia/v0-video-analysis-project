# Furniture Shop (WordPress/Astra/Elementor demo) — material sacado

Fuente: https://websitedemos.net/furniture-shop-04/ (misma demo que `?customize=template`
pero sin el customizer de WordPress encima; esta es la home real).

Guardado en esta carpeta (no se armó ningún modelo todavía, solo el material):
- `index.html` — página completa tal cual la sirve el servidor
- `css/` — los estilos reales: `post-4.css` (colores/tipografías globales del kit de Elementor),
  `post-56.css` (CSS de la página de inicio, con el orden real de secciones y sus estilos),
  `astra-addon.css` / `astra-main.min.css` (tema base Astra), `roboto.css` / `robotoslab.css` (fuentes)
- `images/` — las 22 fotos/logos reales de la demo (hero, fondo, categorías, productos, logos de marcas)
- `image-urls.txt` — URLs originales de cada imagen

## Colores reales (variables `--e-global-color-astglobalcolor*` usadas en post-56.css)
- Acento principal (íconos, botón "Shop now", separadores, bullets del carrusel): `#c19a83` (marrón/terracota tierra, típico de muebles)
- Texto de subtítulos ("Shop by category", "Featured products", etc.): `rgba(0,0,0,0.61)` (negro suavizado)
- Texto de testimonios: `#000000`
- Fondo de secciones claras (franja "Why choose us"): `#f1f2f2` (gris muy claro)
- Bordes/separadores entre bloques: `#FFFFFF`
- Overlay oscuro sobre imagen de fondo (sección testimonios): `#000000` con opacidad

(Nota: el kit de Elementor también trae colores "default" `#6EC1E4/#54595F/#7A7A7A/#61CE70` que son
la paleta genérica de fábrica del tema, no la que realmente se usa en la página — igual que en Blingg.
Los colores que sí se ven aplicados en el HTML/CSS real de esta home son los `astglobalcolor*` de arriba.)

## Tipografía real
- Títulos: Roboto Slab (weight 400), `--e-global-typography-secondary-font-family`
- Texto/menú/botones: Roboto (weight 400/500/600)

## Estructura real de la home (orden exacto, de arriba hacia abajo)
1. **Header**: logo a la izquierda, barra de búsqueda, menú principal (Shop All, Decor, Office,
   Living Room, Bedroom), menú secundario (Story, Contact, Track Order, Help), login, carrito.
2. **Hero grande** (`hero-01.jpg` de fondo, altura ~100vh): texto alineado a la izquierda,
   "Black Friday in july" (eyebrow), título "Up to 50% off", bajada "Hundreds of styles available",
   botón "Shop now" en color acento.
3. **Franja de logos de marcas**: carrusel horizontal con 8 logos (`logo-001.png` a `logo-008.png`).
4. **Categorías en tarjetas** ("Shop by category"): 4 tarjetas con foto + nombre + cantidad de
   productos — Bedroom (6 Products), Decor (9 Products), Living Room (6 Products), Office (11 Products) —
   fotos `cat-1.jpg` a `cat-4.jpg`.
5. **Productos destacados** ("Featured products"): grilla de 6 tarjetas de producto con foto,
   nombre, precio y botón "Select options" — fotos `product-01-c.jpg`, `product-04-c.jpg`,
   `product-05-b.jpg`, `product-09-a.jpg`, `product-14-a.jpg`, `product-15-b.jpg`.
6. **"New arrivals"**: bloque con imagen (`lamp-001.png`) + texto "Brand new, modern lamps collection"
   a un lado, y del otro 3 testimonios con estrellas (fondo `#f1f2f2`).
7. **Banner de beneficios** ("Why choose us"): 4 columnas con ícono + título + descripción corta —
   Fast Delivery, Free Shipping, Secure Checkout, Easy Returns (íconos Font Awesome:
   `fa-shipping-fast`, `fa-credit-card`, `fa-shield-alt`, `fa-cart-arrow-down`).
8. **Footer**: logo, links (Story, Contact, Track Order, Help), listado de categorías, formulario
   de newsletter por email, copyright, íconos de redes sociales.

Ese orden (hero → logos → categorías → destacados → banner de beneficios → footer con categorías)
es justamente la estructura que pidió el dueño del producto y que NO existe todavía en Moderno,
Elegante ni Bold (esos van hero → categorías → grilla, sin franja de logos ni banner de beneficios).

Listo para armar el modelo cuando se diga "codificá".
