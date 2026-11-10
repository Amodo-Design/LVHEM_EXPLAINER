import * as THREE from 'three';
import photos from '../assets/web/photos.js';

// Image-only callouts: fixed screen-space cards, with leaders attached to 3D hardware.
// With data-flags="on" on the page, a card can carry a national flag over its top right corner.
const FLAGS={
 fr:{label:'France',svg:'<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/></svg>'},
 gb:{label:'United Kingdom',svg:'<svg viewBox="0 0 60 30"><clipPath id="flag-gb-frame"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="flag-gb-quarters"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#flag-gb-frame)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" clip-path="url(#flag-gb-quarters)" stroke="#c8102e" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6"/></g></svg>'}
};
export function createPhotoCallouts(stage,camera,getAnchors){
 const ns='http://www.w3.org/2000/svg',flags=document.documentElement.dataset.flags==='on',overlay=document.createElement('div');
 overlay.className='photo-callouts';overlay.setAttribute('aria-hidden','true');
 const svg=document.createElementNS(ns,'svg');svg.classList.add('photo-leaders');overlay.append(svg);
 const items=[
  {key:'compute',sizes:'(max-width: 600px) 39vw, clamp(180px, 27vw, 350px)',alt:'Real compute racks',color:'#2d539e',edge:'top',flag:'fr'},
  {key:'recompute',sizes:'(max-width: 600px) 25vw, min(17vw, 190px, 22vh)',alt:'Real recomputation server rack',color:'#668e3d',edge:'bottom',flag:'gb'},
  {key:'tap',sizes:'(max-width: 600px) 41vw, clamp(180px, 26vw, 320px)',alt:'Real network TAP and fibre connections',color:'#c57339',edge:'top'}
 ].map((item,i)=>{
  const card=document.createElement('figure');card.className='photo-card '+item.key;card.style.setProperty('--accent',item.color);card.style.setProperty('--delay',`${i*110}ms`);
  const img=document.createElement('img'),variants=photos[item.key].variants;img.alt=item.alt;img.decoding='async';img.width=variants[0].width;img.height=variants[0].height;img.sizes=item.sizes;card.append(img);overlay.append(card);
  let flag=null;if(flags&&item.flag){flag=document.createElement('span');flag.className='photo-flag';flag.title=FLAGS[item.flag].label;flag.innerHTML=FLAGS[item.flag].svg;card.append(flag);}
  const group=document.createElementNS(ns,'g');group.style.color=item.color;group.style.setProperty('--delay',`${i*110}ms`);
  const line=document.createElementNS(ns,'path'),halo=document.createElementNS(ns,'circle'),dot=document.createElementNS(ns,'circle');
  line.setAttribute('class','leader');halo.setAttribute('class','anchor-halo');halo.setAttribute('r','6');dot.setAttribute('class','anchor-dot');dot.setAttribute('r','2.5');group.append(line,halo,dot);svg.append(group);
  return{...item,img,variants,card,flag,group,line,halo,dot};
 });
 stage.append(overlay);let visible=false,loaded=false;
 function preload(){if(loaded)return;loaded=true;for(const {img,variants}of items){img.fetchPriority='low';img.srcset=variants.map(v=>`${v.src} ${v.width}w`).join(', ');img.src=variants[0].src;}}
 function update(){
  if(!visible)return;
  const bounds=stage.getBoundingClientRect(),w=bounds.width,h=bounds.height,anchors=getAnchors();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  for(const item of items){
   const p=new THREE.Vector3(...anchors[item.key]).project(camera),x=(p.x+1)*w/2,y=(1-p.y)*h/2;
   const rect=item.card.getBoundingClientRect(),left=rect.left-bounds.left,top=rect.top-bounds.top;
   // A leader that leaves the top edge stays clear of the flag on the top right corner.
   const clear=item.flag&&item.edge==='top'?item.flag.offsetWidth+8:20;
   const sx=Math.max(left+20,Math.min(left+rect.width-clear,x)),sy=item.edge==='top'?top:top+rect.height;
   const bend=sy+(item.edge==='top'?-18:18);
   item.line.setAttribute('d',`M ${sx} ${sy} L ${sx} ${bend} L ${x} ${y}`);
   for(const dot of[item.halo,item.dot]){dot.setAttribute('cx',x);dot.setAttribute('cy',y);}
   item.group.style.visibility=p.z>1||p.z< -1?'hidden':'visible';
  }
 }
 return{preload,setVisible(value){if(value)preload();visible=value;overlay.classList.toggle('is-visible',value);overlay.setAttribute('aria-hidden',String(!value));if(value)update();},update};
}
