# AI verification — reusable GB200 NVL72 assets

Start with **`fleet.html`** for the scalable rack field, `index.html` for the original four-rack study, or `network.html` for the separate network-fabric variant. Run `./serve.command` on macOS, or `python3 -m http.server 8765 --bind 127.0.0.1` from this folder and open http://127.0.0.1:8765/fleet.html. Three.js is bundled locally; no external runtime calls are needed.

## Rack field

The scene supports 16–1,024 racks in continuous, uniformly spaced rows. Default: 256 racks, 32 per row. **Between racks** (0–2 m) and **Between rows** (0–6 m) control clear edge-to-edge gaps. Changing a gap reroutes connections immediately and retains a close-up camera relative to the selected rack. These are composition controls, not installation clearance recommendations.

Drag to orbit, scroll to zoom, click to select a rack, or double-click to fly into it. Camera buttons show the whole field, selected row, selected rack, and rack rear. Hardware uses three levels of detail and shared instanced geometry, with up to 16 detailed racks in view.

Every rack joins a continuous overhead routing layer. Row bundles connect to a shared cross-row route. Detailed front cable runs continue into these bundles, so they no longer end at rack-top exits. These are schematic bundled routes; actual switches, port assignments, fabric separation, and leaf/spine topology are abstracted. Line junctions represent shared cable routing, not passive electrical splices. NVLink remains rack-local.

The master **Connections** switch controls everything. Independent toggles control **Inter-rack routes**, **Internal NVLink**, **Front cable runs**, and **Management**. Fine connections resolve with proximity. X-ray exposes hidden lines, and three themes are available.

**Save current view · PNG** exports at 4,200 pixels wide with a transparent background. **Save scene settings** and **Load scene settings** preserve spacing, camera, rack count, selected rack, theme, and layers. Version 1 files remain loadable, with their former pod counts converted into racks per row; new files use version 2.

`fleet.html?count=1024&connections=off` opens a large clean field. `src/build_fleet.py` regenerates local cable geometry, while `src/fleet_layout.js` creates uniform positions and continuously connected routing. Rack counts and visual route connectivity do not certify a deployable network architecture.

## Outputs

- `exports/3d/gb200-network-master.blend`: editable Blender master, hardware collections and separate fabric curves.
- `exports/3d/gb200-network-wireframe.glb`: portable 3D line primitives, with fabric nodes named independently. Units are metres, glTF Y-up. Some viewers do not support glTF line primitives; use Three.js or the provided viewer.
- `exports/svg/network-overview.svg`: labeled complete-fabric composition.
- `exports/svg/network-overview-asset.svg`: illustration only, transparent and without labels.
- `exports/svg/network-compute.svg`: InfiniBand view.
- `exports/svg/network-intra.svg`: rack-local NVLink view.
- `exports/svg/network-ethernet.svg`: Ethernet and OOB view.
- Matching `exports/png/*.png`: transparent, 4,200 px wide.
- `assets/network-connections.csv`: machine-readable connection inventory; logical link counts are explicit.
- `assets/network-audit.json`: checked aggregate counts.
- Existing `gb200-pod-*`, `gb200-rack-*`, `pod-*` and `rack-service-*` outputs preserve the rack-only variant.

## Visual system

Geometry is shared between the interactive viewer, Blender, GLB and orthographic vector exports. NVLink is coral; InfiniBand is amber; storage/shared Ethernet is teal; in-band management is blue; OOB is violet. Rack geometry recedes in pale gray. Labels and cables are separate from the rack geometry so they can be restyled independently.

Use the interactive layer picker to isolate a network. Presentation bundles are the default. Endpoint detail shows more connections; NVLink detail still bundles 8 logical links per tray pair. Spare-capacity links can be shown separately. The current-view PNG button exports the 3D canvas without the surrounding controls or DOM labels; use the labeled SVG/PNG exports for annotated presentations.

## Rebuild

```sh
python3 src/build_model.py
blender -b --python src/export_assets.py
python3 src/build_network.py
blender -b --python src/export_network.py
python3 src/rasterize.py
```

`build_network.py` also regenerates the base model. Python standard library and Blender are required; raster exports use `rsvg-convert`, and preview assembly uses Pillow. No package installation is needed on the current workstation.

Read **TECHNICAL_BASIS.md** before making technical claims. Architecture/counts are sourced; rack placement, cable routes and small mechanical features are illustrations. The selected topology is a single eight-rack scalable unit with four compute racks populated, not a four-rack NVLink domain or a complete multi-SU facility design.

The **Cable bundles** and **Cable trays** layers add substantial 3D looms, curved rack drops and overhead ladder trays. These follow the spacing controls. Representative strands convey cable density while the separate network model retains the more explicit architectural inventory.

## Solid rendering and individual fibres

Solid, shaded hardware is now the default. Dark frames, metallic fascia, port recesses, drive handles, fan details, shaded round cable jackets, connector boots and metal tray supports replace the former flat linework. X-ray remains available as an optional layer treatment. Nearby racks show 144 front host cable paths as 3D tubes with smooth bends and strain-relief details; overview bundles use representative strands to keep large scenes practical.

## Animation

The **Animation** panel has **Next** and **Reset** controls. Each click advances one stage:

1. Full data centre, using the current array.
2. Fly into a fifteen-rack group, keeping it opaque while the surrounding racks and network fade smoothly to 18% opacity. The surrounding racks stay visible in subsequent stages.
3. Fade out backend bundles, trays, individual host fibres and management cables. Rack-local NVLink remains.
4. Add **1 metre** to both the rack gaps and row gaps, moving the racks and camera smoothly.

Layout controls are locked during the sequence. Reset restores the original layout and connection-layer settings. Motion respects the operating system's reduced-motion preference. The animation is a visual presentation sequence, not a physical procedure for disconnecting live equipment. The current-view PNG export captures any stage.

## Installation walkthrough

Open **`install.html`** for the separate presentation interface. Seven click-through screens explain the proposed installation: connected DC → zoom with cabling intact → remove fast links and separate racks → inference units → inline TAPs → verifier compute → an illustrative recomputation check. Both matching and differing replies can be demonstrated as sample PASS/FAIL outcomes. Storage relocation is deliberately omitted. Read `INSTALLATION_STORYBOARD.md` for the proposal assumptions and the distinction between this visual analogy and an actual recomputation algorithm.

The installation now starts inside an open-roof data hall with separate gold fast fabric and blue frontend Ethernet. Frontend paths exist for all 256 racks from the start; the same 3 focused paths remain through removal and separation, and TAPs are inserted onto them. Hall architecture and switch routes are schematic; see the storyboard for the scope.

Frontend routes are static (no moving traffic markers), leave the data-centre boundary, and have no local “slow frontend” cabinet or label. Cable geometry follows rack separation to preserve attachment; verifier-copy and recomputation animation remains.

Frontend cable detail uses managed overhead ladder trays, rack-side guides, short service loops, rack-mounted TAPs, restrained parallel cable lanes and anchored supports. Unbounded sweeping floor splines have been removed. The cable-routing helper is `src/cable_routes.js`.

The installation zoom now highlights three adjacent racks, with 253 racks remaining as faded context. The 3D scene has no text overlays; narration and controls remain in the sidebar.
