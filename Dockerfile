# Apps Playground builds this file with no build arguments.
# Multi-architecture upstream image; runs as the unprivileged nginx user.
FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:04a3275f25d766cff8926d2e57b2ff34a783d6b12a702dc98bb82226d2d9a508

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY presentation.html /opt/presentation/presentation.html
# The same presentation with the chat, ledger and proof demo as its dashboard step, served at /gpai.
COPY gpai.html /opt/presentation/gpai.html
COPY src/install_viewer.js src/rack_geometry.js src/fleet_layout.js \
     src/fleet_bundles.js src/data_hall.js src/verification_scene.js \
     src/iceberg_theme.js src/photo_callouts.js src/cable_routes.js \
     src/photo_callouts.css /opt/presentation/src/
COPY vendor/three.module.js vendor/three.core.js vendor/OrbitControls.js \
     vendor/THREE-LICENSE.txt /opt/presentation/vendor/
COPY assets/model-data.js /opt/presentation/assets/
COPY assets/web/ /opt/presentation/assets/web/
COPY assets/fonts/ /opt/presentation/assets/fonts/
# Self-contained fake of the verification dashboard, served at /fake/.
COPY fake/ /opt/presentation/fake/
# Chat, ledger and zero-knowledge proof replay, served at /ledger/ and embedded by /gpai.
COPY ledger/ /opt/presentation/ledger/

# Must be the only port in the image's ExposedPorts, including inherited ports.
EXPOSE 8080/tcp
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
