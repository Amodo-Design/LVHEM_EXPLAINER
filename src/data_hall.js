import * as THREE from 'three';
import {roundedCablePath,ladderTray} from './cable_routes.js';
const V=THREE.Vector3;
// Architectural context, not a construction or cooling-capacity specification.
export function buildDataHall(layout){
 const group=new THREE.Group(),items=new Map(),matrix=new THREE.Matrix4();
 const xs=layout.positions.map(p=>p[0]),ys=layout.positions.map(p=>p[1]);
 const left=Math.min(...xs)-2.1,right=Math.max(...xs)+5.3,front=Math.min(...ys)-2.7,back=Math.max(...ys)+2.7;
 const colors={floor:0xd7ddd9,wall:0xe6eae5,steel:0x88958e,dark:0x424e4c,aisle:0xbccdc7,teal:0x5b999b,red:0xad7764,white:0xf5f4df};
 function box(color,x,y,z,w,d,h){if(!items.has(color))items.set(color,[]);items.get(color).push([x,y,z,w,d,h]);}
 box(colors.floor,(left+right)/2,(front+back)/2,-.15,right-left,back-front,.24);
 box(colors.wall,(left+right)/2,back,1.55,right-left,.16,3.3);
 box(colors.wall,left,(front+back)/2,.4,.16,back-front,.95);
 const grid=[];for(let x=Math.ceil(left/.6)*.6;x<right;x+=.6)grid.push(x,front,-.023,x,back,-.023);for(let y=Math.ceil(front/.6)*.6;y<back;y+=.6)grid.push(left,y,-.023,right,y,-.023);
 const lines=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(grid,3)),new THREE.LineBasicMaterial({color:0xbac4bf}));group.add(lines);
 for(let row=0;row<layout.rows;row++){
  const y=layout.positions[row*layout.cols][1];
  box(colors.aisle,(left+right)/2,y-.98,-.009,right-left-.4,.64,.008);
  // Clear aisle-edge stripes; no hot/cold containment claim for these liquid-cooled racks.
  for(const yy of[y-.62,y-1.35])box(colors.white,(left+right)/2,yy,0,right-left-.5,.035,.008);
  // Power busway and coolant supply/return above the rear service edge.
  box(colors.dark,(left+right)/2,y+.58,3.48,right-left-.65,.11,.09);
  for(const [yy,color]of[[y+.76,colors.teal],[y+.92,colors.red]])box(color,(left+right)/2,yy,3.65,right-left-.65,.065,.065);
  for(const x of[left+.35,right-.5]){box(colors.steel,x,y,1.95,.075,.075,3.9);box(colors.steel,x,y+.35,3.81,.08,1.6,.07);}
  // Row-end service/CDU cabinet. Illustrative hardware; not a storage move.
  box(colors.dark,right-1.25,y,1.05,.8,.9,2.1);
  box(colors.steel,right-1.25,y-.457,1.1,.65,.025,1.6);
  for(let z=.45;z<1.9;z+=.12)box(colors.dark,right-1.25,y-.476,z,.55,.015,.025);
  box(colors.teal,right-1.25,y-.49,1.96,.32,.018,.065);
  for(const xx of[right-1.4,right-1.1])box(colors.teal,xx,y+.3,2.8,.05,.05,1.5);
 }
 // Open overhead cross beams and luminaires leave the racks visible in the cutaway.
 for(const x of[left+.35,right-.5])box(colors.steel,x,(front+back)/2,3.95,.11,back-front,.12);
 for(const y of[front+.5,back-.5]){box(colors.steel,(left+right)/2,y,3.95,right-left,.10,.12);for(let x=left+2;x<right-1;x+=3)box(colors.white,x,y,3.84,1.8,.11,.05);}
 for(const[color,entries]of items){const m=new THREE.MeshStandardMaterial({color,roughness:.85,metalness:.1});const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),m,entries.length);entries.forEach(([x,y,z,w,d,h],i)=>{matrix.compose(new V(x,y,z),new THREE.Quaternion(),new V(w,d,h));mesh.setMatrixAt(i,matrix);});mesh.computeBoundingSphere();group.add(mesh);}
 return{group,frame:[new V(left,front,0),new V(right,back,0)],stats:{rows:layout.rows,serviceCabinets:layout.rows}};
}

// Persistent frontend access paths. The focused rack paths live in verification_scene;
// this adds all remaining rack paths, row access switches, paired aggregation, and border uplinks.
export function buildHallFrontend(layout,focusIds,frontendExit,focusTrunkX){
 const group=new THREE.Group(),matrix=new THREE.Matrix4(),boxes=[],paths=[],ports=[],focusSet=new Set(focusIds);
 const right=Math.max(...layout.positions.map(p=>p[0]))+1.4,back=Math.max(...layout.positions.map(p=>p[1]))+1.35;
 const spine=[new V(right,back,.75),new V(right+1.1,back,.75)],leaves=[];
 function path(points){paths.push(points);}
 function cabinet(p,w=.5,d=.42,h=.75){boxes.push([p.x,p.y,p.z,w,d,h]);for(let z=-.22;z<=.23;z+=.11)for(let x=-.16;x<.18;x+=.065)ports.push([p.x+x,p.y-d/2-.012,p.z+z]);}
 for(let row=0;row<layout.rows;row++){
  const y=layout.positions[row*layout.cols][1],leaf=new V(right,y-.9,.6);leaves.push(leaf);cabinet(leaf);
  spine.forEach((s,j)=>path([leaf,new V(right+.22+j*.12,leaf.y,2.65),new V(right+.22+j*.12,back,2.65),s]));
 }
 layout.positions.forEach((p,id)=>{if(focusSet.has(id))return;const row=Math.floor(id/layout.cols),leaf=leaves[row],lane=(id%layout.cols)*.005;const nic=new V(p[0]+.19,p[1]-.63,.4);path([nic,new V(nic.x,p[1]-.81,.25),new V(nic.x,p[1]-.88-lane,2.6115),new V(leaf.x,p[1]-.88-lane,2.6115),leaf]);});
 spine.forEach(s=>cabinet(s,.7,.6,1.3));
 const border=new V(right+1.3,back-2,.7);cabinet(border,.65,.5,1.2);spine.forEach(s=>path([s,new V(s.x,back-1,.35),new V(border.x,back-1,.35),border]));
 // Two schematic uplinks leave the customer-edge cabinet at the hall boundary.
 const boundary=frontendExit.clone();
 for(const offset of[-.05,.05])path([border.clone().add(new V(0,offset,0)),new V(right+2.8+offset,border.y,boundary.z),new V(right+2.8+offset,boundary.y+offset,boundary.z),boundary.clone().add(new V(0,offset,0))]);
 const cableMat=new THREE.MeshStandardMaterial({color:0x547d88,roughness:.8});
 const wireGeometries=paths.map(points=>{const indexed=new THREE.TubeGeometry(roundedCablePath(points,.085),96,.0045,6,false),geometry=indexed.toNonIndexed();indexed.dispose();return geometry;});
 const vertexCount=wireGeometries.reduce((n,g)=>n+g.attributes.position.array.length,0),pos=new Float32Array(vertexCount),norm=new Float32Array(vertexCount);let offset=0;
 for(const g of wireGeometries){pos.set(g.attributes.position.array,offset);norm.set(g.attributes.normal.array,offset);offset+=g.attributes.position.array.length;g.dispose();}
 const wires=new THREE.BufferGeometry();wires.setAttribute('position',new THREE.BufferAttribute(pos,3));wires.setAttribute('normal',new THREE.BufferAttribute(norm,3));group.add(new THREE.Mesh(wires,cableMat));
 const trayMat=new THREE.MeshStandardMaterial({color:0x7f898b,roughness:.6,metalness:.3});
 for(let row=0;row<layout.rows;row++){
  const y=layout.positions[row*layout.cols][1]-.88,start=layout.positions[row*layout.cols][0]-.2;
  const selected=focusIds.filter(id=>Math.floor(id/layout.cols)===row);
  const spans=selected.length?[[start,layout.positions[selected[0]][0]-.2],[focusTrunkX+.18,right]]:[[start,right]];
  for(const[a,b]of spans)if(b>a+.05)group.add(new THREE.Mesh(ladderTray(new V(a,y,2.60),new V(b,y,2.60)),trayMat));
 }
 group.add(new THREE.Mesh(ladderTray(new V(right+.3,layout.positions[0][1]-.95,2.60),new V(right+.3,back,2.60),.40),trayMat));

 const cases=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x354d52,roughness:.6}),boxes.length);boxes.forEach(([x,y,z,w,d,h],i)=>{matrix.compose(new V(x,y,z),new THREE.Quaternion(),new V(w,d,h));cases.setMatrixAt(i,matrix);});cases.computeBoundingSphere();group.add(cases);
 const sockets=new THREE.InstancedMesh(new THREE.BoxGeometry(.045,.015,.035),cableMat,ports.length);ports.forEach((p,i)=>{matrix.makeTranslation(...p);sockets.setMatrixAt(i,matrix);});sockets.computeBoundingSphere();group.add(sockets);
 return{group,stats:{retainedRackPaths:layout.positions.length,contextRackPaths:layout.positions.length-focusIds.length,rowAccessSwitches:leaves.length,aggregationSwitches:2,borderSwitches:1,focusUplinks:0,frontendDestination:'outside DC'}};
}
