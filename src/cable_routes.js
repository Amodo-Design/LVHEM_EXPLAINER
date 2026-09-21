import * as THREE from 'three';
const V=THREE.Vector3;
// Straight runs with locally rounded corners: no interpolating spline overshoot.
export function roundedCablePath(points,radius=.085){
 const pts=points.filter((p,i)=>!i||p.distanceToSquared(points[i-1])>1e-10),path=new THREE.CurvePath();
 let cursor=pts[0].clone();
 for(let i=1;i<pts.length-1;i++){
  const p=pts[i],incoming=p.clone().sub(pts[i-1]),outgoing=pts[i+1].clone().sub(p);
  const cut=Math.min(radius,incoming.length()*.42,outgoing.length()*.42);
  const a=p.clone().addScaledVector(incoming.normalize(),-cut),b=p.clone().addScaledVector(outgoing.normalize(),cut);
  if(cursor.distanceToSquared(a)>1e-10)path.add(new THREE.LineCurve3(cursor,a));
  path.add(new THREE.QuadraticBezierCurve3(a,p.clone(),b));cursor=b;
 }
 if(cursor.distanceToSquared(pts.at(-1))>1e-10)path.add(new THREE.LineCurve3(cursor,pts.at(-1).clone()));
 path.points=pts;return path;
}
export function ladderTray(a,b,width=.28){
 const geos=[],direction=b.clone().sub(a),length=direction.length(),q=new THREE.Quaternion().setFromUnitVectors(new V(1,0,0),direction.clone().normalize()),mid=a.clone().add(b).multiplyScalar(.5);
 function piece(x,y,z,w,d,h){const g=new THREE.BoxGeometry(w,d,h);g.translate(x,y,z);g.applyQuaternion(q);g.translate(mid.x,mid.y,mid.z);geos.push(g);}
 for(const y of[-width/2,width/2])piece(0,y,.025,length,.013,.065);
 for(let x=-length/2;x<=length/2;x+=.22)piece(x,0,0,.014,width,.012);
 const positions=[],normals=[];for(const geo of geos){const n=geo.toNonIndexed();positions.push(...n.attributes.position.array);normals.push(...n.attributes.normal.array);n.dispose();geo.dispose();}
 const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));result.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));return result;
}
