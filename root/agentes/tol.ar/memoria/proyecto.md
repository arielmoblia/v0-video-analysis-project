# Proyecto tol.ar

## Qué es
Plataforma multi-tenant de ecommerce para emprendedores argentinos. Cada emprendedor tiene su propia tienda online en un subdominio (ej: pruebaz.tol.ar). Ya tiene tiendas reales funcionando con clientes reales.

## Stack técnico
- Framework: Next.js 16 (rama tol1 en GitHub: arielmoblia/v0-video-analysis-project)
- Base de datos: Supabase (proyecto correcto: tnhtmgltyehnroaxdtjr.supabase.co)
- Estilos: Tailwind CSS
- Pagos: MercadoPago integrado
- Hosting: VPS Hostinger 157.173.212.229

## Estructura de puertos en el VPS
- 80 → nginx → tol.ar (producción con SSL)
- 3000 → tol.ar producción directa (Next.js)
- 3001 → agente-tol (agente de desarrollo autónomo)
- 3003 → tol-dev (entorno de desarrollo, rama tol1)
- 11434 → Ollama (IA local, sin uso activo)

## PM2 procesos
- id 0: tol.ar (producción, puerto 3000)
- id 1: agente-tol (puerto 3001)
- id 2: tol-dev (puerto 3003)

## Archivos clave del agente
- Interfaz: /root/agentes/public/index.html
- Servidor: /root/agentes/index.js

## Estado actual del proyecto
- ✅ Cambio de CSS aplicado: fondo de la interfaz del agente cambiado de negro a gris 50% (#808080)
- ✅ Sistema de memoria automática al cierre de sesión implementado en index.js
- ✅ Palabra de prueba guardada: FRANCHESCA (para verificar memoria en próxima sesión)
- Ariel quiere hacer un **backup del sistema agente tol.ar** — todavía NO se hizo

## Concepto: auto-operación del agente
- Ariel y el agente estuvieron explorando la idea de que el agente pueda modificar su propia interfaz
- El flujo es: el agente propone un cambio con PROPONER_CAMBIO → Ariel aprueba con APROBAR → el agente escribe el archivo directamente
- Los cambios en archivos estáticos (HTML/CSS) se ven con solo refrescar la página (F5), sin reiniciar PM2

## Sistema de memoria automática al cierre de sesión
- Al final de cada sesión, el agente guarda automáticamente un resumen de lo trabajado en la memoria
- No se necesita autorización ni palabra específica — el agente interpreta cualquier despedida natural ("chau", "buenas noches", "me voy", "hasta mañana", etc.)
- La señal es simple: si el agente respondería "hasta mañana" o similar, entonces guarda el resumen
- El resumen es texto plano, liviano (2-3 líneas por sesión), se acumula sin ocupar espacio significativo
- Se guarda en el VPS, en el archivo de memoria que el agente lee al inicio de cada conversación
- El agente guarda sin preguntar y confirma con "guardado ✅"
- **IMPORTANTE**: esto funciona cuando hablás a través del agente en el VPS (puerto 3001), no directamente con Claude

## Notas operativas
- Las conversaciones que se cortan por error (529, 429) NO se guardan automáticamente en memoria
- Ariel es nuevo en este ecosistema — viene aprendiendo cómo funcionan los errores de Anthropic, los tokens, etc.
- **Error 529**: servidores de Anthropic sobrecargados — se resuelve solo
- **Error 429**: demasiadas solicitudes — límite por plan, se resuelve solo
- **Status en tiempo real de Anthropic**: status.anthropic.com
- Los tokens solo se consumen cuando Ariel manda un mensaje — dejar la sesión abierta sin escribir no cuesta nada