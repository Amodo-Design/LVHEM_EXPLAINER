# Inference-only verification — installation walkthrough

Source: the user's pasted draft, **Inference-only verification using bandwidth limiting and recomputation**, supplied in this conversation. This interface explains the proposal; it does not independently validate the scheme or execute a verifier.

Open `install.html` through the local server. It is separate from `fleet.html`, which remains the general-purpose rack asset editor.

| Screen | Visual action | Message |
| --- | --- | --- |
| 1. Connected DC | Show 256 solid racks and substantial shared cable bundles. | Start from a connected data centre. |
| 2. Zoom in | Focus on 15 racks with all high-bandwidth cabling still present; fade the surrounding DC to 18%. | Zoom before altering the network. |
| 3. Remove network | Remove fast cabling first, then add one metre to rack and row gaps. Keep 15 slow frontend links visible and connected as racks move. | Remove scale-out and most frontend networking; retain rack-local NVLink and one slow frontend per unit. |
| 4. Inference units | Hold the separated layout and show the surviving request/reply network. | One rack serves the approved model independently; the draft proposes a single slow NIC/link per unit. |
| 5. Install TAPs | Lower an orange TAP into each existing frontend link; leave the frontend in place. | Forward traffic and independently copy it; the proposed active TAP enforces the example link rate. |
| 6. Recompute system | Add green copy paths, an aggregator, and a verifier rack with supporting hardware. | The verifier inside the DC receives one-way copies and has enough compute for the approved model. |
| 7. Sample check | Highlight a sampled unit; animate copy, replay and compare; demonstrate both PASS and FAIL. | Check a sampled reply and report a restricted outcome. |

No storage is moved or added to the inference units in this walkthrough. The verifier’s extra support hardware is a schematic illustration, not a rack BOM. Existing cold-storage arrangements are assumed adequate for this visual explanation; the draft's storage question remains unresolved.

The network selection follows the draft’s “Reduce high-bandwidth networking and segment the cluster” and “Install network TAPs” sections: remove the back-end scale-out fabric and most frontend links, replace the frontend NICs with one slow link per inference unit, retain internal NVLink, then TAP every surviving frontend link. The draft gives two management alternatives; this visual chooses telemetry over the monitored frontend and does not depict a separate air-gapped management fabric.

## Visual and scientific scope

- **Fifteen racks means fifteen inference units**, not one fifteen-rack NVLink domain. One NVL72 rack retains its 72-GPU scale-up network.
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
