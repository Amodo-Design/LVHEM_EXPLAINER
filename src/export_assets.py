"""Run with blender --background --python src/export_assets.py.
Build editable Blender master and glTF, and ray-test linework to generate true
transparent, hidden-line-removed SVG exports from the same 3D geometry.
"""
import bpy, json,math,pathlib,struct,time
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=pathlib.Path(__file__).resolve().parents[1]
D=json.loads((ROOT/'assets/model.json').read_text());T=D['templates'];P=D['parts']
PALETTE={'frame':'#608083','panels':'#608083','compute':'#3978a5','nvlink':'#cc6556','cooling':'#2b9b95','power':'#b89147','management':'#706da0','lids':'#6a8c91'}

def glb(count,wire,path):
 binary=bytearray(); views=[];access=[];meshes=[];nodes=[]; rootnodes=[]
 def buf(values,fmt,typ,ncomp):
  while len(binary)%4:binary.append(0)
  start=len(binary)
  flat=[x for row in values for x in row] if ncomp>1 else values
  binary.extend(struct.pack('<'+fmt*len(flat),*flat))
  vi=len(views);views.append({'buffer':0,'byteOffset':start,'byteLength':len(binary)-start})
  ac={'bufferView':vi,'componentType':5126 if fmt=='f' else 5125,'count':len(values),'type':typ}
  if fmt=='f' and ncomp==3:
   ac['min']=[min(v[i] for v in values) for i in range(3)];ac['max']=[max(v[i] for v in values) for i in range(3)]
  access.append(ac);return len(access)-1
 mats=[]
 for cat,h in PALETTE.items():
  col=[int(h[i:i+2],16)/255 for i in [1,3,5]]
  mats.append({'name':cat,'pbrMetallicRoughness':{'baseColorFactor':col+[1],'metallicFactor':0,'roughnessFactor':.8},'extensions':{'KHR_materials_unlit':{}},'doubleSided':True})
 for name,t in T.items():
  # glTF is Y-up: x,y,z source -> x,z,-y.
  vs=[[v[0]/1000,v[2]/1000,-v[1]/1000] for v in (t['lines'] if wire else t['v'])]
  if not vs:meshes.append({'name':name,'primitives':[]});continue
  pos=buf(vs,'f','VEC3',3);prim={'attributes':{'POSITION':pos},'mode':1 if wire else 4,'material':list(PALETTE).index(t['category'])}
  if not wire:
   idx=[]
   for f in t['f']:
    for j in range(1,len(f)-1):idx+= [f[0],f[j],f[j+1]]
   prim['indices']=buf(idx,'I','SCALAR',1)
  meshes.append({'name':name,'primitives':[prim]})
 for r in range(count):
  root=len(nodes);rootnodes.append(root);nodes.append({'name':f'GB200_NVL72_R{r+1:02}','translation':[(r-(count-1)/2)*.6,0,0],'children':[],'extras':{'GPUs':72,'CPUs':36,'NVLinkDomain':r+1}})
  for p in P:
   cat=T[p['template']]['category']
   if p.get('optional'):continue
   if wire and cat=='lids':continue
   idx=len(nodes);nodes[root]['children'].append(idx)
   x,y,z=p['position']; nodes.append({'name':p['name'],'mesh':list(T).index(p['template']),'translation':[x/1000,z/1000,-y/1000],'extras':{'category':cat,'unit':p.get('unit','')}})
 doc={'asset':{'version':'2.0','generator':'AI Verification GB200 asset system v0.1','copyright':'Original illustration geometry; NVIDIA/OCP references in TECHNICAL_BASIS.md'},'scene':0,'scenes':[{'nodes':rootnodes}],'nodes':nodes,'meshes':meshes,'materials':mats,'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':access,'extensionsUsed':['KHR_materials_unlit']}
 js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4);binary+=b'\0'*((-len(binary))%4)
 out=struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary
 path.write_bytes(out)

for count,name in [(4,'pod'),(1,'rack')]:
 for wire in [False,True]:
  glb(count,wire,ROOT/'exports/3d'/f'gb200-{name}-{"wireframe" if wire else "solid"}.glb')
print('GLB exports complete',flush=True)

# Build shared Blender mesh datablocks; each logical component remains editable.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
materials={}
for k,h in PALETTE.items():
 m=bpy.data.materials.new(k);m.diffuse_color=tuple(int(h[i:i+2],16)/255 for i in [1,3,5])+(1,);materials[k]=m
meshes={}
for name,t in T.items():
 mesh=bpy.data.meshes.new(name);mesh.from_pydata([[c/1000 for c in v] for v in t['v']],[],t['f']);mesh.update();mesh.materials.append(materials[t['category']]);meshes[name]=mesh
for r in range(4):
 coll=bpy.data.collections.new(f'Rack {r+1:02} | 72 GPUs');bpy.context.scene.collection.children.link(coll)
 for p in P:
  obj=bpy.data.objects.new(p['name'],meshes[p['template']]);coll.objects.link(obj);obj.location=Vector(p['position'])/1000+Vector(((r-1.5)*.6,0,0));obj['category']=T[p['template']]['category'];obj['unit']=p.get('unit','');obj['source']='See TECHNICAL_BASIS.md'
  if p.get('optional'):obj.hide_set(True);obj.hide_render=True
scene=bpy.context.scene;scene.unit_settings.system='METRIC';scene.unit_settings.length_unit='MILLIMETERS'
scene.world.color=(.8,.8,.8)
bpy.ops.object.camera_add(location=(4,-7,4));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=4.1;scene.camera=cam
scene.render.engine='BLENDER_WORKBENCH';scene.display.shading.light='STUDIO';scene.display.shading.color_type='MATERIAL';scene.display.shading.show_shadows=False;scene.display.shading.show_cavity=True
scene.render.resolution_x=2400;scene.render.resolution_y=1800;scene.render.resolution_percentage=100;scene.render.film_transparent=True
for area in bpy.context.screen.areas:
 if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'exports/3d/gb200-pod-master.blend'))
print('BLEND master saved',flush=True)

# Ray-test all line segments against the solids; hidden surfaces do not need white fills.
def export_view(name,count=4,az=25,el=16,cutaway=False,pull=False,ortho=False):
 t0=time.time(); verts=[];faces=[];lines=[]
 for r in range(count):
  for p in P:
   t=T[p['template']];cat=t['category']
   if p.get('optional') or (cutaway and cat=='lids'):continue
   pos=Vector(p['position'])+Vector(((r-(count-1)/2)*600,0,0))
   if pull and p.get('unit')=='compute_18':pos.y-=500
   off=len(verts);verts.extend([Vector(v)+pos for v in t['v']]);faces.extend([[off+i for i in f] for f in t['f']])
   lv=t['lines']
   for i in range(0,len(lv),2):lines.append((Vector(lv[i])+pos,Vector(lv[i+1])+pos,cat))
 bvh=BVHTree.FromPolygons(verts,faces,all_triangles=False,epsilon=.0001)
 a,e=math.radians(az),math.radians(el)
 d=Vector((math.sin(a)*math.cos(e),-math.cos(a)*math.cos(e),math.sin(e)))
 right=Vector((math.cos(a),math.sin(a),0));up=d.cross(right)
 def proj(v):return (v.dot(right),-v.dot(up))
 ext=[proj(v) for v in verts];lo=[min(v[i] for v in ext) for i in range(2)];hi=[max(v[i] for v in ext) for i in range(2)]
 w,h=hi[0]-lo[0],hi[1]-lo[1];margin=40;scale=1800/(w+margin*2)
 def xy(v):
  x,y=proj(v);return ((x-lo[0]+margin)*scale,(y-lo[1]+margin)*scale)
 def visible(v):return bvh.ray_cast(v+d*.08,d,6000)[0] is None
 result=[]
 for v1,v2,cat in lines:
  n=max(1,math.ceil((v2-v1).length/7));flags=[visible(v1.lerp(v2,(i+.5)/n)) for i in range(n)]
  start=None
  for i,ok in enumerate(flags+[False]):
   if ok and start is None:start=i
   if not ok and start is not None:
    p1=v1.lerp(v2,start/n);p2=v1.lerp(v2,i/n);start=None
    if (p1-p2).length<.1:continue
    aa,bb=xy(p1),xy(p2);result.append((cat,aa,bb))
 height=(h+margin*2)*scale
 for style in ['teal','technical','white']:
  grouped={}
  for cat,p1,p2 in result:
   col='#147f83' if style=='teal' else ('#d9efee' if style=='white' else PALETTE[cat])
   width=.82 if cat=='frame' else .64
   grouped.setdefault((col,width),[]).append(f'M{p1[0]:.2f},{p1[1]:.2f}L{p2[0]:.2f},{p2[1]:.2f}')
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="{height:.0f}" viewBox="0 0 1800 {height:.2f}"><title>GB200 NVL72 {count}-rack {name}</title><desc>Hidden-line illustration from the shared 3D model. See TECHNICAL_BASIS.md.</desc>'
  for (col,sw),paths in grouped.items():svg+=f'<path fill="none" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" d="'+''.join(paths)+'"/>'
  svg+='</svg>'
  (ROOT/'exports/svg'/f'{name}-{style}.svg').write_text(svg)
 print(name,'visible segments',len(result),'seconds',round(time.time()-t0,1),flush=True)

export_view('pod-hero',az=24,el=14)
export_view('pod-front',az=0,el=0)
export_view('pod-rear',az=155,el=16,cutaway=False)
export_view('rack-service',count=1,az=33,el=25,cutaway=True,pull=True)
print('All exports complete',flush=True)
