#!/bin/sh
# Use DOCKER_CONTEXT when the local daemon is not the active Docker context.
set -eu
image=${1:-ai-verification:playground}
container="ai-verification-check-$$"
cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT HUP INT TERM

ports=$(docker image inspect --format '{{json .Config.ExposedPorts}}' "$image")
[ "$ports" = '{"8080/tcp":{}}' ] || { echo "Unexpected exposed ports: $ports" >&2; exit 1; }
user=$(docker image inspect --format '{{.Config.User}}' "$image")
[ -n "$user" ] && [ "$user" != root ] && [ "$user" != 0 ] || { echo 'Expected an unprivileged runtime user' >&2; exit 1; }
docker run -d --name "$container" -p 127.0.0.1::8080 "$image" >/dev/null
port=$(docker port "$container" 8080/tcp | sed 's/.*://')
base="http://127.0.0.1:$port"
tries=0
until curl --fail --silent "$base/healthz" >/dev/null; do
    tries=$((tries + 1))
    [ "$tries" -lt 30 ] || { docker logs "$container"; exit 1; }
    sleep 1
done
for path in / /presentation.html /src/install_viewer.js /src/photo_callouts.css \
    '/src/verification_scene.js?v=photo-callouts' '/src/photo_callouts.js?v=web-photos' \
    /src/rack_geometry.js /src/fleet_layout.js /src/fleet_bundles.js /src/data_hall.js \
    /src/iceberg_theme.js /src/cable_routes.js /vendor/three.module.js /vendor/three.core.js \
    /vendor/OrbitControls.js /vendor/THREE-LICENSE.txt /assets/model-data.js \
    /assets/web/photos.js /assets/fonts/ibm-plex-sans-regular-latin.woff2 /assets/fonts/OFL.txt; do
    curl --fail --silent --show-error "$base$path" -o /dev/null
done
# Verify each optimized photo exactly matches the current working-tree asset.
for file in assets/web/*.webp; do
    curl --fail --silent --show-error "$base/$file" | cmp "$file" -
done
curl --fail --silent "$base/" | grep -q 'data-presentation="iceberg"'
curl --fail --silent --head "$base/src/install_viewer.js" | grep -qi 'content-type:.*javascript'
for path in /.git/config /README.md /references/ /missing-file.js /assets/compute.jpg /assets/recompute.jpeg /assets/TAP.jpg; do
    [ "$(curl --silent -o /dev/null -w '%{http_code}' "$base$path")" = 404 ] || exit 1
done
echo "PASS: root presentation, exact current photo bytes, runtime assets, JavaScript MIME type, one TCP port, non-root user and 404 boundaries."
