# Inference-only verification — installation walkthrough

Source: the user's pasted draft, **Inference-only verification using bandwidth limiting and recomputation**, supplied in this conversation. This interface explains the proposal; it does not independently validate the scheme or execute a verifier.

Open `install.html` through the local server. It is separate from `fleet.html`, which remains the general-purpose rack asset editor.

| Screen | Visual action | Message |
| --- | --- | --- |
| 1. Connected DC | Show a tiled, open-roof data hall, 256 solid racks, service cabinets, busways, coolant routes, gold fast fabric and blue frontend Ethernet. | Both networks exist from the first frame. |
| 2. Zoom in | Focus on 3 racks with all high-bandwidth cabling still present; fade the surrounding DC to 18%. | Zoom before altering the network. |
| 3. Remove network | Remove fast cabling first, then add one metre to rack and row gaps. Keep 3 slow frontend links visible and connected as racks move. | Remove scale-out and most frontend networking; retain rack-local NVLink and one slow frontend per unit. |
| 4. Inference units | Hold the separated layout and show the surviving request/reply network. | One rack serves the approved model independently; the draft proposes a single slow NIC/link per unit. |
| 5. Install TAPs | Lower an orange TAP into each existing frontend link; leave the frontend in place. | Forward traffic and independently copy it; the proposed active TAP enforces the example link rate. |
| 6. Recompute system | Add green copy paths, an aggregator, and a verifier rack with supporting hardware. | The verifier inside the DC receives one-way copies and has enough compute for the approved model. |
| 7. Sample check | Highlight a sampled unit; animate copy, replay and compare; demonstrate both PASS and FAIL. | Check a sampled reply and report a restricted outcome. |

No storage is moved or added to the inference units in this walkthrough. The verifier’s extra support hardware is a schematic illustration, not a rack BOM. Existing cold-storage arrangements are assumed adequate for this visual explanation; the draft's storage question remains unresolved.

The network selection follows the draft’s “Reduce high-bandwidth networking and segment the cluster” and “Install network TAPs” sections: remove the back-end scale-out fabric and most frontend links, replace the frontend NICs with one slow link per inference unit, retain internal NVLink, then TAP every surviving frontend link. The draft gives two management alternatives; this visual chooses telemetry over the monitored frontend and does not depict a separate air-gapped management fabric.

## Visual and scientific scope

- **Three racks means three inference units**, not one three-rack NVLink domain. One NVL72 rack retains its 72-GPU scale-up network.
- The approximately **1 Gb/s** frontend is the draft's example, not a general workload-sizing result. The model must fit in the unit with adequate serving memory.
- Added rack spacing is for legibility; the animation does not assert that a metre of separation enforces isolation.
- The illustration removes the original management fabric. Permitted telemetry would use the monitored frontend; update and weight-loading procedures still require agreement. The alternate air-gapped-management option is not depicted.
- Packet-copy arrows go from TAPs through aggregation to the verifier. They do not depict verifier NACKs or retries back to the inference units.
- The approved model is prepared before checking begins. Installation and model-loading protocols are outside this animation.
- The last screen uses two **invented demonstration replies**. It runs no AI model, processes no user traffic, and implements no DiFR algorithm. Simple matching/different text is a visual analogy; production verification compares model behaviour under an agreed method, settings, and tolerance.
- PASS and FAIL apply to the illustrative sampled request. Passing a sample is **not** a proof that all workloads in the DC are inference-only.
- Restricted status reporting is represented; no raw tokens or weights are shown leaving through that path. Verifier integrity, confidentiality, undisclosed links, power/EM/acoustic channels and covert devices remain requirements, not solved claims.

## Interaction

Next / Back move between screens; stage buttons allow direct access. Restart restores the initial scene. Drag to orbit, scroll to zoom, and use Reset camera to return to the current composition. Save view opens a 3600-pixel-wide PNG preview with a download link. The sample-check screen offers Matching reply and Different reply examples, each initiated by Run sample check. Reduced-motion settings skip transitions and display the sample outcome immediately.

## Persistent frontend and data hall

The blue frontend exists at screen 1 for all 256 racks. The 3 focused paths are the same mesh objects before and after network removal, rack separation, and TAP installation. Frontend traffic has no animated packet dots. Moving racks updates their existing cable geometry so they remain attached; TAP insertion only adds the orange inline devices. Green verifier-copy branches are added in the subsequent verifier installation, as required by the proposal.

The contextual frontend includes row access switches, paired aggregation switches, customer-edge switching and two border uplinks. The focused links are shown routing out through the DC boundary; their intermediate switching is abstracted, with no local frontend cabinet. This is a service-path schematic, not a port-complete or capacity-sized DGX SuperPOD cabling plan. Existing routes are retained visually; the draft’s NIC/media conversion is abstracted. Gold looms represent the fast paths being removed, including excess frontend/storage connectivity.

Reference: [NVIDIA GB200 SuperPOD network fabrics](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/network-fabrics.html), especially Storage and In-band Ethernet Fabric and Customer Edge Connectivity. The vendor describes parallel storage/in-band paths, aggregation and customer-edge uplinks; the low-rate inference-unit configuration is the user’s proposal, not NVIDIA’s standard deployment.

The cutaway hall adds tiled circulation aisles, row-end service/CDU cabinets, overhead power busways, coolant supply/return routes, perimeter columns, lighting and a back wall. These are architectural context, not engineered power or cooling sizing; no storage relocation is depicted. The hall and surrounding infrastructure fade together during the close-up.

## Managed cable routing

Frontend cabling uses 9 mm illustrative jackets with short local service loops, rack-side guides and clips, rack-mounted inline TAPs, supported ladder trays per row, a transverse collection tray, and a supported exit route. Cable lanes remain parallel and distinct at the DC exit; they do not converge to an invented electrical junction. The blue paths remain static and present from the first frame. They follow rack movement while retaining the same mesh identities.

Straight segments with local rounded bends replace unconstrained interpolating splines. Restraints, rack brackets, tray stanchions and anchored baseplates give the routes physical support. The 9 mm jacket, bends, TAP brackets and tray sizes are illustrative geometry, not a manufacturer-qualified installation specification. Frontend copper paths are kept separate from the removed fast-fabric looms and overhead power/cooling. Verifier-copy routes use the managed overhead paths too.

Design reference: [NVIDIA cable management guidance](https://docs.nvidia.com/dgx-superpod/design-guide-cabling-data-centers/latest/cable-management-guidance.html), covering supported bends, segregation, strain support and ladder/basket/fiber tray systems.

## Three-rack presentation

The zoom highlights three adjacent racks in one row; the other 253 racks remain visible at 18% opacity. Subsequent steps keep this three-unit selection, including its three frontend links and TAPs. The 3D canvas has no text cards, callouts, counters, legend or controls overlaid on it. Step narration, cable colours and camera/export controls live in the sidebar.
