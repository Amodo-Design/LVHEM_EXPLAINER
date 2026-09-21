import * as THREE from 'three';
import data from '../assets/model-data.js';
export function createRackGeometries(){
function accumulator(){return{vertices:[],indices:[],lines:[],colors:[]};}
function addTemplate(dst,t,pos,color=0x303638){const rgb=new THREE.Color(color).toArray();for(const v of t.v)dst.colors.push(...rgb);const off=dst.vertices.length/3;for(const v of t.v)dst.vertices.push((v[0]+pos[0])/1000,(v[1]+pos[1])/1000,(v[2]+pos[2])/1000);for(const f of t.f)for(let i=1;i<f.length-1;i++)dst.indices.push(off+f[0],off+f[i],off+f[i+1]);for(const p of t.lines)dst.lines.push((p[0]+pos[0])/1000,(p[1]+pos[1])/1000,(p[2]+pos[2])/1000);}
function addBox(dst,c,s,color=0x303638){const [x,y,z]=c,[w,d,h]=s.map(v=>v/2),v=[[x-w,y-d,z-h],[x+w,y-d,z-h],[x+w,y+d,z-h],[x-w,y+d,z-h],[x-w,y-d,z+h],[x+w,y-d,z+h],[x+w,y+d,z+h],[x-w,y+d,z+h]],f=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]],l=[];for(const[a,b]of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])l.push(v[a],v[b]);addTemplate(dst,{v,f,lines:l},[0,0,0],color);}
const levels={far:accumulator(),medium:accumulator(),high:accumulator()};
// Large-scale silhouette is deliberately sparse; the closer levels use the real source model.
addBox(levels.far,[0,0,1118],[600,1200,2236]);
addBox(levels.far,[0,-603,1090],[440,5,1310],0x9c947d);
for(const z of [480,875,1280,1740,1985])levels.far.lines.push(-.27,-.6005,z/1000,.27,-.6005,z/1000);
const hardwareColors={frame:0x25292b,side_panel:0x2c3033,blank:0x22282b,compute_shell:0xa3997e,compute_lid:0x7a7d78,switch_shell:0x9c947d,switch_lid:0x6e716c,compute_internal:0x324341,switch_internal:0x303b36,power:0x4d5151,management:0xaa9f84,manifold:0x778681,cartridge:0x343936,busbar:0x846743,rear_brace:0x454c4e};
for(const p of data.parts){const t=data.templates[p.template];addTemplate(levels.high,t,p.position,hardwareColors[p.template]);if(['frame','blank','manifold','busbar','rear_brace'].includes(p.template)){
 if(p.template==='frame'){
  for(const x of [-286,286])for(const y of [-586,586])addBox(levels.medium,[x,y,1118],[28,28,2236]);
  for(const z of [25,2211])addBox(levels.medium,[0,0,z],[600,1200,50]);
 }else if(p.template==='blank')addBox(levels.medium,[0,-413,p.position[2]],[480,4,43]);
 else if(p.template==='busbar')addBox(levels.medium,[0,409,1118],[35,52,2100]);
 }else if(['compute_shell','switch_shell','power','management'].includes(p.template)){addBox(levels.medium,[0,p.template==='power'?-142:p.template==='management'?-210:-27.8,p.position[2]],[438,p.template==='power'?538:p.template==='management'?402:766,43],hardwareColors[p.template]);}}
for(const x of[-297,297])addBox(levels.medium,[x,0,1118],[6,1150,2150],0x262b2e);
// Solid front-panel relief follows the same published port layout as the linework.
function disk(dst,x,y,z,r,color){const v=[[x,y,z]];for(let i=0;i<16;i++){const a=i*Math.PI/8;v.push([x+Math.cos(a)*r,y,z+Math.sin(a)*r]);}const f=[];for(let i=1;i<=16;i++)f.push([0,i,i%16+1]);addTemplate(dst,{v,f,lines:[]},[0,0,0],color);}
for(const p of data.parts){const z=p.position[2];for(const level of ['high','medium']){const a=levels[level];
 if(p.template==='compute_shell'){
  for(const side of[-145,145]){addBox(a,[side,-413.4,z+1],[119,1,3],0x101719);for(const x of[side-24,side+24])addBox(a,[x,-413.5,z-11],[29,1.3,9],0x10171a);for(const x of[side-6,side+27])addBox(a,[x,-413.5,z+11],[28,1.3,8],0x172024);for(const x of[side-49,side+53])addBox(a,[x,-413.5,z],[12,1,30],0x2b3232);}
  for(let i=0;i<8;i++){const x=-65+i*15;addBox(a,[x,-413.3,z],[11,1,33],0x303838);if(level==='high'){addBox(a,[x,-414,z],[1.2,1,28],0xa5a68d);addBox(a,[x+3.5,-414,z+9],[2,1,3],0x77ae68);}}
 }else if(p.template==='switch_shell'){addBox(a,[31,-413.5,z],[284,1.3,28],0x242b2a);if(level==='high')for(let i=0;i<70;i++)addBox(a,[-108+i*4,-414.2,z],[.8,1,27],0x8e8c77);for(const x of[-169,-149,-129,-109,-89])addBox(a,[x,-413.5,z-4],[13,1.3,7],0x10181c);
 }else if(p.template==='power'){for(let i=0;i<6;i++){const x=-198+i*79.2;disk(a,x+10,-412.4,z,14,0x11181a);disk(a,x+10,-412.8,z,4,0x9a9d8f);addBox(a,[x-24,-412.4,z],[12,1,24],0x151e21);}}
 else if(p.template==='management'){for(let i=0;i<24;i++)for(const dz of[-8,8])addBox(a,[-214+i*16,-412.4,z+dz],[12,1,10],0x142125);}
}}

const result={};for(const [name,a] of Object.entries(levels)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.vertices,3));g.setAttribute('color',new THREE.Float32BufferAttribute(a.colors,3));g.setIndex(a.indices);g.computeVertexNormals();result[name]=g;}return result;
}
