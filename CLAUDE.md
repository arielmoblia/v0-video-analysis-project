# MEMORIA DEL PROYECTO — tol.ar

Antes de arrancar cualquier tarea, leer TODOS estos archivos:

/var/www/control/memoria/jefe/conocimiento-negocio.md
/var/www/control/memoria/jefe/aprendizajes.md
/var/www/control/memoria/biblioteca/indice.md
/var/www/control/memoria/biblioteca/tol.ar/pagos-tolar/prologo.md
/var/www/control/memoria/biblioteca/tol.ar/pagos-tiendas/prologo.md
/var/www/control/memoria/biblioteca/tol.ar/seo/prologo.md
/var/www/control/memoria/biblioteca/tol.ar/marketing/prologo.md
/var/www/control/memoria/biblioteca/tol.ar/tiendas/prologo.md
/var/www/control/memoria/biblioteca/tol.ar/planes/prologo.md
/var/www/control/memoria/biblioteca/tol.ar/core/prologo.md

## Reiniciar el servidor de pruebas (tol-dev)

Nunca reiniciar con `pm2 restart tol-dev` a mano ni purgar el caché de Cloudflare por separado. Usar siempre:

```
bash /var/www/tol.ar-dev/scripts/deploy-dev.sh
```

Hace build + restart + purga de Cloudflare en un solo paso. Si se salta este script, Ariel ve versiones viejas de la página (JS/HTML cacheado) aunque el código ya esté arreglado — es el bug repetido de "sigue igual" que ya pasó varias veces.
