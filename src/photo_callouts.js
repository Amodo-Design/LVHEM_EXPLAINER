import * as THREE from 'three';

// Image-only callouts: fixed screen-space cards, with leaders attached to 3D hardware.
export function createPhotoCallouts(stage,camera,getAnchors){
 const ns='http://www.w3.org/2000/svg',overlay=document.createElement('div');
 overlay.className='photo-callouts';overlay.setAttribute('aria-hidden','true');
 const svg=document.createElementNS(ns,'svg');svg.classList.add('photo-leaders');overlay.append(svg);
 const items=[
  {key:'compute',src:'assets/compute.jpg',alt:'Real compute racks',color:'#2d539e',edge:'top'},
  {key:'recompute',src:'assets/recompute.jpeg',alt:'Real recomputation server rack',color:'#668e3d',edge:'bottom'},
  {key:'tap',src:'assets/TAP.jpg',alt:'Real network TAP and fibre connections',color:'#c57339',edge:'top'}
 ].map((item,i)=>{
  const card=document.createElement('figure');card.className='photo-card '+item.key;card.style.setProperty('--accent',item.color);card.style.setProperty('--delay',`${i*110}ms`);
  const img=document.createElement('img');img.src=item.src;img.alt=item.alt;img.decoding='async';card.append(img);overlay.append(card);
  const group=document.createElementNS(ns,'g');group.style.color=item.color;group.style.setProperty('--delay',`${i*110}ms`);
  const line=document.createElementNS(ns,'path'),halo=document.createElementNS(ns,'circle'),dot=document.createElementNS(ns,'circle');
  line.setAttribute('class','leader');halo.setAttribute('class','anchor-halo');halo.setAttribute('r','6');dot.setAttribute('class','anchor-dot');dot.setAttribute('r','2.5');group.append(line,halo,dot);svg.append(group);
  return{...item,card,group,line,halo,dot};
 });
 stage.append(overlay);let visible=false;
 function update(){
  if(!visible)return;
  const bounds=stage.getBoundingClientRect(),w=bounds.width,h=bounds.height,anchors=getAnchors();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  for(const item of items){
   const p=new THREE.Vector3(...anchors[item.key]).project(camera),x=(p.x+1)*w/2,y=(1-p.y)*h/2;
   const rect=item.card.getBoundingClientRect(),left=rect.left-bounds.left,top=rect.top-bounds.top;
   const sx=Math.max(left+20,Math.min(left+rect.width-20,x)),sy=item.edge==='top'?top:top+rect.height;
   const bend=sy+(item.edge==='top'?-18:18);
   item.line.setAttribute('d',`M ${sx} ${sy} L ${sx} ${bend} L ${x} ${y}`);
   for(const dot of[item.halo,item.dot]){dot.setAttribute('cx',x);dot.setAttribute('cy',y);}
   item.group.style.visibility=p.z>1||p.z< -1?'hidden':'visible';
  }
 }
 return{setVisible(value){visible=value;overlay.classList.toggle('is-visible',value);overlay.setAttribute('aria-hidden',String(!value));if(value)update();},update};
}
