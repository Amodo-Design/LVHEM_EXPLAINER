# Amodo Apps Playground

Repository: **Amodo-Design/LVHEM_EXPLAINER** (private).

The root Dockerfile serves the text-free presentation at `/` and `/presentation.html`. It also serves the self-contained fake verification dashboard at `/fake/` and the zero-knowledge edition of the presentation at `/zkml/`, with its proof dashboard at `/zkml/chat.html` (see README). The image includes the model, vendored Three.js and responsive WebP versions of the three photo callouts. Original JPEGs are retained in Git but excluded from the deployed image. Regenerate web assets with `python3 scripts/optimize-images.py` whenever a source photo changes. It does not serve the asset editors, reference downloads, Git history or export gallery.

This follows the [Apps Playground requirements](https://apps.amodo.tools/docs/app-requirements): the platform builds the default branch using `docker build <repo-root>` without build arguments. No image registry upload or Compose configuration is needed.

## Registration

- Repository: `https://github.com/Amodo-Design/LVHEM_EXPLAINER`
- Default branch: `main`
- Suggested app name: `lvhem-explainer`
- Access: **Internal**, unless a different audience is intended
- App Secrets: **none**
- Exposed/listening port: **8080/tcp**, the image's only exposed port
- Persistent storage: **not used**; nothing needs to be seeded under `/data`
- Start command: the image's default nginx entrypoint; no override needed

Register the repository in Apps Playground, then trigger Deploy. The resulting address is `https://<app-name>.apps.amodo.tools/`; it is not hardcoded in the app. The platform supplies TLS and sign-in. The application is read-only and does not consume user identity headers.

## Local build and verification

```sh
docker build -t lvhem-explainer:playground .
scripts/check-container.sh lvhem-explainer:playground
docker run --rm --name lvhem-explainer -p 127.0.0.1:8080:8080 lvhem-explainer:playground
```

Open `http://127.0.0.1:8080/`. The check script starts a temporary container on a random loopback port and removes it afterwards. It checks the homepage, every runtime asset, exact optimized photo bytes against `assets/web/`, JavaScript MIME types, missing/private paths, the non-root runtime user, and the single-port contract.

For the isolated Colima runtime created on this workstation, prefix Docker commands with `docker --context colima-ai-verification`, or set `DOCKER_CONTEXT=colima-ai-verification` when running the check script. This does not change the user's default Docker context.

To build specifically for an x86 Linux host:

```sh
docker build --platform linux/amd64 -t lvhem-explainer:amd64 .
```

The base image is pinned to a multi-architecture digest for reproducible builds; both ARM64 and AMD64 are supported. Updating nginx requires updating that digest and rebuilding.

## Operations

`/healthz` returns HTTP 200 and `ok`. A Docker health check is included for local diagnostics, although Playground does not use health checks for deployment readiness. Access/error logs go to stdout/stderr. All assets are local to the image; no CDN or API is needed at runtime. Stable asset names use `Cache-Control: no-cache` so browsers revalidate after deployments. The server binds on all container interfaces and does not require a `PORT` environment variable.

Changes are released by pushing to `main` and manually deploying again in Playground. GitHub repository creation and image preparation do not by themselves register or deploy the app.
