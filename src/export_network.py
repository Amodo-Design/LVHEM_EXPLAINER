"""Blender exporter for the network variant. Source geometry + bundled routes."""
import bpy,json,math,pathlib,struct,time
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=pathlib.Path(__file__).resolve().parents[1]
D=json.loads((ROOT/'assets/network-model.json').read_text());T=D['templates'];P=D['parts'];R=D['routes']
PALETTE={'frame':'#9caaa5','panels':'#9caaa5','compute':'#9caaa5','nvlink':'#9caaa5','cooling':'#9caaa5','power':'#9caaa5','management':'#9caaa5','lids':'#9caaa5',**D['colors']}
# Reuse tested binary writer without re-running the earlier rack export workflow.
source=(ROOT/'src/export_assets.py').read_text();fn=source.split('def glb(')[1].split('\nfor count,name')[0];exec('def glb('+fn)
# Keep cable categories independently selectable by node name in exported glTF.
for q in R:
 if q['detail']=='individual' or q['reserved']:continue
 name='cable/'+q['id'];ls=[]
 for a,b in zip(q['points'],q['points'][1:]):ls.extend([a,b])
 T[name]={'category':q['fabric'],'lines':ls,'v':[],'f':[]};P.append({'name':name,'template':name,'position':[0,0,0]})
glb(1,True,ROOT/'exports/3d/gb200-network-wireframe.glb')
# Native master: grouped hardware and separate real curve paths.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
mats={}
for k,h in PALETTE.items():
 m=bpy.data.materials.new(k);m.diffuse_color=tuple(int(h[i:i+2],16)/255 for i in [1,3,5])+(1,);mats[k]=m
colls={}
for name in ['Compute racks','Network racks','NVLink','InfiniBand','Storage Ethernet','In-band','Out-of-band','Shared Ethernet','Spare capacity']:
 c=bpy.data.collections.new(name);bpy.context.scene.collection.children.link(c);colls[name]=c
mt={}
for name,t in T.items():
 if not t['v']:continue
 m=bpy.data.meshes.new(name);m.from_pydata([[v/1000 for v in p] for p in t['v']],[],t['f']);m.materials.append(mats[t['category']]);mt[name]=m
for p in P:
 if p['template'] not in mt or p.get('optional'):continue
 obj=bpy.data.objects.new(p['name'],mt[p['template']]);colls['Network racks' if p.get('group')=='network' else 'Compute racks'].objects.link(obj);obj.location=Vector(p['position'])/1000;obj['source']='TECHNICAL_BASIS.md'
mapcat={'nvl_fabric':'NVLink','ib':'InfiniBand','storage':'Storage Ethernet','inband':'In-band','oob':'Out-of-band','ethernet':'Shared Ethernet'}
for q in R:
 if q['detail']=='individual':continue
 cu=bpy.data.curves.new(q['id'],'CURVE');cu.dimensions='3D';cu.resolution_u=1;cu.bevel_depth=.0015;cu.bevel_resolution=0;sp=cu.splines.new('POLY');sp.points.add(len(q['points'])-1)
 for pt,v in zip(sp.points,q['points']):pt.co=tuple(x/1000 for x in v)+(1,)
 cu.materials.append(mats[q['fabric']]);ob=bpy.data.objects.new(q['id'],cu);colls['Spare capacity' if q['reserved'] else mapcat[q['fabric']]].objects.link(ob);ob['logical_link_count']=q['links'];ob['link_speed_Gbps']=q['gbps'] or 0;ob['source_endpoint']=q['source'];ob['destination_endpoint']=q['destination'];ob['illustration']='Schematic route; not installation routing'
 if q['reserved']:ob.hide_set(True);ob.hide_render=True
scene=bpy.context.scene;scene.unit_settings.system='METRIC';scene.unit_settings.length_unit='MILLIMETERS';bpy.ops.object.camera_add(location=(5,-8,6));cam=bpy.context.object;cam.rotation_euler=(Vector((0,1,1.4))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=6.1;scene.camera=cam;scene.render.engine='BLENDER_WORKBENCH';scene.display.shading.color_type='MATERIAL';scene.display.shading.show_shadows=False;scene.display.shading.show_cavity=True;scene.render.film_transparent=True;scene.render.resolution_x=2800;scene.render.resolution_y=2200;scene.render.resolution_percentage=100
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'exports/3d/gb200-network-master.blend'))
print('3D exports saved',flush=True)

# Transparent line-art projection. Hardware edges are ray-tested, cables are explanatory overlays.
def draw(name,fabrics=None,intra=False,clean=False):
 vs=[];fs=[];ls=[]
 for p in P:
  if p.get('optional') or p['name'].startswith('cable/'):continue
  if intra and p.get('group')=='network':continue
  t=T[p['template']];pos=Vector(p['position']);off=len(vs);vs += [Vector(v)+pos for v in t['v']];fs +=[[off+i for i in f] for f in t['f']]
  for i in range(0,len(t['lines']),2):ls.append((Vector(t['lines'][i])+pos,Vector(t['lines'][i+1])+pos))
 bvh=BVHTree.FromPolygons(vs,fs,epsilon=.0001)
 az,el=(145,18) if intra else (24,28);a,e=math.radians(az),math.radians(el);d=Vector((math.sin(a)*math.cos(e),-math.cos(a)*math.cos(e),math.sin(e)));right=Vector((math.cos(a),math.sin(a),0));up=d.cross(right)
 def pr(v):return(v.dot(right),-v.dot(up))
 shown=[q for q in R if q['detail']!='individual' and not q['reserved'] and (fabrics is None or q['fabric'] in fabrics)]
 ext=[pr(v) for v in vs]+[pr(Vector(p)) for q in shown for p in q['points']];xmin,xmax=min(p[0] for p in ext),max(p[0] for p in ext);ymin,ymax=min(p[1] for p in ext),max(p[1] for p in ext)
 W=2400;scale=2140/(xmax-xmin);top=180 if not clean else 55;H=(ymax-ymin)*scale+top+(180 if not clean else 55)
 def xy(v):x,y=pr(v);return((x-xmin)*scale+130,(y-ymin)*scale+top)
 paths=[]
 for a,b in ls:
  n=max(1,math.ceil((a-b).length/10));start=None
  for i in range(n+1):
   ok=i<n and bvh.ray_cast(a.lerp(b,(i+.5)/n)+d*.09,d,10000)[0] is None
   if ok and start is None:start=i
   if not ok and start is not None:
    p1,p2=xy(a.lerp(b,start/n)),xy(a.lerp(b,i/n));start=None;paths.append(f'M{p1[0]:.1f},{p1[1]:.1f}L{p2[0]:.1f},{p2[1]:.1f}')
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="{H:.0f}" viewBox="0 0 2400 {H:.2f}"><title>GB200 NVL72 network fabric illustration</title><desc>Schematic cable routes. Four installed compute racks and full single-SU fabric capacity. See TECHNICAL_BASIS.md.</desc>'
 svg+='<g fill="none" stroke="#a6b4ae" stroke-width=".65" stroke-linecap="round"><path d="'+''.join(paths)+'"/></g>'
 for q in sorted(shown,key=lambda q:q['fabric']):
  pts=[xy(Vector(p)) for p in q['points']];path='M'+'L'.join(f'{p[0]:.2f},{p[1]:.2f}' for p in pts)
  sw=1.35 if q['fabric']=='nvl_fabric' else 2.0
  svg+=f'<path fill="none" stroke="{D["colors"][q["fabric"]]}" stroke-width="{sw}" stroke-opacity=".84" stroke-linejoin="round" stroke-linecap="round" d="{path}"/>'
 if not clean:
  title={'network-overview':'The complete network fabric','network-compute':'InfiniBand connects the racks','network-intra':'Four independent NVLink domains','network-ethernet':'Storage and management fabrics'}[name]
  svg+=f'<g fill="#294846" font-family="Arial,Helvetica,sans-serif"><text x="90" y="49" font-family="monospace" font-size="16" letter-spacing="3">AI VERIFICATION / GB200 NVL72</text><text x="90" y="111" font-family="Georgia,serif" font-size="47">{title}</text>'
  if intra:
   svg+=f'<text x="90" y="{H-100:.0f}" font-size="23">72 GPUs → 18 NVSwitch ASICs per rack · 1,296 logical NVLink connections per rack</text><text x="90" y="{H-61:.0f}" font-size="17">Rear cartridge harnesses shown schematically. NVLink does not cross between these racks.</text>'
  else:
   for x,label in [(-900,'NETWORK A'),(900,'NETWORK B')]:
    px,py=xy(Vector((x,2200,2310)));svg+=f'<text x="{px:.1f}" y="{py:.1f}" font-size="18" text-anchor="middle">{label}</text>'
   for r in range(4):
    px,py=xy(Vector(((r-1.5)*600,-660,0)));svg+=f'<text x="{px:.1f}" y="{py+35:.1f}" font-size="18" text-anchor="middle">R0{r+1} · 72 GPUs</text>'
   specs=[('NVLink','#ce6056'),('400G InfiniBand','#be7941'),('Storage / shared Ethernet','#208d8c'),('In-band','#568bba'),('OOB','#8b71a9')]
   xx=90
   for txt,col in specs:
    svg+=f'<path stroke="{col}" stroke-width="4" d="M{xx},{H-101:.0f}h30"/><text x="{xx+42}" y="{H-95:.0f}" font-size="19">{txt}</text>';xx += [230,340,480,240,170][specs.index((txt,col))]
   svg+=f'<text x="90" y="{H-44:.0f}" font-size="17">4 installed compute racks · 8-rack fabric capacity · labeled bundles represent multiple links · cable routes are illustrative</text>'
  svg+='</g>'
 svg+='</svg>';(ROOT/'exports/svg'/f'{name}{"-asset" if clean else ""}.svg').write_text(svg);print(name,clean,'saved',flush=True)
draw('network-overview');draw('network-overview',clean=True);draw('network-compute',{'ib'});draw('network-intra',{'nvl_fabric'},intra=True);draw('network-ethernet',{'storage','inband','ethernet','oob'})
