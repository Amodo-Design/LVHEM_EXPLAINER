"""Extract rack-local connection geometry. No external network racks or inter-rack fabric."""
import json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
n=json.loads((ROOT/'assets/network-model.json').read_text());layers={'nvlink':[],'front':[],'management':[]};exits=[]
for q in n['routes']:
 points=None;layer=None
 if q['id'].startswith('NVL-R1-') and q['detail']=='individual':points=q['points'];layer='nvlink'
 elif q['id'].startswith('OOB-R1-E'):points=q['points'];layer='management'
 elif q['id'].startswith('IB-R1-C') or q['id'].startswith('ETH-R1-C'):
  points=[a[:] for a in q['points'][:4]];local_x=points[0][0]+900;trunk_x=(-1 if local_x<0 else 1)*(254+(len(exits)%12)*2);points[2][0]=trunk_x-900;points[-1]=[trunk_x-900,-538,2280];exits.append([trunk_x,-538,2280]);layer='front'
 if points:
  for a,b in zip(points,points[1:]):layers[layer].extend([[a[0]+900,a[1],a[2]],[b[0]+900,b[1],b[2]]])
# Coarser harness view used when the rack is too small for individual connections.
coarse={'nvlink':[],'front':[],'management':[]}
for x in [-146,-60,60,146]:coarse['nvlink'] += [[x,490,518],[x,490,1673]]
for x in [-270,-254,254,270]:coarse['front'] += [[x,-515,500],[x,-515,2280]]
for x in [-265,265]:coarse['management'] += [[x,-525,500],[x,-525,2030]]
D={'exits':exits,'layers':layers,'coarse':coarse,'note':'NVLink paths group 8 logical links per tray pair. Front network runs end at rack-top exits; external switches and inter-rack connections omitted. All cable routes are illustrative.'}
(ROOT/'assets/fleet-cables.js').write_text('export default '+json.dumps(D,separators=(',',':'))+';')
print({k:len(v)//2 for k,v in layers.items()})
