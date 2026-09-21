import * as THREE from 'three';
const V=THREE.Vector3;
function roundedPath(points,radius=.03){const path=new THREE.CurvePath();let previous=points[0];for(let i=1;i<points.length-1;i++){const p=points[i],before=points[i-1],after=points[i+1],r=Math.min(radius,p.distanceTo(before)*.4,p.distanceTo(after)*.4),a=p.clone().addScaledVector(before.clone().sub(p).normalize(),r),b=p.clone().addScaledVector(after.clone().sub(p).normalize(),r);path.add(new THREE.LineCurve3(previous,a));path.add(new THREE.QuadraticBezierCurve3(a,p,b));previous=b;}path.add(new THREE.LineCurve3(previous,points.at(-1)));return path;}
function merge(gs){const positions=[],normals=[];for(const g of gs){const n=g.toNonIndexed();for(const v of n.attributes.position.array)positions.push(v);for(const v of n.attributes.normal.array)normals.push(v);n.dispose();g.dispose();}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));return geometry;}
export function buildIndividualFibres(cables,capacity=16){
 const groups=[[],[],[]],boots=[];
 for(let k=0;k<cables.layers.front.length;k+=6){
  const raw=[cables.layers.front[k],cables.layers.front[k+1],cables.layers.front[k+3],cables.layers.front[k+5]],p=raw.map(v=>new V(...v.map(n=>n/1000))),idx=k/6,side=p[3].x<0?-1:1;
  // Distinct lanes keep neighbouring jackets from collapsing into a single line.
  const lane=(idx%12-5.5)*.0048;p[2].y+=lane;p[3].y+=lane;
  const path=roundedPath(p,.028);
  const endX=side*.12+(idx%12-5.5)*.0048,endY=(Math.floor(idx/12)%6-2.5)*.0048;
  path.add(new THREE.CubicBezierCurve3(p[3],new V(p[3].x,p[3].y,2.69),new V(endX,-.34,2.94),new V(endX,endY,2.94)));
  const isEthernet=idx>=72;groups[isEthernet?1:0].push(new THREE.TubeGeometry(path,96,.0024,6,false));
  const body=new THREE.BoxGeometry(.012,.023,.008);body.translate(p[0].x,p[0].y-.008,p[0].z);boots.push(body);
  const boot=new THREE.CylinderGeometry(.004,.003, .025,6);boot.translate(p[0].x,p[0].y-.032,p[0].z);groups[2].push(boot);
 }
 const group=new THREE.Group(),batches=[];
 const materials=[new THREE.MeshStandardMaterial({color:0xecc944,roughness:.48,metalness:.02}),new THREE.MeshStandardMaterial({color:0x58b9b8,roughness:.48,metalness:.02}),new THREE.MeshStandardMaterial({color:0x30383c,roughness:.76}),new THREE.MeshStandardMaterial({color:0xa5adb0,roughness:.38,metalness:.65})];
 [...groups,boots].forEach((gs,i)=>{const mesh=new THREE.InstancedMesh(merge(gs),materials[i],capacity);mesh.count=0;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);group.add(mesh);batches.push(mesh);});
 const matrix=new THREE.Matrix4();return {group,capacity,cablesPerRack:144,update(ids,positions){for(const mesh of batches){mesh.count=ids.length;ids.forEach((id,i)=>{matrix.makeTranslation(positions[id].x,positions[id].y,positions[id].z);mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;}},setOpacity(opacity){materials.forEach(m=>{m.transparent=opacity<1;m.opacity=opacity;});}};
}
