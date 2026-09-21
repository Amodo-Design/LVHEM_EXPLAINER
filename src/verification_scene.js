import * as THREE from 'three';
import {roundedCablePath,ladderTray} from './cable_routes.js';
const V=THREE.Vector3;
export function buildVerificationScene(points,rackGeometry,rackMaterial,options={}){
 const root=new THREE.Group(),sections={},moving=[],labels=[],geometries=new Set(),materials=new Set(),textures=new Set();let phase=3,sampleActive=true,sampleIndex=null,checkState="idle";
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),cy=(minY+maxY)/2;
 const edge=options.frontendExit?new V(...options.frontendExit):new V(maxX+2.0,minY-.8,.75),aggregator=new V(maxX+2.4,cy+.35,.55),verifier=new V(maxX+4.5,cy,0),report=new V(maxX+8,cy,.8);
 function section(n){const g=new THREE.Group();root.add(g);sections[n]=g;return g;}
 const units=section('units'),storage=section('storage'),slow=section('slow'),taps=section('taps'),copies=section('copies'),verify=section('verify'),sampling=section('sampling'),reporting=section('reporting'),monitoring=section('monitoring');
 function material(color){const m=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.15});materials.add(m);return m;}
 const teal=material(options.frontendFromStart?0x168eaa:0x237f85),green=material(0x4d9479),orange=material(0xc37d3f),dark=material(0x333d41),silver=material(0x8f9b9a);
 function mesh(g,geometry,m,pos){geometries.add(geometry);const o=new THREE.Mesh(geometry,m);o.position.copy(pos);g.add(o);return o;}
 function box(g,p,size,m){return mesh(g,new THREE.BoxGeometry(...size),m,p);}
 function label(g,text,p,width=2.4,color='#254542'){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;const c=canvas.getContext('2d');c.fillStyle='#fbfaf5';c.fillRect(0,0,768,160);c.strokeStyle='#cbd5ce';c.lineWidth=3;c.strokeRect(2,2,764,156);c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';const lines=text.split('\n');c.font='600 31px Arial';lines.forEach((line,i)=>c.fillText(line,384,80+(i-(lines.length-1)/2)*43));const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.add(texture);const m=new THREE.SpriteMaterial({map:texture,depthTest:false});materials.add(m);const sprite=new THREE.Sprite(m);sprite.position.copy(p);sprite.scale.set(width,width*160/768,1);sprite.renderOrder=20;g.add(sprite);labels.push({sprite,text});if(options.simple)sprite.visible=false;return sprite;
 }
 function cable(g,positions,m,r=.012,packet=false,reverse=false){const curve=roundedCablePath(positions,.09);curve.tube=mesh(g,new THREE.TubeGeometry(curve,128,r,8,false),m,new V());curve.radius=r;if(packet){const dot=mesh(g,new THREE.SphereGeometry(.043,8,6),m,new V());moving.push({dot,curve,offset:moving.length*.137,reverse});}return curve;}
 function arrow(g,curve,t,m){const tip=curve.getPoint(t),dir=curve.getTangent(t);const o=mesh(g,new THREE.ConeGeometry(.048,.14,8),m,tip);o.quaternion.setFromUnitVectors(new V(0,1,0),dir);}
 const tapPoints=[],frontendRoutes=[],rowTrays=[],rowStraps=[];
 const jacket=[material(0x416f80),material(0x547d88),material(0x638c98)],trayMaterial=material(0x7f898b),strapMaterial=material(0x363c3e);
 const trunkX=maxX+1.0,trayZ=2.60;
 function frontendPoints(p,i){
  const col=i%5,nic=p.clone().add(new V(.19,-.635,.4)),tap=p.clone().add(new V(.275,-.70,1.13));
  const laneY=p.y-.88+(col-2)*.014,laneX=trunkX+(i-7)*.012;
  const end=edge.clone().add(new V(0,(i-7)*.012,0));end.z=trayZ+.0115;
  // A small restrained service loop at the rack, followed by a vertical guide.
  const before=[nic,new V(nic.x,nic.y-.12,.4),new V(p.x-.015,nic.y-.12,.4),new V(p.x-.015,nic.y-.12,.68),new V(tap.x,tap.y,.64),tap];
  const after=[tap,new V(tap.x,tap.y,1.37),new V(p.x+.275,laneY,1.37),new V(p.x+.275,laneY,trayZ+.0115),new V(laneX,laneY,trayZ+.0115),new V(laneX,end.y,trayZ+.0115),end];
  return{nic,tap,before,after,end};
 }
 function frontendCable(points,i){const curve=roundedCablePath(points);curve.radius=.0045;curve.tube=mesh(slow,new THREE.TubeGeometry(curve,128,curve.radius,8,false),jacket[i%3],new V());return curve;}
 function replaceGeometry(object,geometry){geometries.delete(object.geometry);object.geometry.dispose();object.geometry=geometry;geometries.add(geometry);}
 for(let row=0;row<3;row++){
  const p=points[row*5],restraints=new THREE.Group();slow.add(restraints);restraints.position.y=p.y-.88;rowStraps.push(restraints);for(let x=minX+.4;x<trunkX;x+=.85){box(restraints,new V(x,0,trayZ+.022),[.016,.085,.006],strapMaterial);for(const y of[-.042,.042])box(restraints,new V(x,y,trayZ+.011),[.016,.006,.024],strapMaterial);}rowTrays.push(mesh(slow,ladderTray(new V(p.x-.2,p.y-.88,trayZ),new V(trunkX+.18,p.y-.88,trayZ)),trayMaterial,new V()));
 }
 // Transverse collection tray and an independent exit tray remain after fast fabric removal.
 mesh(slow,ladderTray(new V(trunkX,edge.y-.15,trayZ),new V(trunkX,maxY-.65,trayZ),.40),trayMaterial,new V());
 mesh(slow,ladderTray(new V(trunkX,edge.y,trayZ),new V(edge.x,edge.y,trayZ),.40),trayMaterial,new V());
 for(let y=edge.y;y<maxY-.65;y+=2){box(slow,new V(trunkX+.25,y,1.3),[.035,.035,2.6],silver);box(slow,new V(trunkX+.1,y,2.56),[.38,.04,.035],silver);box(slow,new V(trunkX+.25,y,.018),[.16,.16,.036],silver);for(const dx of[-.06,.06])for(const dy of[-.06,.06])box(slow,new V(trunkX+.25+dx,y+dy,.039),[.018,.018,.012],dark);}
 for(let x=trunkX+.7;x<edge.x;x+=1.6){box(slow,new V(x,edge.y,trayZ+.022),[.018,.20,.006],strapMaterial);for(const y of[-.1,.1])box(slow,new V(x,edge.y+y,trayZ+.011),[.018,.006,.024],strapMaterial);}
 points.forEach((p,i)=>{
  // Boundaries are unit markers, not a claim that added physical spacing blocks covert channels.
  const corners=[[-.34,-.64],[.34,-.64],[.34,.64],[-.34,.64],[-.34,-.64]].map(([x,y])=>new V(p.x+x,p.y+y,.015));const geom=new THREE.BufferGeometry().setFromPoints(corners);geometries.add(geom);const lm=new THREE.LineBasicMaterial({color:0x268181});materials.add(lm);const unitOutline=new THREE.Line(geom,lm);units.add(unitOutline);const unitLabel=label(units,'U'+String(i+1).padStart(2,'0'),p.clone().add(new V(0,0,2.48)),.52);
  box(storage,p.clone().add(new V(0,-.48,.24)),[.42,.23,.1],dark);for(let d=0;d<6;d++)box(storage,p.clone().add(new V(-.16+d*.064,-.603,.24)),[.05,.008,.064],silver);
  const routes=frontendPoints(p,i),{nic,tap}=routes;tapPoints.push(tap);
  const nicMesh=box(slow,nic,[.027,.045,.022],silver);
  const before=frontendCable(routes.before,i),after=frontendCable(routes.after,i);
  before.tube.name='frontend-in-'+i;after.tube.name='frontend-out-'+i;
  const guide=new THREE.Group();slow.add(guide);guide.position.copy(p);
  box(guide,new V(.292,-.66,1.39),[.026,.025,1.65],dark);
  for(const z of[.77,1.6,1.98,2.25])box(guide,new V(.275,-.715,z),[.039,.12,.018],strapMaterial);
  box(guide,new V(.275,-.71,.95),[.024,.02,.045],silver);
  // Tray stanchion at the rack edge, tied back to the frame.
  box(guide,new V(.29,-.74,2.41),[.022,.022,.40],silver);
  box(guide,new V(.29,-.81,2.575),[.023,.19,.023],silver);
  frontendRoutes.push({before,after,nicMesh,guide,unitOutline,unitLabel,base:p.clone(),last:p.clone(),end:routes.end});
  box(taps,tap.clone().add(new V(0,.058,0)),[.17,.009,.28],silver);
  box(taps,tap,[.135,.11,.24],orange);
  box(taps,tap.clone().add(new V(0,-.056,.025)),[.088,.003,.045],silver);
  for(const z of[-.085,.085])box(taps,tap.clone().add(new V(.049,-.058,z)),[.009,.005,.009],dark);
  box(taps,tap.clone().add(new V(-.043,-.058,-.068)),[.006,.004,.006],green);
  for(const z of[-.12,.12]){box(taps,tap.clone().add(new V(0,0,z)),[.032,.035,.021],dark);box(taps,tap.clone().add(new V(0,0,z*1.17)),[.016,.024,.028],silver);}
  const monitor= tap.clone().add(new V(.072,0,.02));
  const copyLane=trunkX-.07+i*.009;
  const copy=cable(copies,[monitor,new V(p.x+.36,p.y-.70,monitor.z),new V(p.x+.36,p.y-.70,2.69),new V(p.x+.36,p.y-.81,2.69),new V(copyLane,p.y-.81,2.69),new V(copyLane,cy+.35,2.69),new V(aggregator.x,cy+.35,2.69),aggregator],green,.0045,true);arrow(copies,copy,.94,green);

 });
 if(!options.frontendExit){box(slow,edge,[.6,.4,.65],dark);for(let i=0;i<4;i++)box(slow,edge.clone().add(new V(0,-.206,-.19+i*.12)),[.48,.008,.035],silver);
 label(slow,'Remaining frontend\n~1 Gb/s per unit · proposal',edge.clone().add(new V(0,0,.7)),2.65);}
 label(storage,'Local cold storage\nKV cache / approved weights',points[0].clone().add(new V(0,-1.02,.7)),2.2);
 label(taps,'Active FPGA TAPs\nForward traffic + copy',tapPoints[0].clone().add(new V(-.3,-.3,.55)),2.15,'#946035');
 box(copies,aggregator,[.48,.36,.2],green);for(let i=0;i<8;i++)box(copies,aggregator.clone().add(new V(-.18+i*.05,-.185,0)),[.032,.008,.052],dark);
 const verifyMesh=new THREE.Mesh(rackGeometry,rackMaterial.clone());materials.add(verifyMesh.material);verifyMesh.position.copy(verifier);verify.add(verifyMesh);box(verify,verifier.clone().add(new V(0,-.6,.15)),[.6,.025,.2],green);
 label(verify,'VERIFIER · recomputation\nOne model-capable unit',verifier.clone().add(new V(0,0,2.7)),2.75,'#356d58');
 label(copies,'Packet-copy aggregation\nOne-way data feed',aggregator.clone().add(new V(0,.1,.55)),2.2,'#356d58');
 const inbound=cable(copies,[aggregator,aggregator.clone().add(new V(.5,0,.2)),verifier.clone().add(new V(-.55,-.75,.8)),verifier.clone().add(new V(-.2,-.63,1.0))],green,.019,true);arrow(copies,inbound,.82,green);
 // A visibly separate server/storage cabinet stands for the verifier's extra support hardware.
 box(verify,verifier.clone().add(new V(.75,0,.65)),[.44,.65,1.3],dark);for(let i=0;i<6;i++)box(verify,verifier.clone().add(new V(.75,-.33,.2+i*.17)),[.36,.01,.08],silver);
 const sampleRing=mesh(sampling,new THREE.TorusGeometry(.47,.022,8,48),green,new V());sampleRing.rotation.x=0;
 label(sampling,options.simple?'Replay a sampled request\nCompare the response':'Sample requests → recompute\nCompare using DiFR',verifier.clone().add(new V(0,-.9,1.65)),2.6,'#356d58');
 label(sampling,options.simple?'Same approved model\nReady before checks begin':'Approved weights + same preprocessing\nLoaded at setup · protocol TBD',verifier.clone().add(new V(.8,.1,3.2)),3.3);
 const reportTap=verifier.clone().add(new V(1.7,-.25,.65));box(reporting,reportTap,[.27,.2,.15],orange);
 const reportCurve=cable(reporting,[verifier.clone().add(new V(.2,-.6,.75)),reportTap,report.clone().add(new V(-.5,-.2,0)),report],orange,.015,true);arrow(reporting,reportCurve,.87,orange);
 box(reporting,report,[.6,.25,.45],silver);label(reporting,'External verifier\nRestricted pass / fail schema',report.clone().add(new V(.1,0,.7)),2.9,'#946035');label(reporting,'Prover checks report format\nNo raw tokens or weights',reportTap.clone().add(new V(0,-.6,.5)),2.55,'#946035');
 const boundary=new THREE.BufferGeometry().setFromPoints([new V(maxX+6.1,minY-2,0),new V(maxX+6.1,maxY+2,0)]);geometries.add(boundary);const dash=new THREE.LineDashedMaterial({color:0xc37d3f,dashSize:.2,gapSize:.12});materials.add(dash);const border=new THREE.Line(boundary,dash);border.computeLineDistances();reporting.add(border);
 label(reporting,'DATA CENTRE BOUNDARY',new V(maxX+6.1,maxY+1.3,.4),2.4,'#946035');
 [points[0],points.at(-1),verifier].forEach(p=>{const at=p.clone().add(new V(-.6,-.75,.35));box(monitoring,at,[.16,.16,.2],orange);mesh(monitoring,new THREE.CylinderGeometry(.018,.018,.38,6),silver,at.clone().add(new V(0,0,.2))).rotation.x=Math.PI/2;for(const r of[.2,.32,.44]){const geo=new THREE.RingGeometry(r,r+.009,40);mesh(monitoring,geo,new THREE.MeshBasicMaterial({color:0xc37d3f,side:THREE.DoubleSide}),at.clone().add(new V(0,0,-.24)));}});
 label(monitoring,'Also monitor undeclared channels\nPower · EM / RF · acoustic · management',new V((minX+maxX)/2,maxY+1.1,2.8),4,'#946035');
 function setFrontendLayout(locations){
  let changed=false;
  locations.forEach((p,i)=>{
   const routes=frontendRoutes[i];if(routes.last.distanceToSquared(p)<1e-12)return;changed=true;
   routes.last.copy(p);routes.unitOutline.position.copy(p).sub(routes.base);routes.unitLabel.position.copy(p).add(new V(0,0,2.48));routes.guide.position.copy(p);
   const next=frontendPoints(p,i);routes.nicMesh.position.copy(next.nic);routes.end=next.end;
   for(const key of ['before','after']){const old=routes[key],curve=roundedCablePath(next[key]);curve.radius=old.radius;curve.tube=old.tube;replaceGeometry(curve.tube,new THREE.TubeGeometry(curve,128,curve.radius,8,false));routes[key]=curve;}
  });
  if(changed)for(let row=0;row<3;row++){const p=locations[row*5];rowStraps[row].position.y=p.y-.88;rowStraps[row].children.forEach((strap,j)=>{const x=p.x+.4+Math.floor(j/3)*.85;strap.position.x=x;strap.visible=x<trunkX-.15;});replaceGeometry(rowTrays[row],ladderTray(new V(p.x-.2,p.y-.88,trayZ),new V(trunkX+.18,p.y-.88,trayZ)));}
 }

 function setTapInstall(progress){taps.position.z=(1-progress)*1.1;}
 function setPhase(n){phase=n;units.visible=n>=3;storage.visible=options.storage!==false&&n>=4;slow.visible=options.frontendFromStart||n>=4;taps.visible=n>=5;copies.visible=n>=6;verify.visible=n>=6;sampling.visible=n>=7;reporting.visible=n>=8;monitoring.visible=n>=9;}
 function update(t){if(!matchMedia('(prefers-reduced-motion:reduce)').matches)for(const p of moving)p.dot.position.copy(p.curve.getPoint((p.reverse?1:0)+(p.reverse?-1:1)*((t*.00013+p.offset)%1)));else for(const p of moving)p.dot.position.copy(p.curve.getPoint(.5));sampleRing.visible=phase>=7&&sampleActive;if(phase>=7&&sampleActive){const index=sampleIndex??Math.floor(t/2300)%points.length;sampleRing.position.copy(points[index]).add(new V(0,0,2.45));sampleRing.visible=true;}verifyMesh.material.emissive.set(checkState==='replay'?0x164936:checkState==='fail'?0x531f18:0x000000);verifyMesh.material.emissiveIntensity=checkState==='replay'?.6+.4*Math.sin(t*.005):.6;}
 function cameraPoints(n){return [...points,...(n>=4&&!options.frontendExit?[edge]:[]),...(n>=6?[verifier,verifier.clone().add(new V(1,0,0))]:[]),...(n>=8?[report]:[])];}
 setPhase(3);return{root,frontendEdge:new V(edge.x,edge.y,trayZ+.0115),frontendTrunkX:trunkX,setPhase,setFrontendLayout,setTapInstall,update,cameraPoints,annotations(){return labels.filter(({sprite,text})=>{let p=sprite.parent;while(p){if(!p.visible)return false;p=p.parent;}return !/^U\d/.test(text);}).map(({sprite,text})=>({text,position:sprite.getWorldPosition(new V())}));},setSampling(active,index=null,state="idle"){sampleActive=active;sampleIndex=index;checkState=state;},diagnostics(){return{phase,units:points.length,frontendCableDiameterMM:9,frontendRouting:'rack guides / row trays / cross-aisle tray / DC exit',frontendTrafficAnimated:moving.some(p=>p.dot.parent===slow),frontendCabinet:!options.frontendExit,frontendDestination:options.frontendExit?'outside DC':'local switch',frontendObjects:frontendRoutes.flatMap(r=>[r.before.tube.id,r.after.tube.id]),frontendEndpointError:Math.max(...frontendRoutes.map(r=>r.before.points[0].distanceTo(r.nicMesh.position)+r.before.points.at(-1).distanceTo(r.after.points[0])+r.after.points.at(-1).distanceTo(r.end))),slowLinks:slow.visible?points.length:0,taps:phase>=5?points.length:0,verifierUnits:phase>=6?1:0,copyDirection:'TAP to verifier only',reporting:phase>=8?'restricted schema':'hidden',outOfBandMonitoring:phase>=9};},dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
