# diani-minimal (dianiswim.com) — material sacado

Fuente: https://www.dianiswim.com/ (tienda real de bikinis, tema Shopify tipo "Dawn" customizado, no inventado)

Guardado en esta carpeta:
- `images/home-full.png` — captura real de la home completa (scrolleada entera, lazy-load forzado)

Sacado con navegador real (chrome-devtools), estilos computados de verdad, no estimados por HTML crudo.

## Colores reales
- Fondo: blanco puro `#FFFFFF`, sin franjas de color en ningún lado
- Texto body: `rgb(34,34,34)` (#222)
- Precio: `rgb(18,18,18)` (#121212), casi negro
- Botones/links: negro `#000` sobre blanco, sin color de acento — **cero color de marca**, todo el color lo ponen las fotos de producto
- Bordes: prácticamente inexistentes (`border: 0`, `border-radius: 0`, `box-shadow: none` en botones y tarjetas)

## Tipografía real
- Única fuente en toda la página: **"Instrument Sans", sans-serif** (headers, body, precios, botones, footer — todo igual)
- Tamaños chicos: body/nav 14-15px, precios 14px, nada grande excepto el logo
- `letter-spacing` leve pero consistente: 0.6-1px según elemento (le da ese aire "fino")
- Todo en minúsculas (nav, nombres de producto en minúscula tipo "Rose Top - Shiny Silver" pero con inicial mayúscula, no todo mayúscula)
- Logo: wordmark propio "diani" en serif fina, centrado — es la única tipografía distinta de toda la página

## Estructura real de la home (orden exacto)
1. **Barra anuncio** arriba: "Free shipping on orders over €300", centrada, texto chico
2. **Header una sola fila**: Shop / Collections / About / Process / Contact a la izquierda, logo "diani" centrado, selector país+moneda / buscador / login / carrito a la derecha
3. **Hero = foto de producto a pantalla completa**, sin overlay, sin texto superpuesto, sin botón. Es puro contenido editorial/fotográfico (modelo con el producto puesto)
4. **Grid de productos 4 columnas**, sin tabs ni categorías arriba: foto cuadrada (con 2da foto en hover), nombre del producto, precio debajo, todo centrado, sin bordes ni sombras. Se repite varias filas (vi ~26 productos antes del botón)
5. **Botón "View all"** centrado, chico, borde fino, sin relleno de color
6. **Newsletter**: título "JOIN OUR NEWSLETTER" centrado, un solo input de email con flecha, sin fondo de color, mucho aire alrededor
7. **Footer flaco, 4 columnas, fondo blanco** (no oscuro): Help (Size Guide/Shipping/Returns/Contact) · Legal (Terms/Privacy) · Socials (Instagram/TikTok) · selector de país. Todo en texto chico, sin iconos

## Lo que lo hace distinto de "Minimal" (el que ya existe en tol.ar, basado en sa-minimal/Shopify)
El estilo "Minimal" que ya está armado en tol.ar viene de un demo Shopify distinto (sa-minimal): tiene header en 2 filas, hero con overlay oscuro + texto, tabs de categoría, banners asimétricos y footer oscuro #333.

Diani es **más extremo todavía**: cero overlay de texto en el hero, cero tabs, cero banners de categoría, footer blanco (no oscuro), cero color de acento — el único "color" de toda la tienda son las fotos de producto. Es un paso más allá de minimalista: "editorial silencioso".

Si se arma como estilo nuevo, no puede llamarse igual puertas adentro que el "Minimal" existente (ya tiene id `minimal` en `app/templates/page.tsx` y componentes `store-minimal-live.tsx` / `store-header-minimal.tsx` / etc.). Habría que darle un id interno distinto (ej. `editorial` o `diani`) aunque de cara al cliente se muestre como "Minimalista" o similar.

Listo para armar el estilo nuevo cuando Ariel dé el OK (es cambio visible para clientes → propuesta primero, ejecución después, según preferencias del Agente 99).
