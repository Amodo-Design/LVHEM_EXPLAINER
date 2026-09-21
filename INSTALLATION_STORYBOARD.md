# Inference-only verification — installation walkthrough

Source: the user's pasted draft, **Inference-only verification using bandwidth limiting and recomputation**, supplied in this conversation. This interface explains the proposal; it does not independently validate the scheme or execute a verifier.

Open `install.html` through the local server. It is separate from `fleet.html`, which remains the general-purpose rack asset editor.

| Screen | Visual action | Message |
| --- | --- | --- |
| 1. Connected DC | Show 256 solid racks and substantial shared cable bundles. | Start from a connected data centre. |
| 2. Remove network | Zoom onto 15 racks; fade surrounding infrastructure to 18%; remove high-bandwidth cabling. | Remove scale-out and most frontend networking while retaining rack-local NVLink. |
| 3. Inference units | Mark each rack as one unit; increase visual spacing; add a single slow frontend link per rack. | A unit serves an approved model without high-bandwidth communication to another unit. |
| 4. Install TAPs | Insert an orange TAP into each of the 15 remaining links. | Forward traffic and independently copy it; the proposed active TAP enforces the example link rate. |
| 5. Recompute system | Add green copy paths, an aggregator, and a verifier rack with supporting hardware. | The verifier inside the DC receives one-way copies and has enough compute for the approved model. |
| 6. Sample check | Highlight a sampled unit; animate copy, replay and compare; demonstrate both PASS and FAIL. | Check a sampled reply and report a restricted outcome. |

No storage is moved or added to the inference units in this walkthrough. The verifier’s extra support hardware is a schematic illustration, not a rack BOM. Existing cold-storage arrangements are assumed adequate for this visual explanation; the draft's storage question remains unresolved.

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
