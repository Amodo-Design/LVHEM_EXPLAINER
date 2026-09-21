"""Network extension. Full eight-rack single-SU fabric, four installed GB200 racks.
Illustration cable routing; connection inventory and bandwidths are explicit.
"""
import json,math,pathlib,csv,collections
import build_model as B
ROOT=B.ROOT; D=json.loads((ROOT/'assets/model.json').read_text());P=D['parts'];T=D['templates'];N=[];routes=[];inventory=[]
colors={'ib':'#be7941','ethernet':'#208d8c','storage':'#208d8c','inband':'#568bba','oob':'#8b71a9','nvl_fabric':'#ce6056','spare':'#a6aba3'}
B.T=T

def make_switch(name,cat,w=438,h=43.6,depth=700,cols=16,rows=2):
 B.template(name,cat);B.box((0,depth/2,0),(w,depth,h))
 for xx in [-232,232]:B.box((xx,8,0),(20,16,h))
 for row in range(rows):
  z=(row-(rows-1)/2)*20
  for col in range(cols):
   x=(col-(cols-1)/2)*24;B.rect(x,-.2,z,20,12)
   B.line([(x-7,-.3,z-3),(x+7,-.3,z-3)])
 for x in [-210,210]:B.screw(x,-.4,0)
make_switch('qm9700','ib',cols=16,rows=2,depth=660)
make_switch('qm9700_spare','spare',cols=16,rows=2,depth=660)
make_switch('sn5600','ethernet',h=87.8,cols=16,rows=4,depth=800)
make_switch('sn5600_spare','spare',h=87.8,cols=16,rows=4,depth=800)
make_switch('service_oob','oob',cols=24,rows=2,depth=432,w=428)
make_switch('ufm','inband',cols=6,rows=1,depth=650)
# Overhead ladder rails; deliberately diagrammatic, not a construction design.
B.template('overhead_tray','frame')
for x in [-270,270]:B.box((x,0,0),(12,2860,35))
for i in range(20):B.box((0,-1400+i*145,-12),(540,14,8))

def add(name,t,pos,**kw):N.append(dict(name=name,template=t,position=pos,**kw));return pos
for r in range(4):
 for p in P:
  q=dict(p);q['position']=[p['position'][0]+(r-1.5)*600,*p['position'][1:]];q['name']=f'R{r+1:02}/'+p['name'];q['rack']=r;q['group']='compute';N.append(q)
for j,x in enumerate([-900,900]):
 add(f'NET{j+1}/frame','frame',[x,2200,0],group='network')
 add(f'NET{j+1}/cable_tray','overhead_tray',[x,600,2570],group='network')
leaf={};spine={};eth={};service={}
for rack in range(8):
 for rail in range(4):
  i=rack*4+rail;j=i%2;slot=i//2;x=[-900,900][j];z=310+slot*44.45
  id=f'IB-L{rack+1:02}-R{rail+1}';pos=add(id,'qm9700' if rack<4 else 'qm9700_spare',[x,1789,z],group='network',role='IB leaf',spare=rack>=4)
  leaf[(rack,rail)]=(id,pos)
for s in range(9):
 j=s%2;slot=s//2;x=[-900,900][j];z=1100+slot*44.45
 id=f'IB-S{s+1:02}';pos=add(id,'qm9700',[x,1789,z],group='network',role='IB spine');spine[s]=(id,pos)
# 4 compute Ethernet leaves, 2 aggregation spines, 2 storage/service leaves.
for i in range(8):
 j=i%2;slot=i//2;x=[-900,900][j];z=1410+slot*105
 id=['ETH-COMPUTE-A','ETH-COMPUTE-B','ETH-COMPUTE-SPARE-A','ETH-COMPUTE-SPARE-B','ETH-SPINE-A','ETH-SPINE-B','ETH-STORAGE-A','ETH-STORAGE-B'][i]
 pos=add(id,'sn5600_spare' if i in [2,3] else 'sn5600',[x,1789,z],group='network',role='Ethernet switch',spare=i in [2,3]);eth[i]=(id,pos)
for j,x in enumerate([-900,900]):
 for k,t in enumerate(['service_oob','ufm']):
  id=f'{"OOB-SERVICE" if k==0 else "UFM"}-{j+1}';pos=add(id,t,[x,1789,1890+k*65],group='network',role=t);service[(j,k)]=(id,pos)

# A route records logical links, independently of the line density chosen for drawing.
def route(id,fabric,src,dst,points,links=1,gbps=None,detail='bundle',reserved=False,**kw):
 q=dict(id=id,fabric=fabric,source=src,destination=dst,points=points,links=links,gbps=gbps,detail=detail,reserved=reserved,**kw);routes.append(q)
 return q

def port(pos,num,total=32):return [pos[0]+(num%16-7.5)*24,pos[1]-.8,pos[2]+(num//16-.5)*20]
def overhead(a,b,channel=0,z=2650):
 # Front-of-tray to rack-side vertical manager, overhead, then network-rack front.
 sx=round(a[0]/600)*600
 return [a,[a[0],a[1]-70,a[2]],[sx+channel*7,a[1]-125,a[2]],[sx+channel*7,a[1]-125,z],[b[0],b[1]-125,z],[b[0],b[1]-125,b[2]],[b[0],b[1]-35,b[2]],b]

compute=sorted([p for p in P if p['template']=='compute_shell'],key=lambda p:int(p['unit'].split('_')[1]));switches=[p for p in P if p['template']=='switch_shell'];powers=[p for p in P if p['template']=='power'];tors=[p for p in P if p['template']=='management']
# Actual endpoint connections (288 IB and 288 BF3 network ports installed).
for r in range(4):
 cx=(r-1.5)*600
 for ni,p in enumerate(compute):
  z=p['position'][2];node=f'R{r+1:02}/C{ni+1:02}'
  for rail,dx in enumerate([-169,-121,121,169]):
   lid,lp=leaf[r,rail];a=[cx+dx,-413,z-11];b=port(lp,ni)
   route(f'IB-R{r+1}-C{ni+1}-P{rail+1}','ib',node+f'/CX7-{rail+1}',lid+f'/NDR-{ni+1}',overhead(a,b,rail,2630+rail*16),gbps=400,detail='individual')
  for n,(dx,fab) in enumerate([(-151,'storage'),(-118,'inband'),(139,'storage'),(172,'inband')]):
   side=n//2;eid,ep=eth[side];a=[cx+dx,-413,z+11];b=port(ep,(r*18+ni)//4)
   route(f'ETH-R{r+1}-C{ni+1}-P{n+1}',fab,node+f'/BF3-{side+1}/{fab}',eid+f'/breakout-{r*36+ni*2+n%2+1}',overhead(a,b,7+n,2720+n*14),gbps=200,detail='individual')
 # NVLink graph: each of 72 GPUs has one link to every one of 18 NVSwitch ASICs.
 # Draw one bundle of 8 links per compute tray / switch tray pair; record each logical link separately.
 for ni,p in enumerate(compute):
  for si,s in enumerate(switches):
   zz=p['position'][2];sz=s['position'][2]
   a=[cx,353,zz];b=[cx,353,sz];x=cx-155+(ni%4)*102
   route(f'NVL-R{r+1}-C{ni+1}-S{si+1}','nvl_fabric',f'R{r+1:02}/C{ni+1:02}/GPU[1:4]',f'R{r+1:02}/NVSwitchTray{si+1}/ASIC[1:2]',[a,[x,384,zz],[x,476+si*3,zz],[x,476+si*3,sz],[x,384,sz],b],links=8,gbps=None,detail='individual',meaning='4 GPUs x 2 ASICs; eight logical NVLink links; not eight physical cables')
   for gpu in range(4):
    for asic in range(2):inventory.append({'id':f'NVL-R{r+1}-C{ni+1}-G{gpu+1}-S{si+1}-A{asic+1}','fabric':'nvl_fabric','source':f'R{r+1:02}/C{ni+1:02}/GPU{gpu+1}','destination':f'R{r+1:02}/NVSwitchTray{si+1}/ASIC{asic+1}','links':1,'gbps':'','reserved':False})
 # Schematic NVLink cartridge harnesses: 4 physical cartridge locations and all 27 mating planes.
 for c,xoff in enumerate([-146,-60,60,146]):
  zlo=min(p['position'][2] for p in compute);zhi=max(p['position'][2] for p in compute)
  route(f'NVL-harness-R{r+1}-{c}','nvl_fabric',f'R{r+1}/cartridge{c+1}',f'R{r+1}/27 mating planes',[[cx+xoff,495,zlo],[cx+xoff,495,zhi]],links=0,detail='bundle',meaning='Cartridge envelope; not one cable')
  for p in compute+switches:
   z=p['position'][2];route(f'NVL-mate-R{r+1}-{c}-{p["name"]}','nvl_fabric',f'R{r+1}/{p["name"]}',f'R{r+1}/cartridge{c+1}',[[cx+xoff,355,z],[cx+xoff,495,z]],links=0,detail='bundle')
 # Rack OOB: 3 endpoints per compute tray, 3 per NVLink tray, 1 per shelf = 89.
 endpoints=[]
 for ni,p in enumerate(compute):
  for ep,dx in [('BMC',66),('BF3-1-BMC',-188),('BF3-2-BMC',102)]:endpoints.append((f'R{r+1}/C{ni+1}/{ep}',[cx+dx,-413,p['position'][2]+7]))
 for si,p in enumerate(switches):
  for ep,dx in [('COMe-1',-169),('COMe-2',-149),('BMC',-129)]:endpoints.append((f'R{r+1}/S{si+1}/{ep}',[cx+dx,-413,p['position'][2]-4]))
 for pi,p in enumerate(powers):endpoints.append((f'R{r+1}/P{pi+1}/BMC',[cx-230,-413,p['position'][2]]))
 for i,(src,a) in enumerate(endpoints):
  tor=i%2;dest=f'R{r+1}/OOB-{tor+1}';b=[cx-214+(i//2%24)*16,-413,tors[tor]['position'][2]+(-8 if i//2<24 else 8)];x=cx+(-265 if tor==0 else 265)
  route(f'OOB-R{r+1}-E{i+1}','oob',src,dest+f'/RJ45-{i//2+1}',[a,[a[0],-490,a[2]],[x,-515,a[2]],[x,-515,b[2]],[b[0],-490,b[2]],b],gbps=1,detail='individual')
 for tor in range(2):
  a=[cx+208,-413,tors[tor]['position'][2]]
  for side in range(2):
   eid,ep=eth[4+side];b=port(ep,52+r*2+tor)
   route(f'OOB-UP-R{r+1}-{tor}-{side}','oob',f'R{r+1}/OOB-{tor+1}/QSFP-{side+1}',eid+f'/100G-breakout-{r*2+tor+1}',overhead(a,b,15+tor,2820+side*18),gbps=100)
 # Readable bundles replace individual host cables at the presentation level.
 for rail in range(4):
  lid,lp=leaf[r,rail];a=[cx+[-169,-121,121,169][rail],-413,1260];b=port(lp,8)
  route(f'IB-BUNDLE-R{r+1}-rail{rail+1}','ib',f'R{r+1}/18 CX7 ports rail{rail+1}',lid,overhead(a,b,rail,2630+rail*16),links=18,gbps=400,detail='summary')
 for side in range(2):
  eid,ep=eth[side]
  for fab,extra in [('storage',0),('inband',1)]:
   a=[cx+(-160 if side==0 else 160),-413,1400+extra*70];b=port(ep,10+r*2+extra)
   route(f'ETH-BUNDLE-R{r+1}-{side}-{fab}',fab,f'R{r+1}/18 BF3 {fab} ports',eid,overhead(a,b,7+side*2+extra,2720+(side*2+extra)*14),links=18,gbps=200,detail='summary')
 for tor in range(2):
  x=cx+(-265 if tor==0 else 265);a=[x,-515,495];b=[x,-515,tors[tor]['position'][2]]
  route(f'OOB-HARNESS-R{r+1}-{tor}','oob',f'R{r+1}/rack management endpoints',f'R{r+1}/OOB-{tor+1}',[a,b,[cx,-413,b[2]]],links=45 if tor==0 else 44,gbps=1,detail='summary')

# Full single-SU InfiniBand: 32 leaves x 9 shared spines x 2 NDR400 links.
for (r,rail),(lid,lp) in leaf.items():
 for s,(sid,sp) in spine.items():
  a=port(lp,18+s*2);b=port(sp,(r*4+rail)*2)
  y=1655-(rail*9+s)*2
  route(f'IB-L{r+1}-{rail+1}-S{s+1}','ib',lid+f'/NDR-{19+s*2}:{20+s*2}',sid+f'/NDR-{(r*4+rail)*2+1}:{(r*4+rail)*2+2}',[a,[a[0],y,a[2]],[a[0],y,2320+rail*12],[b[0],y,2320+rail*12],[b[0],y,b[2]],b],links=2,gbps=400,reserved=r>=4,detail='individual')
# Visual representation of network switching stages, each line annotated by inventory totals.
for j in range(2):
 for k in range(5 if j==0 else 4):
  s=j+2*k;sp=spine[s][1];a=[[-900,900][j],1640,650];b=port(sp,10)
  route(f'IB-stage-{s}','ib','32 leaf tier',spine[s][0],[a,[a[0],1590,2300],[b[0],1590,2300],b],links=64,gbps=400,detail='summary')
# Ethernet leaf-spine links: 6x800 per compute leaf/spine and 4x800 per service leaf/spine.
for i in [0,1,2,3,6,7]:
 for side in range(2):
  eid,ep=eth[i];sid,sp=eth[4+side];a=port(ep,40+side*6);b=port(sp,i*6)
  links=6 if i<4 else 4
  route(f'ETH-UP-{i}-{side}','ethernet',eid,sid,[a,[a[0],1530-i*4,a[2]],[a[0],1530-i*4,2420+side*30],[b[0],1530-i*4,2420+side*30],[b[0],1530-i*4,b[2]],b],links=links,gbps=800,reserved=i in [2,3])
# Service-plane connections and external boundaries (no invented storage appliance design).
for j in range(2):
 oid,op=service[j,0];uid,up=service[j,1]
 for side in range(2):
  sid,sp=eth[4+side];a=port(op,side);b=port(sp,48+j)
  route(f'OOB-SERVICE-{j}-UP-{side}','oob',oid,sid,[a,[a[0],1500,a[2]],[b[0],1500,b[2]],b],gbps=100)
 route(f'UFM-{j}-mgmt','oob',uid,oid,[port(up,0),port(op,0)],gbps=1)
 for rail in [0,1]:
  lid,lp=leaf[0,rail];route(f'UFM-{j}-IB-{rail}','ib',uid,lid,[port(up,rail),[up[0],1500,up[2]],[lp[0],1500,lp[2]],port(lp,38+j)],gbps=None,meaning='UFM fabric attachment; adapter speed implementation dependent')
 # All external network switch management endpoints allocated without exceeding RJ45 capacity.
 devices=[v for key,v in leaf.items() if key[0]*4+key[1] in range(j*16,(j+1)*16)]+[v for k,v in spine.items() if k%2==j]+[v for k,v in eth.items() if k%2==j]
 for di,(did,dp) in enumerate(devices):
  route(f'SERVICE-BMC-{j}-{di}','oob',did+'/MGMT',oid+f'/RJ45-{di+2}',[[dp[0]+210,dp[1],dp[2]],[dp[0]+263,1540,dp[2]],[op[0]+263,1540,op[2]],port(op,di+2)],gbps=1,detail='individual')
 eid,ep=eth[6+j]
 for dest,xx,zz,links,speed in [('High-performance storage',-1620,1400,8,800),('Control plane / NFS',-1620,1800,1,None)]:
  a=port(ep,12);b=[xx,2300+j*180,zz]
  route(f'BOUNDARY-{j}-{dest}','storage' if links==8 else 'inband',eid,dest,[a,[a[0],1480,a[2]],[xx,1480,a[2]],b],links=links,gbps=speed,meaning='External system boundary; appliance topology not specified')
 sid,sp=eth[4+j];route(f'CUSTOMER-EDGE-{j}','inband',sid,'Customer edge / BMS routed boundary',[port(sp,62),[sp[0],1550,2950],[sp[0],2300,2950]],gbps=100)

for q in routes:
 if q['detail'] in ['summary'] or (q['fabric']=='nvl_fabric'):continue
 inventory.append({k:q.get(k,'') for k in ['id','fabric','source','destination','links','gbps','reserved']})
with (ROOT/'assets/network-connections.csv').open('w') as f:
 writer=csv.DictWriter(f,fieldnames=['id','fabric','source','destination','links','gbps','reserved']);writer.writeheader();writer.writerows(inventory)
# Explicit audit catches topology-count mistakes rather than implementation-only assertions.
audit={'nvlink_logical_links':len([q for q in inventory if q['fabric']=='nvl_fabric']),'compute_host_ports':sum(q['links'] for q in routes if q['id'].startswith('IB-R')),'bf3_host_ports':sum(q['links'] for q in routes if q['id'].startswith('ETH-R')),'rack_oob_endpoints':sum(q['links'] for q in routes if q['id'].startswith('OOB-R')),'ib_leaf_spine_links':sum(q['links'] for q in routes if q['id'].startswith('IB-L')),'ib_leaves':len(leaf),'ib_spines':len(spine),'sn5600_switches':len(eth)}
assert audit=={'nvlink_logical_links':5184,'compute_host_ports':288,'bf3_host_ports':288,'rack_oob_endpoints':356,'ib_leaf_spine_links':576,'ib_leaves':32,'ib_spines':9,'sn5600_switches':8},audit
out=dict(version='0.2',units='mm',templates=T,parts=N,routes=routes,colors=colors,audit=audit)
(ROOT/'assets/network-model.json').write_text(json.dumps(out,separators=(',',':')))
(ROOT/'assets/network-data.js').write_text('export default '+json.dumps(out,separators=(',',':'))+';')
(ROOT/'assets/network-audit.json').write_text(json.dumps(audit,indent=2))
print(json.dumps(audit,indent=2));print('parts',len(N),'routes',len(routes),'inventory rows',len(inventory))
