# sa-minimal (Shopify demo) — material sacado

Fuente: https://sa-minimal.myshopify.com/ (tema Shopify "Minimal" real, no inventado)

Guardado en esta carpeta:
- `index.html` — página completa tal cual la sirve el servidor
- `css/` — estilos reales: `style.css` (base del tema), `custom.css`, `skin-theme.css`, `default.css`, `header.css`, `responsive.css`
- `images/` — fotos reales descargadas: `hero-home-bg.jpg`, `hero-portfolio-bg.jpg` (fondos del slider), `banner-1..4.jpg` (banners de categoría)
- `image-urls.txt` — URLs originales de cada imagen

## Colores reales
- Acento: `#ff7f00` (naranja, único color fuerte de toda la página — botones, hover, tabs activos)
- Texto: escala de grises `#333` / `#606060` / `#666` / `#909090` / `#999`
- Fondo: blanco puro, sin franjas de color
- Footer: `#333` (gris oscuro casi negro), footer-bottom `#f1f1f1`

## Tipografía real
- Body y títulos: `Montserrat, sans-serif` (fuente global del tema, `style.css`)
- Textos secundarios en algunos widgets: Karla/Lato (custom.css) — no es la fuente principal, se ignora

## Estructura real de la home (orden exacto)
1. **Header en 2 filas**: fila superior = buscador (izq) / logo centrado / cuenta+carrito (der); fila inferior = menú centrado (Home, Shop, Blog, Pages, Contact) sobre fondo blanco, sin franja de color.
2. **Hero slider a pantalla completa** con overlay oscuro (`rgba(0,0,0,0.7)`): texto en minúsculas alineado, "simple product" (h1) / "best choice for 2022" (h2) / botón "read more" en el acento naranja.
3. **Grilla de productos con tabs**: menú de pestañas centrado (New arrivals / Furniture / Accessories / Lighting), tarjetas simples sin bordes gruesos: foto cuadrada, nombre, precio (con tachado si hay oferta), botón "Add to Cart" de texto simple.
4. **Banners de categoría asimétricos**: grid de 4 columnas en proporción 4/8/8/4 (dos filas), cada banner es una foto con título+bajada superpuestos ("Best Hat Collection — Sell Up To 40 Off").
5. **Newsletter** centrado, franja angosta, sin fondo de color.
6. **Blog** (se ignora — no aplica a tiendas de tol.ar).
7. **Footer** oscuro (#333) en 4 columnas: Información de la tienda (dirección/email/teléfono con iconitos), Information (links), My Account (links), y una cuarta columna (redes/newsletter).

Este orden (header en 2 filas → hero con overlay oscuro → tabs de productos → banners asimétricos de categoría → newsletter → footer oscuro) es la seña de identidad "minimalista": mucho blanco, un solo color de acento, tipografía fina, nada de tarjetas redondeadas ni franjas de color como en Moderno/Elegante/Bold/Blingg/Artesano.

Listo para armar el modelo "Minimal" cuando se diga "codificá".
