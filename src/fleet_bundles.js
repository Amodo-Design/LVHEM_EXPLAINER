import * as THREE from 'three';
const V=THREE.Vector3;
const cableTones=[0xcaa72f,0xe2c44a,0xd7b744,0xf0d773];
function merge(geometries){const pos=[],norm=[];for(const g of geometries){const n=g.toNonIndexed();pos.push(...n.attributes.position.array);norm.push(...n.attributes.normal.array);n.dispose();g.dispose();}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));return g;}
export function buildCableBundles(layout){
 const group=new THREE.Group(),trayGroup=new THREE.Group(),geometries=[],materials=[];
 group.name='Overhead cable bundles — schematic switching';group.add(trayGroup);
 const mats=cableTones.map(color=>{const m=new THREE.MeshLambertMaterial({color});materials.push(m);return m;});
 const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),scale=new V(),center=new V(),up=new V(0,1,0);
 const lines=[],trayLines=[];const line=(a,b,target=trayLines)=>target.push(...a,...b);
 const z=2.94,spineX=Math.max(...layout.positions.map(p=>p[0]))+1.3, firstY=layout.positions[0][1],lastY=layout.positions.at(-1)[1];
 // Each visible strand is a cable/loom representative; no one-to-one port count is implied.
 const segments=[[],[],[],[]],elbowGeos=[];
 function strand(a,b,r,tone){segments[tone%4].push({a:new V(...a),b:new V(...b),r});}
 for(let row=0;row<layout.rows;row++){
  const start=row*layout.cols,end=Math.min(start+layout.cols,layout.positions.length),y=layout.positions[start][1],x0=layout.positions[start][0]-.25,x1=spineX;
  for(let k=0;k<64;k++){const yy=y+(k%16-7.5)*.021,zz=z+Math.floor(k/16)*.019;strand([x0,yy,zz],[x1-.4,yy,zz],.0085,k);if(row===0){const lane=(k%16-7.5)*.021,curve=new THREE.CubicBezierCurve3(new V(-.4,lane,zz),new V(-.13,lane,zz),new V(lane,.15,zz),new V(lane,.45,zz));elbowGeos.push(new THREE.TubeGeometry(curve,12,.0085,6,false));}}
  // Open ladder tray: side rails, two longitudinal base rails, frequent transverse rungs.
  for(const yy of[y-.23,y+.23])for(const zz of[z-.055,z+.13])line([x0,yy,zz],[x1+.08,yy,zz]);
  for(let x=x0;x<=x1+.08;x+=.25){line([x,y-.23,z-.055],[x,y+.23,z-.055]);line([x,y-.23,z-.055],[x,y-.23,z+.13]);line([x,y+.23,z-.055],[x,y+.23,z+.13]);}
  for(let x=x0+.3;x<x1-.3;x+=2.4){for(const yy of[y-.21,y+.21])line([x,yy,2.236],[x,yy,z-.055]);line([x,y-.25,z-.06],[x,y+.25,z-.06]);}
 }
 if(layout.rows>1){
  for(let k=0;k<96;k++){const xx=spineX+(k%24-11.5)*.021,zz=z+Math.floor(k/24)*.019;strand([xx,firstY-.2,zz],[xx,lastY+.65,zz],.0085,k);}
  for(const x of[spineX-.3,spineX+.3])for(const zz of[z-.07,z+.14])line([x,firstY-.25,zz],[x,lastY+.7,zz]);
  for(let y=firstY-.25;y<=lastY+.7;y+=.25){line([spineX-.3,y,z-.07],[spineX+.3,y,z-.07]);for(const x of[spineX-.3,spineX+.3])line([x,y,z-.07],[x,y,z+.14]);}
 }
 const cylinder=new THREE.CylinderGeometry(1,1,1,6,1);geometries.push(cylinder);
 segments.forEach((items,tone)=>{const mesh=new THREE.InstancedMesh(cylinder,mats[tone],items.length);for(let i=0;i<items.length;i++){const {a,b,r}=items[i];center.copy(a).add(b).multiplyScalar(.5);q.setFromUnitVectors(up,b.clone().sub(a).normalize());scale.set(r,a.distanceTo(b),r);matrix.compose(center,q,scale);mesh.setMatrixAt(i,matrix);}mesh.computeBoundingSphere();group.add(mesh);});
 // Two dense, curved drop looms per rack, with visible individual strands and retaining bands.
 const dropGeos=[],clampGeos=[];
 for(const side of[-1,1]){
  const curve=new THREE.CubicBezierCurve3(new V(side*.265,-.538,2.28),new V(side*.265,-.538,2.73),new V(side*.12,-.34,z),new V(side*.12,0,z));
  dropGeos.push(new THREE.TubeGeometry(curve,16,.034,8,false));
  for(let strand=0;strand<18;strand++){const a=strand*Math.PI*2/18,dx=Math.cos(a)*.035,dy=Math.sin(a)*.035;const pts=curve.getPoints(20);for(let j=1;j<pts.length;j++)line([pts[j-1].x+dx,pts[j-1].y+dy,pts[j-1].z],[pts[j].x+dx,pts[j].y+dy,pts[j].z],lines);}
  for(const t of[.12,.38,.7]){const c=curve.getPoint(t),tangent=curve.getTangent(t);const ring=new THREE.TorusGeometry(.0355,.004,4,16);ring.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new V(0,0,1),tangent)));ring.translate(c.x,c.y,c.z);clampGeos.push(ring);}
 }
 const clampGeometry=merge(clampGeos);geometries.push(clampGeometry);const clampMaterial=new THREE.MeshStandardMaterial({color:0x292d2e,roughness:.85});materials.push(clampMaterial);const clamps=new THREE.InstancedMesh(clampGeometry,clampMaterial,layout.positions.length);layout.positions.forEach((p,i)=>{matrix.makeTranslation(...p);clamps.setMatrixAt(i,matrix);});clamps.computeBoundingSphere();group.add(clamps);
 const elbowGeometry=merge(elbowGeos);geometries.push(elbowGeometry);const elbows=new THREE.InstancedMesh(elbowGeometry,mats[1],layout.rows);for(let r=0;r<layout.rows;r++){matrix.makeTranslation(spineX,layout.positions[r*layout.cols][1],0);elbows.setMatrixAt(r,matrix);}elbows.computeBoundingSphere();group.add(elbows);
 const dropGeometry=merge(dropGeos);geometries.push(dropGeometry);const drops=new THREE.InstancedMesh(dropGeometry,mats[0],layout.positions.length);layout.positions.forEach((p,i)=>{matrix.makeTranslation(...p);drops.setMatrixAt(i,matrix);});drops.computeBoundingSphere();group.add(drops);
 const lineGeo=new THREE.InstancedBufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));lineGeo.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array(layout.positions.flat()),3));lineGeo.instanceCount=layout.positions.length;geometries.push(lineGeo);
 const lineMat=new THREE.ShaderMaterial({uniforms:{color:{value:new THREE.Color(0xf4dc75)}},vertexShader:'attribute vec3 offset;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+offset,1.);}',fragmentShader:'uniform vec3 color;void main(){gl_FragColor=vec4(color,1.);}'});materials.push(lineMat);const details=new THREE.LineSegments(lineGeo,lineMat);details.frustumCulled=false;group.add(details);
 const trayMat=new THREE.MeshStandardMaterial({color:0x737c7e,roughness:.48,metalness:.6});materials.push(trayMat);const trayMesh=new THREE.InstancedMesh(cylinder,trayMat,trayLines.length/6);for(let i=0;i<trayLines.length;i+=6){const a=new V(...trayLines.slice(i,i+3)),b=new V(...trayLines.slice(i+3,i+6));center.copy(a).add(b).multiplyScalar(.5);q.setFromUnitVectors(up,b.clone().sub(a).normalize());scale.set(.005,a.distanceTo(b),.005);matrix.compose(center,q,scale);trayMesh.setMatrixAt(i/6,matrix);}trayMesh.computeBoundingSphere();trayGroup.add(trayMesh);
 return {group,trayGroup,stats:{rackDrops:layout.positions.length*2,rowStrands:64,crossRowStrands:96},dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
