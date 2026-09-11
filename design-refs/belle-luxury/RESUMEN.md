# belle-demo-2 (Shopify demo) — material sacado

Fuente: https://belle-demo-2.myshopify.com/ (tema Shopify "Belle" real, moda/fashion premium)

Guardado en esta carpeta:
- `index.html` — página completa tal cual la sirve el servidor
- `css/theme.css`, `css/default.css` — estilos reales del tema
- `images/` — fotos reales: `hero-slide1.jpg`, `hero-slide2.jpg` (fondos del slideshow), `cat-1/2/3.jpg` (fotos de categoría/masonry)

## Colores reales (variables CSS del tema, `--cs-*` y globales)
- Fondo: `#ffffff` (blanco)
- Botón principal: `#111111` (negro) con texto blanco
- Acento dorado (usado en comillas/testimonios): `#ebb868`
- Bordes: `#333333` / `#dddddd`
- Hero: overlay de texto blanco sobre foto (franja superior con fondo `#111111` para el anuncio)

## Tipografía real
- Principal: `"IBM Plex Sans", sans-serif` (`--ft1`, `--ft3`)
- Secundaria (usada en algunos títulos): `Epilogue, sans-serif` (`--ft2`)

## Estructura real de la home (orden exacto)
1. **Barra de texto corrido** (marquee) arriba de todo, fondo negro, texto con contorno.
2. **Header**: transparente sobre el hero (se vuelve blanco al hacer scroll — "sticky").
3. **Hero slideshow** a pantalla completa, 2 slides: slide 1 "SINCE 2017 / TIMELESS APPEAL / SAVE UP TO 60% THROUGH DECEMBER" con botones "Shop WOMEN" y "Shop MEN"; slide 2 "THE PERFECT MATCH". Texto centrado, mayúsculas, elegante.
4. **Barra de promoción** con cuenta regresiva ("SPRING SUMMER SALE — 00 Days : 00 : 00 : 00 — Shop Now"), fondo negro.
5. **Tabs de colección** (WOMEN / MEN / SALE) con carrusel de productos debajo de cada tab.
6. **Banner tipo masonry** (fotos grandes en mosaico irregular, no grilla uniforme).
7. **Shop the look**: foto grande de ambiente con productos "clickeables" superpuestos.
8. **Lista de colecciones** en carrusel (grid con scroll horizontal, no wrap).
9. **Banner de beneficios** (4 columnas con ícono): Free Shipping & Return / Money Guarantee / Online Support / Secure Payments.
10. **Testimonios** con comillas doradas (`--clat:#ebb868`) sobre fondo claro.
11. **Footer** estándar Shopify (columnas de links + newsletter).

Rasgos distintivos frente a los otros modelos: paleta estrictamente blanco/negro con UN solo acento dorado (nada de colores vivos como Bold ni celeste como Blingg), tipografía sans-serif geométrica (IBM Plex), textos en mayúsculas, botones rectos negros (no píldora), y foco fuerte en fotografía de moda a pantalla completa. Es el más "premium/frío" de todos.

Listo para armar el modelo "Luxury" cuando se diga "codificá".
