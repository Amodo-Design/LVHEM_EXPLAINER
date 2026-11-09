import * as THREE from 'three';
// Short name tags pinned to hardware in the 3D scene, each with a solid leader.
export function createSceneTags(stage,camera){
 const ns='http://www.w3.org/2000/svg',overlay=document.createElement('div'),svg=document.createElementNS(ns,'svg');
 overlay.className='scene-tags';overlay.setAttribute('aria-hidden','true');overlay.append(svg);stage.append(overlay);
 const pool=[],p=new THREE.Vector3();
 function ensure(n){while(pool.length<n){const tag=document.createElement('span'),line=document.createElementNS(ns,'path'),dot=document.createElementNS(ns,'circle');tag.className='scene-tag';dot.setAttribute('r','4');svg.append(line,dot);overlay.append(tag);pool.push({tag,line,dot});}}
 function update(list,visible){
  overlay.classList.toggle('is-visible',visible&&list.length>0);ensure(list.length);
  const w=stage.clientWidth,h=stage.clientHeight,scale=Math.min(1,w/1100);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  pool.forEach((item,i)=>{
   const d=list[i],show=Boolean(d);item.tag.hidden=!show;item.line.style.display=item.dot.style.display=show?'':'none';if(!show)return;
   p.copy(d.at).project(camera);const x=(p.x+1)*w/2,y=(1-p.y)*h/2,tx=x+d.dx*scale,ty=y+d.dy*scale;
   if(item.tag.textContent!==d.text)item.tag.textContent=d.text;item.tag.style.setProperty('--accent',d.color);
   item.tag.style.transform=`translate(${tx}px,${ty}px) translate(-50%,-50%)`;
   item.line.setAttribute('d',`M ${x} ${y} L ${tx} ${ty}`);item.line.style.stroke=item.dot.style.fill=d.color;item.dot.setAttribute('cx',x);item.dot.setAttribute('cy',y);
   item.tag.style.visibility=item.line.style.visibility=item.dot.style.visibility=p.z>1||p.z<-1?'hidden':'visible';
  });
 }
 return{update};
}
