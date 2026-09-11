#!/bin/bash
# Reinicia tol-dev y purga el caché de Cloudflare en el mismo paso,
# para no depender de que alguien se acuerde de purgar a mano.
set -e

cd /var/www/tol.ar-dev

npm run build
pm2 restart tol-dev --update-env

TOKEN=$(grep -m1 "^CLOUDFLARE_API_TOKEN=" .env.local | cut -d= -f2-)
ZONE=$(grep -m1 "^CLOUDFLARE_ZONE_ID_TOLAR=" .env.local | cut -d= -f2-)

if [ -n "$TOKEN" ] && [ -n "$ZONE" ]; then
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' > /tmp/cf-purge-dev.json
  echo "Caché de Cloudflare purgado."
else
  echo "AVISO: no encontré el token/zona de Cloudflare en .env.local, no se purgó caché."
fi
