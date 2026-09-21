import * as THREE from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import data from '../assets/model-data.js';
import cables from '../assets/fleet-cables.js';
import {layoutRacks,routeField} from './fleet_layout.js';
import {buildCableBundles} from './fleet_bundles.js';
const $=id=>document.getElementById(id),stage=$('stage'),MAX=1024;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.04,1000);camera.up.set(0,0,1);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xf7f5ee,1);stage.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=.85;controls.maxDistance=400;controls.zoomToCursor=true;controls.screenSpacePanning=true;controls.maxPolarAngle=Math.PI*.94;
const materials=[],meshBatches=[],lineBatches=[],matrix=new THREE.Matrix4(),V=THREE.Vector3;
let positions=[],selected=15,fieldDistance=45,transition=null,dirty=true,lastLOD=0,settingsDirty=true;
const status={high:0,medium:0,far:0};let layout,routeAudit,bundles;scene.add(new THREE.HemisphereLight(0xffffff,0x526966,2.1));const keyLight=new THREE.DirectionalLight(0xffffff,2);keyLight.position.set(-10,-20,40);scene.add(keyLight);
function accumulator(){return{vertices:[],indices:[],lines:[]};}
function addTemplate(dst,t,pos){const off=dst.vertices.length/3;for(const v of t.v)dst.vertices.push((v[0]+pos[0])/1000,(v[1]+pos[1])/1000,(v[2]+pos[2])/1000);for(const f of t.f)for(let i=1;i<f.length-1;i++)dst.indices.push(off+f[0],off+f[i],off+f[i+1]);for(const p of t.lines)dst.lines.push((p[0]+pos[0])/1000,(p[1]+pos[1])/1000,(p[2]+pos[2])/1000);}
function addBox(dst,c,s){const [x,y,z]=c,[w,d,h]=s.map(v=>v/2),v=[[x-w,y-d,z-h],[x+w,y-d,z-h],[x+w,y+d,z-h],[x-w,y+d,z-h],[x-w,y-d,z+h],[x+w,y-d,z+h],[x+w,y+d,z+h],[x-w,y+d,z+h]],f=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]],l=[];for(const[a,b]of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])l.push(v[a],v[b]);addTemplate(dst,{v,f,lines:l},[0,0,0]);}
const levels={far:accumulator(),medium:accumulator(),high:accumulator()};
// Large-scale silhouette is deliberately sparse; the closer levels use the real source model.
addBox(levels.far,[0,0,1118],[600,1200,2236]);
for(const z of [480,875,1280,1740,1985])levels.far.lines.push(-.27,-.6005,z/1000,.27,-.6005,z/1000);
for(const p of data.parts){if(p.optional)continue;const t=data.templates[p.template];addTemplate(levels.high,t,p.position);if(['frame','blank','manifold','busbar','rear_brace'].includes(p.template)){
 if(p.template==='frame'){
  for(const x of [-286,286])for(const y of [-586,586])addBox(levels.medium,[x,y,1118],[28,28,2236]);
  for(const z of [25,2211])addBox(levels.medium,[0,0,z],[600,1200,50]);
 }else if(p.template==='blank')addBox(levels.medium,[0,-413,p.position[2]],[480,4,43]);
 else if(p.template==='busbar')addBox(levels.medium,[0,409,1118],[35,52,2100]);
 }else if(['compute_shell','switch_shell','power','management'].includes(p.template)){addBox(levels.medium,[0,p.template==='power'?-142:p.template==='management'?-210:-27.8,p.position[2]],[438,p.template==='power'?538:p.template==='management'?402:766,43]);}}
function makeLineBatch(vertices,color,opacity=1,cap=MAX){
 const g=new THREE.InstancedBufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('instanceOffset',new THREE.InstancedBufferAttribute(new Float32Array(cap*3),3));g.instanceCount=0;
 const m=new THREE.ShaderMaterial({uniforms:{lineColor:{value:new THREE.Color(color)},alpha:{value:opacity}},vertexShader:'attribute vec3 instanceOffset; void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+instanceOffset,1.0);}',fragmentShader:'uniform vec3 lineColor;uniform float alpha;void main(){gl_FragColor=vec4(lineColor,alpha);}',transparent:true,depthWrite:false,depthTest:true});
 const o=new THREE.LineSegments(g,m);o.frustumCulled=false;o.renderOrder=2;scene.add(o);const batch={object:o,geometry:g,material:m,cap};lineBatches.push(batch);return batch;
}
function makeHardware(a){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.vertices,3));g.setIndex(a.indices);const m=new THREE.MeshBasicMaterial({color:0xf7f5ee,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});materials.push(m);const o=new THREE.InstancedMesh(g,m,MAX);o.instanceMatrix.setUsage(THREE.DynamicDrawUsage);o.count=0;o.frustumCulled=false;scene.add(o);meshBatches.push(o);return{solid:o,line:makeLineBatch(a.lines,0x147f83,.68)};}
const hardware={};for(const[level,a]of Object.entries(levels))hardware[level]=makeHardware(a);
const cableColors={nvlink:0xcd6254,front:0x288f91,management:0x9175a8},cableBatches={};
for(const layer of Object.keys(cableColors)){cableBatches[layer]={near:makeLineBatch(cables.layers[layer].flat().map(x=>x/1000),cableColors[layer],.9),mid:makeLineBatch(cables.coarse[layer].flat().map(x=>x/1000),cableColors[layer],.5)};}

const exitLines=[];for(const e of cables.exits){const [x,y,z]=e.map(n=>n/1000),side=x<0?-1:1;const curve=new THREE.CubicBezierCurve3(new V(x,y,z),new V(x,y,2.65),new V(side*.12,-.34,2.94),new V(side*.12,0,2.94));const pts=curve.getPoints(12);for(let j=1;j<pts.length;j++)exitLines.push(...pts[j-1].toArray(),...pts[j].toArray());}
const exitBatch=makeLineBatch(exitLines,0x388d8b,.65);
function offsets(batch,ids){const arr=batch.geometry.attributes.instanceOffset.array;ids.forEach((id,i)=>{arr[i*3]=positions[id].x;arr[i*3+1]=positions[id].y;arr[i*3+2]=0;});batch.geometry.instanceCount=ids.length;batch.geometry.attributes.instanceOffset.needsUpdate=true;}
function fillHardware(batch,ids){batch.solid.count=ids.length;ids.forEach((id,i)=>{matrix.makeTranslation(positions[id].x,positions[id].y,0);batch.solid.setMatrixAt(i,matrix);});batch.solid.instanceMatrix.needsUpdate=true;offsets(batch.line,ids);}
const pickGeometry=new THREE.BoxGeometry(.6,1.2,2.236),pickMesh=new THREE.InstancedMesh(pickGeometry,new THREE.MeshBasicMaterial(),MAX);pickMesh.count=0;
const selectGeo=new THREE.BufferGeometry();selectGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.325,-.625,.015,.325,-.625,.015,.325,-.625,.015,.325,.625,.015,.325,.625,.015,-.325,.625,.015,-.325,.625,.015,-.325,-.625,.015],3));const selectionMarker=new THREE.LineSegments(selectGeo,new THREE.LineBasicMaterial({color:0xc8844a,depthTest:false}));selectionMarker.renderOrder=10;scene.add(selectionMarker);
const floorGeo=new THREE.BufferGeometry(),floor=new THREE.LineSegments(floorGeo,new THREE.LineBasicMaterial({color:0xb6c3b5,transparent:true,opacity:.35}));scene.add(floor);
function rebuild(preserveCamera=false){
 const oldSelected=positions[selected]?.clone(),count=+$('count').value;
 layout=layoutRacks(count,+$('width').value,+$('rack-gap').value,+$('row-gap').value);
 positions=layout.positions.map(p=>new V(...p));positions.forEach((p,i)=>{matrix.makeTranslation(p.x,p.y,1.118);pickMesh.setMatrixAt(i,matrix);});pickMesh.count=count;pickMesh.instanceMatrix.needsUpdate=true;pickMesh.computeBoundingSphere();pickMesh.computeBoundingBox();pickMesh.updateMatrixWorld(true);
 selected=Math.min(selected,count-1);setSelected(selected);
 fieldDistance=Math.max(8,Math.hypot(layout.width,layout.depth)*1.2);controls.maxDistance=Math.max(150,fieldDistance*5);camera.far=Math.max(1000,fieldDistance*10);camera.updateProjectionMatrix();
 const fv=[];for(let r=0;r<layout.rows;r++){const y=positions[r*layout.cols].y;for(const yy of[y-.6,y+.6])fv.push(-layout.width/2-.4,yy,-.01,layout.width/2+.4,yy,-.01);}floor.geometry.dispose();floor.geometry=new THREE.BufferGeometry();floor.geometry.setAttribute('position',new THREE.Float32BufferAttribute(fv,3));
 routeAudit=routeField(layout);if(bundles){scene.remove(bundles.group);bundles.dispose();}bundles=buildCableBundles(layout);scene.add(bundles.group);bundles.group.visible=$('connections').checked&&$('fabric').checked;bundles.trayGroup.visible=$('trays').checked;
 $('rack-gap-value').textContent=(+$('rack-gap').value).toFixed(2)+' m';$('row-gap-value').textContent=(+$('row-gap').value).toFixed(2)+' m';
 $('rack-total').textContent=count.toLocaleString()+' racks';$('gpu-total').textContent=(count*72).toLocaleString()+' GPUs · '+layout.rows+' rows · '+routeAudit.connectedRacks.toLocaleString()+' connected';
 transition=null;if(preserveCamera&&oldSelected&&+$('zoom').value>30){const delta=positions[selected].clone().sub(oldSelected);camera.position.add(delta);controls.target.add(delta);controls.update();}else goOverview(false);dirty=true;
}
function setSelected(id){selected=id;selectionMarker.position.copy(positions[id]);$('selection').textContent='Selected: rack '+String(id+1).padStart(3,'0')+' · row '+String(Math.floor(id/layout.cols)+1).padStart(2,'0');}
function aimFor(id,distance,rear=false){const target=positions[id].clone().add(new V(0,0,1.12)),dir=new V(rear?2.9:2.4,rear?5.4:-6.0,rear?2.2:2.7).normalize();return{target,position:target.clone().addScaledVector(dir,distance)};}
function overviewAim(){
 const target=new V(0,0,1.1),dir=new V(.68,-.87,.8).normalize(),right=new V().crossVectors(new V(0,0,1),dir).normalize(),up=new V().crossVectors(dir,right).normalize();
 const tanV=Math.tan(camera.fov*Math.PI/360),tanH=tanV*camera.aspect;let distance=8;
 for(const p of positions)for(const x of[-.3,1.3])for(const y of[-.6,.6])for(const z of[0,3.2]){const q=p.clone().add(new V(x,y,z)).sub(target),along=q.dot(dir);distance=Math.max(distance,along+Math.abs(q.dot(right))/tanH*1.18,along+Math.abs(q.dot(up))/tanV*1.3);}
 return{target,position:target.clone().addScaledVector(dir,distance)};
}
function fly(aim,duration=1200,onEnd){if(matchMedia('(prefers-reduced-motion:reduce)').matches)duration=0;transition={fromP:camera.position.clone(),fromT:controls.target.clone(),toP:aim.position,toT:aim.target,start:performance.now(),duration,onEnd};if(!duration){camera.position.copy(aim.position);controls.target.copy(aim.target);transition=null;controls.update();onEnd?.();}dirty=true;}
function goOverview(animated=true){fly(overviewAim(),animated?1300:0);$('zoom').value=0;}
function focus(distance=4.4,rear=false){fly(aimFor(selected,distance,rear),1300);}
$('overview').onclick=()=>goOverview();$('rack').onclick=()=>focus();$('rear').onclick=()=>focus(4.6,true);$('row').onclick=()=>{const first=Math.floor(selected/layout.cols)*layout.cols,last=Math.min(first+layout.cols-1,positions.length-1),center=positions[first].clone().add(positions[last]).multiplyScalar(.5).add(new V(0,0,1.12));const distance=Math.max(7,layout.width/(2*Math.tan(camera.fov*Math.PI/360)*camera.aspect)*1.4);fly({target:center,position:center.clone().addScaledVector(new V(.3,-1,.45).normalize(),distance)});};
$('dive').onclick=()=>{goOverview(false);fly(aimFor(selected,4.4),5000);};
$('zoom').oninput=()=>{transition=null;const t=+$('zoom').value/100,far=overviewAim(),near=aimFor(selected,3.2),ease=t*t*(3-2*t);controls.target.copy(far.target).lerp(near.target,ease);const dist=far.position.distanceTo(far.target)*Math.pow(3.2/far.position.distanceTo(far.target),t);const dir=far.position.clone().sub(far.target).normalize().lerp(near.position.clone().sub(near.target).normalize(),ease).normalize();camera.position.copy(controls.target).addScaledVector(dir,dist);controls.update();dirty=true;};
for(const id of['count','width'])$(id).addEventListener('change',()=>rebuild());
for(const id of['rack-gap','row-gap'])$(id).addEventListener('input',()=>rebuild(true));
function appearance(){const theme=$('theme').value,night=theme==='night',bg=night?0x10292b:theme==='ink'?0xffffff:0xf7f5ee,ink=night?0xbdd9cd:theme==='ink'?0x425a53:0x147f83;document.body.classList.toggle('night',night);stage.style.background='#'+bg.toString(16).padStart(6,'0');renderer.setClearColor(bg,1);materials.forEach(m=>m.color.set(bg));for(const[level,b]of Object.entries(hardware)){b.line.material.uniforms.lineColor.value.set(ink);b.line.material.uniforms.alpha.value=night?.68:.62;b.solid.visible=!$('xray').checked;}
 for(const[layer,b]of Object.entries(cableBatches)){const visible=$('connections').checked&&$(layer).checked;b.near.object.visible=b.mid.object.visible=visible;b.near.material.depthTest=b.mid.material.depthTest=!$('xray').checked;}
 bundles.group.visible=exitBatch.object.visible=$('connections').checked&&$('fabric').checked;bundles.trayGroup.visible=$('trays').checked;exitBatch.material.depthTest=!$('xray').checked;
 $('layers').style.opacity=$('connections').checked?'1':'.38';floor.visible=$('floor').checked;settingsDirty=true;dirty=true;}
for(const id of['theme','xray','connections','nvlink','front','management','fabric','trays','floor'])$(id).addEventListener('input',appearance);
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{transition=null;down=[e.clientX,e.clientY];});
function hitAt(e){const b=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObject(pickMesh)[0];return hit?.instanceId;}
renderer.domElement.addEventListener('click',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const hit=hitAt(e);if(hit!==undefined)setSelected(hit);});renderer.domElement.addEventListener('dblclick',e=>{const hit=hitAt(e);if(hit!==undefined){setSelected(hit);focus();}});renderer.domElement.addEventListener('wheel',()=>{transition=null;},{passive:true});
controls.addEventListener('change',()=>{dirty=true;});
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true;}new ResizeObserver(resize).observe(stage);
const frustum=new THREE.Frustum(),clip=new THREE.Matrix4(),sphere=new THREE.Sphere(new V(),1.5),point=new V(),candidates=[];
function updateLOD(){camera.updateMatrixWorld();clip.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(clip);candidates.length=0;const far=[],mid=[],near=[],midCables=[];
 const pixelsPerMeter=stage.clientHeight/(2*Math.tan(camera.fov*Math.PI/360));
 positions.forEach((p,id)=>{point.copy(p).z=1.118;sphere.center.copy(point);if(!frustum.intersectsSphere(sphere))return;const dist=camera.position.distanceTo(point),px=2.236*pixelsPerMeter/Math.max(dist,.5);candidates.push({id,dist,px});});candidates.sort((a,b)=>a.dist-b.dist);
 for(const c of candidates){if(c.px>190&&near.length<16)near.push(c.id);else if(c.px>36)mid.push(c.id);else far.push(c.id);if(c.px>90&&!near.includes(c.id))midCables.push(c.id);}
 offsets(exitBatch,near);fillHardware(hardware.far,far);fillHardware(hardware.medium,mid);fillHardware(hardware.high,near);for(const b of Object.values(cableBatches)){offsets(b.near,near);offsets(b.mid,midCables);}
 Object.assign(status,{high:near.length,medium:mid.length,far:far.length});$('detail-badge').textContent=near.length?'CLOSE-UP':mid.length?'RACK DETAIL':'OVERVIEW';$('zoom-text').textContent=near.length?'Rack':mid.length?'Row':'Field';$('detail-status').textContent=near.length?near.length+' detailed racks in view · connections '+($('connections').checked?'on':'off'):'Hardware and cabling gain detail as you zoom in.';
 if(document.activeElement!==$('zoom')&&!transition){const farDist=overviewAim().position.distanceTo(overviewAim().target),dist=camera.position.distanceTo(controls.target);$('zoom').value=Math.max(0,Math.min(100,Math.log(dist/farDist)/Math.log(3.2/farDist)*100));}
 dirty=false;settingsDirty=false;lastLOD=performance.now();}
function saveBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();$('load-status').textContent=name+' ready · '+Math.round(blob.size/1024).toLocaleString()+' KB';setTimeout(()=>URL.revokeObjectURL(a.href),60000);}
$('export').onclick=()=>{const w=stage.clientWidth,h=stage.clientHeight,p=renderer.getPixelRatio();renderer.setPixelRatio(1);renderer.setSize(4200,Math.round(4200*h/w),false);renderer.setClearAlpha(0);selectionMarker.visible=false;renderer.render(scene,camera);renderer.domElement.toBlob(b=>saveBlob(b,'gb200-'+positions.length+'-racks.png'),'image/png');selectionMarker.visible=true;renderer.setPixelRatio(p);renderer.setSize(w,h);renderer.setClearAlpha(1);};
function sceneSettings(){return{version:2,count:+$('count').value,racksPerRow:+$('width').value,rackGap:+$('rack-gap').value,rowGap:+$('row-gap').value,selectedRack:selected+1,camera:camera.position.toArray(),target:controls.target.toArray(),appearance:$('theme').value,connections:$('connections').checked,layers:{trays:$('trays').checked,fabric:$('fabric').checked,nvlink:$('nvlink').checked,front:$('front').checked,management:$('management').checked},xray:$('xray').checked,floor:$('floor').checked};}
$('save').onclick=()=>saveBlob(new Blob([JSON.stringify(sceneSettings(),null,2)],{type:'application/json'}),'gb200-field-settings.json');
$('load').onclick=()=>$('scene-file').click();
$('scene-file').onchange=async e=>{try{
 const file=e.target.files[0];if(!file)return;const v=JSON.parse(await file.text());
 if(v.version===1){v.racksPerRow=v.podsPerRow*4;v.rackGap=.1;v.rowGap=1.8;}
 if(![1,2].includes(v.version)||![16,64,128,256,512,1024].includes(v.count)||![8,16,32,64].includes(v.racksPerRow)||!Number.isFinite(v.rackGap)||v.rackGap<0||v.rackGap>2||!Number.isFinite(v.rowGap)||v.rowGap<0||v.rowGap>6||!['teal','ink','night'].includes(v.appearance)||![v.camera,v.target].every(a=>Array.isArray(a)&&a.length===3&&a.every(n=>Number.isFinite(n)&&Math.abs(n)<10000)))throw new Error('Please choose a rack-field settings file.');
 $('count').value=v.count;$('width').value=v.racksPerRow;$('rack-gap').value=v.rackGap;$('row-gap').value=v.rowGap;rebuild();setSelected(Math.max(0,Math.min(v.count-1,(v.selectedRack||1)-1)));
 $('theme').value=v.appearance;for(const id of['connections','xray','floor'])$(id).checked=!!v[id];for(const id of['nvlink','front','management','fabric','trays'])$(id).checked=v.layers?.[id]??true;
 transition=null;camera.position.fromArray(v.camera);controls.target.fromArray(v.target);controls.update();appearance();$('load-status').textContent='Scene restored.';
 }catch(err){$('load-status').textContent=err.message;}e.target.value='';};
// Query settings make a composition easy to reopen or share locally.
const params=new URLSearchParams(location.search);if(['16','64','128','256','512','1024'].includes(params.get('count')))$('count').value=params.get('count');if(params.get('connections')==='off')$('connections').checked=false;
resize();rebuild();appearance();updateLOD();$('loading').remove();
let lastFrame=0;
function animate(t){requestAnimationFrame(animate);if(transition){const tr=transition,u=tr.duration?Math.min(1,(t-tr.start)/tr.duration):1,ease=u*u*(3-2*u);camera.position.lerpVectors(tr.fromP,tr.toP,ease);controls.target.lerpVectors(tr.fromT,tr.toT,ease);if(u===1){transition=null;tr.onEnd?.();}dirty=true;}controls.update();if(dirty&&(t-lastLOD>70||settingsDirty))updateLOD();renderer.render(scene,camera);if(t-lastFrame>1000){stage.dataset.diagnostics=JSON.stringify(window.fleetDiagnostics());lastFrame=t;}}requestAnimationFrame(animate);
// Read-only diagnostics support checking actual render size and detail budgets.
window.fleetDiagnostics=()=>({racks:positions.length,connectedRacks:routeAudit.connectedRacks,routeSegments:routeAudit.edges,bundles:bundles.stats,spacing:{rack:+$('rack-gap').value,row:+$('row-gap').value},visible:status.high+status.medium+status.far,detail:{...status},drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,lines:renderer.info.render.lines,connections:$('connections').checked,canvas:[renderer.domElement.width,renderer.domElement.height],settings:sceneSettings()});
