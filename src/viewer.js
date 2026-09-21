import * as THREE from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import data from '../assets/model-data.js';
const stage=document.getElementById('stage');
const palette={frame:0x608083,panels:0x608083,compute:0x3978a5,nvlink:0xcc6556,cooling:0x2b9b95,power:0xb89147,management:0x706da0,lids:0x6a8c91};
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xfaf9f3,1);stage.prepend(renderer.domElement);
const scene=new THREE.Scene(), camera=new THREE.OrthographicCamera(-2,2,1.6,-1.6,.01,50);camera.up.set(0,0,1);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.1;controls.minZoom=.45;controls.maxZoom=6;
const geo={},solids={},lines={};
for(const [name,t] of Object.entries(data.templates)){
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(t.v.flat().map(x=>x/1000),3));const indices=[];for(const f of t.f)for(let j=1;j<f.length-1;j++)indices.push(f[0],f[j],f[j+1]);g.setIndex(indices);g.computeVertexNormals();
 const l=new THREE.BufferGeometry();l.setAttribute('position',new THREE.Float32BufferAttribute(t.lines.flat().map(x=>x/1000),3));geo[name]={g,l};
}
for(const cat of Object.keys(palette)){
 solids[cat]=new THREE.MeshBasicMaterial({color:0xfaf9f3,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
 lines[cat]=new THREE.LineBasicMaterial({color:0x147f83,transparent:true,opacity:cat==='frame'?.85:.7});
}
const racks=[],parts=[];
for(let r=0;r<4;r++){
 const rack=new THREE.Group();rack.position.x=(r-1.5)*.6;scene.add(rack);racks.push(rack);
 for(const p of data.parts){
  const cat=data.templates[p.template].category,group=new THREE.Group();group.position.set(...p.position.map(x=>x/1000));group.userData={...p,category:cat,rack:r};
  const m=new THREE.Mesh(geo[p.template].g,solids[cat]);const l=new THREE.LineSegments(geo[p.template].l,lines[cat]);group.add(m,l);rack.add(group);parts.push(group);
 }
}
let view='hero';
function framing(){const aspect=stage.clientWidth/stage.clientHeight;const half=view==='single'?1.55:Math.max(1.55,1.92/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();}
function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight);framing();}new ResizeObserver(resize).observe(stage);
function setView(v){view=v;racks.forEach((r,i)=>{r.visible=v!=='single'||i===3;r.position.x=v==='single'?0:(i-1.5)*.6;});const target=new THREE.Vector3(0,0,1.118);controls.target.copy(target);const a=v==='front'?0:v==='rear'?155:v==='single'?33:24,e=v==='front'?0:v==='single'?25:14;const aa=a*Math.PI/180,ee=e*Math.PI/180;camera.position.copy(target).add(new THREE.Vector3(Math.sin(aa)*Math.cos(ee),-Math.cos(aa)*Math.cos(ee),Math.sin(ee)).multiplyScalar(8));camera.zoom=1;camera.lookAt(target);framing();controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===v));document.getElementById('view-label').textContent=v==='single'?'02 / SINGLE-RACK ASSEMBLY':'01 / FOUR-RACK ASSEMBLY';}
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
function update(){
 const style=document.getElementById('style').value,xray=document.getElementById('xray').checked,panels=document.getElementById('panels').checked,lids=document.getElementById('lids').checked,pull=+document.getElementById('pull').value;
 const bg=style==='night'?0x122b30:0xfaf9f3;renderer.setClearColor(bg,1);stage.style.background='#'+bg.toString(16).padStart(6,'0');
 document.getElementById('legend').style.opacity=style==='technical'?'1':'.4';
 for(const cat of Object.keys(palette)){solids[cat].color.setHex(bg);lines[cat].color.setHex(style==='technical'?palette[cat]:style==='night'?0xd9efee:0x147f83);lines[cat].opacity=xray?.24:cat==='frame'?.9:.76;}
 for(const g of parts){const p=g.userData;g.visible=(!p.optional||panels)&&!(p.category==='lids'&&(lids||xray));g.children[0].visible=!xray;g.position.y=p.position[1]/1000-(p.unit==='compute_18'&&p.rack===3?pull/1000:0);}
 document.getElementById('pull-value').textContent=pull+' mm';
}
for(const id of ['style','xray','panels','lids','pull'])document.getElementById(id).addEventListener('input',update);
document.getElementById('png').onclick=()=>{
 const width=stage.clientWidth,height=stage.clientHeight,ratio=renderer.getPixelRatio();renderer.setPixelRatio(1);renderer.setSize(3600,Math.round(3600*height/width),false);renderer.setClearAlpha(0);renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='gb200-'+view+'-'+document.getElementById('style').value+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);},'image/png');renderer.setPixelRatio(ratio);renderer.setSize(width,height);renderer.setClearAlpha(1);
};
setView('hero');update();document.getElementById('loading').remove();
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}animate();
window.assetViewer={scene,camera,renderer,setView,update,parts,racks};
