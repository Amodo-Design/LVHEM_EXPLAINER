# GB200 NVL72 asset system — technical basis

Revision 0.2, 20 September 2026. This is a source-informed illustration, not a certified installation design or manufacturing model. The source network guide contains some B200/GB200 editorial inconsistencies; the choices below identify the particular figures used instead of combining incompatible topologies.

## Selected implementation

Four NVIDIA DGX GB200 NVL72 compute racks occupy the original 2.4 m-wide row. Two illustrative network racks sit behind it. The network follows the **single scalable-unit (SU)** topology in Figure 9 of the GB200 SuperPOD network guide, with full eight-rack fabric capacity and four installed compute racks. This is consistent with the guide's instruction to provision the full SU fabric for smaller deployments.

This does **not** use the different, multi-SU spine-leaf-group design from Figure 10. In particular, the nine shared spines in this asset must not be confused with that design's 24 spines per SU.

## Verified hardware architecture

Each compute rack has 18 compute trays (2 Grace CPUs and 4 Blackwell GPUs each), 9 NVLink switch trays (2 switch ASICs each), 8 power shelves (6 PSUs each), 2 management switches, and 4 rear NVLink cable cartridges. The front group order follows NVIDIA's reference elevation: 2 management switches; 4 power shelves; 10 compute trays; 9 NVLink trays; 8 compute trays; 4 power shelves.

The four-rack total is 288 GPUs and 144 CPUs. Each rack is one independent 72-GPU NVLink domain. There is no inter-rack NVLink connection in this GB200 design.

Rack envelope: 600 mm wide, 2,236 mm high. The 1,068 mm base rack is extended by 132 mm at the rear for a total 1,200 mm depth. MGX tray chassis width 438 mm, principal depth 766 mm, rear connector envelope approximately 808 mm, 1 RU pitch 44.45 mm. See OCP MGX v1.1 figures 7-1, 7-2, 7-8 and 7-11. Outer frame sections, precise absolute U allocations, service handles, small connectors, cooling pipe fittings, board/cold-plate geometry and grille detail are simplified. The front cabling recess is based on the rack drawing.

## Network topology

| Layer | Modeled topology | Installed links / capacity |
|---|---|---|
| NVLink 5 | Every GPU connects to each of 18 NVSwitch ASICs inside its rack | 72 × 18 = 1,296 logical links per rack; 5,184 across the four racks |
| Compute InfiniBand | 4 ConnectX-7 NDR400 ports per compute tray; each port assigned to one of four rails | 72 trays × 4 = 288 host-facing 400 Gb/s links |
| IB leaf tier | One leaf per rack per rail, full SU provisioned | 32 QM9700 leaves: 16 serving the installed racks, 16 for future racks |
| IB spine tier | Shared single-SU spine tier, Figure 9 | 9 QM9700 spines |
| IB leaf–spine | Each leaf connects to every spine with 2 NDR400 links | 32 × 9 × 2 = 576 NDR400 links, including provisioned expansion fabric |
| Storage | 1 port on each of two BlueField-3 DPUs per tray | 144 × 200 Gb/s host connections, dual attached |
| In-band management | Other port on each BlueField-3 DPU | 144 × 200 Gb/s host connections, dual attached |
| Shared Ethernet | Figure 13: 4 compute-facing SN5600 leaves, 2 SN5600 aggregation spines, 2 SN5600 storage/service leaves | First compute leaf pair serves four racks; second pair provides four-rack expansion capacity |
| Compute Ethernet leaf uplinks | Each compute leaf to each aggregation spine | 6 × 800 Gb/s per leaf–spine connection |
| Storage/service leaf uplinks | Each storage/service leaf to each aggregation spine | 4 × 800 Gb/s per leaf–spine connection |
| Rack OOB | 3 management endpoints per compute tray, 3 per NVLink switch tray, 1 per power shelf | 89 per rack = 356 endpoints, distributed 45/44 over two 48-port management switches |
| Rack OOB uplinks | Each rack management switch to both Ethernet aggregation spines | 16 × 100 Gb/s links across four compute racks |
| Network-rack OOB | Two additional SN2201 service switches manage external IB/Ethernet switches and UFM appliances | Explicit endpoint assignments in the inventory |
| UFM | Two illustrative UFM appliances, management and IB attachments | Adapter speed deliberately unspecified; hardware-dependent |
| External storage | Connection boundary for a partner storage design | 16 × 800 Gb/s storage-facing capacity across the two service leaves, following Figure 15 / accompanying text |
| Customer edge | One connection from each Ethernet aggregation spine | 2 × 100 Gb/s; BMS represented as a routed external boundary |

QM9700 is 1U with **32 physical OSFP cages carrying 64 logical NDR ports**. The model does not equate 64 ports with 64 cages. SN5600 is 2U with 64 800G cages. SN2201 has 48 RJ45 access ports and four 100G uplink ports; the older rack study's management-faceplate geometry is a simplified illustration, not a port-accurate CAD faceplate.

## What a visible line means

The static exports show cable **bundles**, not one line per cable. The interactive viewer offers endpoint detail. NVLink detail uses one route for a compute-tray / switch-tray pair, representing 4 GPUs × 2 switch ASICs = **8 logical NVLink connections**. Physical coax cable/conductor counts are different and are not inferred from logical link counts. The default NVLink view shows the four cartridge harness envelopes and all tray mating planes.

The CSV inventory expands NVLink to individual GPU/ASIC adjacencies. Other rows carry `links` and `gbps` fields: sum the link count rather than assuming one CSV row always means one link. Presentation-only summaries are excluded from that inventory. `reserved=true` means a provisioned connection serving future compute capacity; the physical leaf–spine fabric is still included in the architecture.

All routes are illustrative centerlines. No transceiver SKU selection, fiber polarity, breakout cable assembly, bend-radius compliance, routing length, cable tray fill, power budget, thermal design or rack installation sign-off is claimed. Some front port landing positions are approximated. Switch serial ports, console wiring, power shelf power-brake/current-share control links, switch internal traces and physical NVLink conductor routing are outside the network-connectivity illustration.

Storage arrays, NFS appliances, control-plane server counts and customer-edge/BMS hardware are deliberately boundary endpoints: these depend on the specific implementation. No multi-SU super-spines or core tier are needed for the selected single-SU scope. Authentication/security zones and VLAN/VXLAN segmentation must be implemented in an actual deployment; colors are illustration layers only.

## Sources

1. [NVIDIA DGX GB hardware guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html): component counts, compute tray content, rear cartridge and cooling architecture.
2. [NVIDIA GB200 rack elevation](https://docs.nvidia.com/dgx/dgxgb200-user-guide/_images/hardware-rack-configuration.png): group order and 10/9/8 tray arrangement.
3. [OCP MGX Accelerated Computing Rack and Trays Specification v1.1](https://drive.google.com/file/d/1W8dHYosdolwKlBLHRgTq-pVWN-8v4Q3a/view): geometry, figures 7-1 / 7-2 / 7-8 / 7-11. Local copy under `references/`.
4. [NVIDIA DGX GB200 SuperPOD network fabrics](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/network-fabrics.html): **Figures 9, 13, 15 and 17**, single-SU and Ethernet topology, edge handoff and incomplete-SU guidance.
5. [NVIDIA DGX GB200 SuperPOD components](https://docs.nvidia.com/dgx-superpod/reference-architecture-scalable-infrastructure-gb200/latest/dgx-superpod-components.html): front-side compute ports, CX7, BF3, switch-tray management and power-shelf BMC endpoints. Some summary rows contain inconsistent legacy wording; the explicit GB200 tray description and topology figures control this model.
6. [NVIDIA NDR cabling components](https://docs.nvidia.com/dgx-superpod/design-guide-cabling-data-centers/latest/ndr-components.html): QM9700 32 cages / 64 NDR ports in 1U.
7. [NVIDIA Spectrum-4 SN5000 introduction](https://networking-docs.nvidia.com/sn5000hw/introduction): SN5600 64 × 800 Gb/s, 2U.
8. [NVIDIA Ethernet layer 1 guide](https://docs.nvidia.com/networking-ethernet-software/knowledge-base/Setup-and-Getting-Started/layer-1-Data-Center-Cheat-Sheet/): SN2201 access and uplink port capacities.
9. [Cheval MGX rack v1.1](https://chevalgrp.com/nvidia-mgx-racks/): 600 × 1,068 × 2,236 mm base rack and 132 mm rear extension.

Original illustration geometry is generated locally from documented facts and interpreted dimensions. Reference images and specifications remain the property of their respective publishers and are included only as research references. This asset is not an NVIDIA-endorsed product.

## Scalable rack field (fleet.html)

The field repeats the original rack model with instancing and distance-dependent detail, up to 1,024 racks. Rows are uniformly spaced, without four-rack grouping. Both sliders specify clear edge-to-edge gaps in metres and are visual composition settings, not facility-design guidance.

Every rack has a continuous route to a shared overhead routing layer. Rack branches join row bundles, which join a cross-row route. Near-view front cables extend from their rack-top exits to the same routing coordinates. The routing graph is checked for reachability across all racks. This proves visual route continuity, not network correctness or bandwidth capacity.

The overview abstracts active switching, individual fibres, port allocation, redundant fabrics, and the actual InfiniBand/Ethernet leaf/spine design. Route junctions indicate shared cable pathways, not passive network bus connections. NVIDIA documents NVLink inside the GB200 NVL72 rack and InfiniBand for scale-out between racks: https://docs.nvidia.com/dgx/dgxgb200-user-guide/networking.html . NVLink is never drawn between these NVL72 racks.

Close-up NVLink paths group eight logical links per tray pair. Mechanical cable routes remain illustrative. Detailed hardware is capped at 16 racks in view; distant geometry is simplified. Layout counts do not constitute a validated facility/network/power/cooling deployment plan.

### Bundled cable appearance
The rack field now depicts raised ladder trays, dense row and cross-row cable bundles, curved paired rack drops and retaining bands. Visible strands represent cable groups; exact cable counts, active switching, tray loading and rated bend radii are not certified by the illustration. The visual treatment follows the separation and support principles described in NVIDIA's cable-management guide: https://docs.nvidia.com/dgx-superpod/design-guide-cabling-data-centers/latest/cable-management-guidance.html .

### Solid rendering and photographic comparison

The solid study was compared visually against NVIDIA's GB200 front elevation (`references/hardware-rack-configuration.png`) and a real Digital Realty facility photograph published with this release:
https://www.prnewswire.com/news-releases/digital-realty-adds-renewable-energy-expands-colocation-capacity-in-dallas-portfolio-301116811.html
Photo: https://mma.prnewswire.com/media/1232073/Digital_Realty_inside_data_center.jpg?p=publish&w=950

Observed cues applied: opaque dark frames, metallic equipment fronts, supported yellow fibre bundles, separate individual jackets, broad overhead pathways, curved transitions, and dark retaining straps. The facility photograph is a cabling/material reference, not evidence of a GB200 installation. The original GB200 tray counts and documented front-face port positions remain the hardware reference.

Close-view host cables are modelled as 4.8 mm outside-diameter jackets, with rounded transitions, connector bodies and boots. This is a visual assumption rather than a specification for a selected cable SKU. Bundle display strands, tray capacity, exact bend-radius compliance and port-to-switch allocation are illustrative; active leaf/spine switching remains abstracted in the rack-field study. Front-face detail is simplified relief, not manufacturer mechanical CAD. The result is a reference-informed 3D illustration, not a photogrammetric replica or certified installation model.
