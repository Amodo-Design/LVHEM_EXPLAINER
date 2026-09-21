import * as THREE from 'three';
const V=THREE.Vector3;
const cableTones=[0x216f71,0x2c8586,0x479a95,0x176063];
function merge(geometries){const pos=[],norm=[];for(const g of geometries){const n=g.toNonIndexed();pos.push(...n.attributes.position.array);norm.push(...n.attributes.normal.array);n.dispose();g.dispose();}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));return g;}
export function buildCableBundles(layout){
 const group=new THREE.Group(),trayGroup=new THREE.Group(),geometries=[],materials=[];
 group.name='Overhead cable bundles — schematic switching';group.add(trayGroup);
 const mats=cableTones.map(color=>{const m=new THREE.MeshLambertMaterial({color});materials.push(m);return m;});
 const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),scale=new V(),center=new V(),up=new V(0,1,0);
 const lines=[],trayLines=[];const line=(a,b,target=trayLines)=>target.push(...a,...b);
 const z=2.94,spineX=layout.width/2+1, firstY=layout.positions[0][1],lastY=layout.positions.at(-1)[1];
 // Each visible strand is a cable/loom representative; no one-to-one port count is implied.
 const segments=[[],[],[],[]];
 function strand(a,b,r,tone){segments[tone%4].push({a:new V(...a),b:new V(...b),r});}
 for(let row=0;row<layout.rows;row++){
  const start=row*layout.cols,end=Math.min(start+layout.cols,layout.positions.length),y=layout.positions[start][1],x0=layout.positions[start][0]-.25,x1=spineX;
  for(let k=0;k<64;k++){const yy=y+(k%16-7.5)*.021,zz=z+Math.floor(k/16)*.019;strand([x0,yy,zz],[x1,yy,zz],.0085,k);}
  // Open ladder tray: side rails, two longitudinal base rails, frequent transverse rungs.
  for(const yy of[y-.23,y+.23])for(const zz of[z-.055,z+.13])line([x0,yy,zz],[x1+.08,yy,zz]);
  for(let x=x0;x<=x1+.08;x+=.25){line([x,y-.23,z-.055],[x,y+.23,z-.055]);line([x,y-.23,z-.055],[x,y-.23,z+.13]);line([x,y+.23,z-.055],[x,y+.23,z+.13]);}
  for(let x=x0+.3;x<x1-.3;x+=2.4){for(const yy of[y-.21,y+.21])line([x,yy,2.236],[x,yy,z-.055]);line([x,y-.25,z-.06],[x,y+.25,z-.06]);}
 }
 if(layout.rows>1){
  for(let k=0;k<96;k++){const xx=spineX+(k%24-11.5)*.021,zz=z+Math.floor(k/24)*.019;strand([xx,firstY-.2,zz],[xx,lastY+.2,zz],.0085,k);}
  for(const x of[spineX-.3,spineX+.3])for(const zz of[z-.07,z+.14])line([x,firstY-.25,zz],[x,lastY+.25,zz]);
  for(let y=firstY-.25;y<=lastY+.25;y+=.25){line([spineX-.3,y,z-.07],[spineX+.3,y,z-.07]);for(const x of[spineX-.3,spineX+.3])line([x,y,z-.07],[x,y,z+.14]);}
 }
 const cylinder=new THREE.CylinderGeometry(1,1,1,6,1);geometries.push(cylinder);
 segments.forEach((items,tone)=>{const mesh=new THREE.InstancedMesh(cylinder,mats[tone],items.length);for(let i=0;i<items.length;i++){const {a,b,r}=items[i];center.copy(a).add(b).multiplyScalar(.5);q.setFromUnitVectors(up,b.clone().sub(a).normalize());scale.set(r,a.distanceTo(b),r);matrix.compose(center,q,scale);mesh.setMatrixAt(i,matrix);}mesh.computeBoundingSphere();group.add(mesh);});
 // Two dense, curved drop looms per rack, with visible individual strands and retaining bands.
 const dropGeos=[];
 for(const side of[-1,1]){
  const curve=new THREE.CubicBezierCurve3(new V(side*.265,-.538,2.28),new V(side*.265,-.538,2.73),new V(side*.12,-.34,z),new V(side*.12,0,z));
  dropGeos.push(new THREE.TubeGeometry(curve,16,.034,8,false));
  for(let strand=0;strand<18;strand++){const a=strand*Math.PI*2/18,dx=Math.cos(a)*.035,dy=Math.sin(a)*.035;const pts=curve.getPoints(20);for(let j=1;j<pts.length;j++)line([pts[j-1].x+dx,pts[j-1].y+dy,pts[j-1].z],[pts[j].x+dx,pts[j].y+dy,pts[j].z],lines);}
  for(const t of[.12,.38,.7]){const c=curve.getPoint(t),tangent=curve.getTangent(t);const ring=new THREE.TorusGeometry(.0355,.004,4,16);ring.quaternion;ring.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new V(0,0,1),tangent)));ring.translate(c.x,c.y,c.z);dropGeos.push(ring);}
 }
 const dropGeometry=merge(dropGeos);geometries.push(dropGeometry);const drops=new THREE.InstancedMesh(dropGeometry,mats[0],layout.positions.length);layout.positions.forEach((p,i)=>{matrix.makeTranslation(...p);drops.setMatrixAt(i,matrix);});drops.computeBoundingSphere();group.add(drops);
 const lineGeo=new THREE.InstancedBufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));lineGeo.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array(layout.positions.flat()),3));lineGeo.instanceCount=layout.positions.length;geometries.push(lineGeo);
 const lineMat=new THREE.ShaderMaterial({uniforms:{color:{value:new THREE.Color(0x87c2b6)}},vertexShader:'attribute vec3 offset;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+offset,1.);}',fragmentShader:'uniform vec3 color;void main(){gl_FragColor=vec4(color,1.);}'});materials.push(lineMat);const details=new THREE.LineSegments(lineGeo,lineMat);details.frustumCulled=false;group.add(details);
 const trayGeo=new THREE.BufferGeometry();trayGeo.setAttribute('position',new THREE.Float32BufferAttribute(trayLines,3));geometries.push(trayGeo);const trayMat=new THREE.LineBasicMaterial({color:0xa88b58,transparent:true,opacity:.85});materials.push(trayMat);trayGroup.add(new THREE.LineSegments(trayGeo,trayMat));
 return {group,trayGroup,stats:{rackDrops:layout.positions.length*2,rowStrands:64,crossRowStrands:96},dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
