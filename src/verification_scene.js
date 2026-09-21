import * as THREE from 'three';
import {roundedCablePath,ladderTray} from './cable_routes.js';
const V=THREE.Vector3;
export function buildVerificationScene(points,rackGeometry,rackMaterial,options={}){
 const root=new THREE.Group(),sections={},labels=[],geometries=new Set(),materials=new Set(),textures=new Set();let phase=3,sampleActive=true,sampleIndex=null,checkState="idle";
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),cy=(minY+maxY)/2;
 const edge=options.frontendExit?new V(...options.frontendExit):new V(maxX+2.0,minY-.8,.75),sharedTap=new V(edge.x-1.7,edge.y,2.6115),verifier=new V(edge.x-4.3,edge.y+2.6,0);
 function section(n){const g=new THREE.Group();root.add(g);sections[n]=g;return g;}
 const units=section('units'),storage=section('storage'),slow=section('slow'),taps=section('taps'),copies=section('copies'),verify=section('verify'),sampling=section('sampling'),reporting=section('reporting'),monitoring=section('monitoring');
 function material(color){const m=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.15});materials.add(m);return m;}
 const teal=material(options.frontendFromStart?0x168eaa:0x237f85),green=material(0x4d9479),orange=material(0xc37d3f),dark=material(0x333d41),silver=material(0x8f9b9a);
 function mesh(g,geometry,m,pos){geometries.add(geometry);const o=new THREE.Mesh(geometry,m);o.position.copy(pos);g.add(o);return o;}
 function box(g,p,size,m){return mesh(g,new THREE.BoxGeometry(...size),m,p);}
 function label(g,text,p,width=2.4,color='#254542'){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;const c=canvas.getContext('2d');c.fillStyle='#fbfaf5';c.fillRect(0,0,768,160);c.strokeStyle='#cbd5ce';c.lineWidth=3;c.strokeRect(2,2,764,156);c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';const lines=text.split('\n');c.font='600 31px Arial';lines.forEach((line,i)=>c.fillText(line,384,80+(i-(lines.length-1)/2)*43));const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.add(texture);const m=new THREE.SpriteMaterial({map:texture,depthTest:false});materials.add(m);const sprite=new THREE.Sprite(m);sprite.position.copy(p);sprite.scale.set(width,width*160/768,1);sprite.renderOrder=20;g.add(sprite);labels.push({sprite,text});if(options.simple)sprite.visible=false;return sprite;
 }
 function cable(g,positions,m,r=.012){const curve=roundedCablePath(positions,.09);curve.tube=mesh(g,new THREE.TubeGeometry(curve,128,r,8,false),m,new V());curve.radius=r;return curve;}

 const columns=options.columns??Math.min(5,points.length),rows=Math.ceil(points.length/columns),laneCenter=(points.length-1)/2;
 const frontendRoutes=[],rowTrays=[],rowStraps=[];
 const jacket=[material(0x416f80),material(0x547d88),material(0x638c98)],trayMaterial=material(0x7f898b),strapMaterial=material(0x363c3e);
 const trunkX=maxX+1.0,trayZ=2.60;
 function frontendPoints(p,i){
  const col=i%columns,nic=p.clone().add(new V(.19,-.635,.4)),tap=p.clone().add(new V(.275,-.70,1.13));
  const laneY=p.y-.88+(col-(columns-1)/2)*.014,laneX=trunkX+(i-laneCenter)*.012;
  const end=edge.clone().add(new V(0,(i-laneCenter)*.012,0));end.z=trayZ+.0115;
  // A small restrained service loop at the rack, followed by a vertical guide.
  const before=[nic,new V(nic.x,nic.y-.12,.4),new V(p.x-.015,nic.y-.12,.4),new V(p.x-.015,nic.y-.12,.68),new V(tap.x,tap.y,.64),tap];
  const tapLane=edge.y+(i-laneCenter)*.075;
  const after=[tap,new V(tap.x,tap.y,1.37),new V(p.x+.275,laneY,1.37),new V(p.x+.275,laneY,trayZ+.0115),new V(laneX,laneY,trayZ+.0115),new V(laneX,end.y,trayZ+.0115),new V(sharedTap.x-.6,end.y,end.z),new V(sharedTap.x-.26,tapLane,end.z),new V(sharedTap.x+.26,tapLane,end.z),new V(sharedTap.x+.6,end.y,end.z),end];
  return{nic,tap,before,after,end};
 }
 function frontendCable(points,i){const curve=roundedCablePath(points);curve.radius=.0045;curve.tube=mesh(slow,new THREE.TubeGeometry(curve,128,curve.radius,8,false),jacket[i%3],new V());return curve;}
 function replaceGeometry(object,geometry){geometries.delete(object.geometry);object.geometry.dispose();object.geometry=geometry;geometries.add(geometry);}
 for(let row=0;row<rows;row++){
  const p=points[row*columns],restraints=new THREE.Group();slow.add(restraints);restraints.position.y=p.y-.88;rowStraps.push(restraints);for(let x=minX+.4;x<trunkX;x+=.85){box(restraints,new V(x,0,trayZ+.022),[.016,.085,.006],strapMaterial);for(const y of[-.042,.042])box(restraints,new V(x,y,trayZ+.011),[.016,.006,.024],strapMaterial);}rowTrays.push(mesh(slow,ladderTray(new V(p.x-.2,p.y-.88,trayZ),new V(trunkX+.18,p.y-.88,trayZ)),trayMaterial,new V()));
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
  const routes=frontendPoints(p,i),{nic}=routes;
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

 });
 if(!options.frontendExit){box(slow,edge,[.6,.4,.65],dark);for(let i=0;i<4;i++)box(slow,edge.clone().add(new V(0,-.206,-.19+i*.12)),[.48,.008,.035],silver);
 label(slow,'Remaining frontend\n~1 Gb/s per unit · proposal',edge.clone().add(new V(0,0,.7)),2.65);}
 label(storage,'Local cold storage\nKV cache / approved weights',points[0].clone().add(new V(0,-1.02,.7)),2.2);
 // One three-channel inline TAP spans the existing bundle immediately before the DC exit.
 box(taps,sharedTap.clone().add(new V(0,0,-.025)),[.54,.46,.24],orange);
 box(taps,sharedTap.clone().add(new V(0,0,-.16)),[.68,.52,.035],silver);
 box(taps,sharedTap.clone().add(new V(0,-.04,.102)),[.30,.17,.008],silver);
 for(let i=0;i<points.length;i++)for(const side of[-1,1]){
  const at=new V(sharedTap.x+side*.275,edge.y+(i-laneCenter)*.075,sharedTap.z);
  box(taps,at,[.018,.043,.032],dark);box(taps,at.clone().add(new V(side*.025,0,0)),[.034,.023,.021],silver);
 }
 for(const x of[-.22,.22])for(const y of[-.19,.19])box(taps,sharedTap.clone().add(new V(x,y,.10)),[.014,.014,.011],dark);
 // The copy output is a separate static branch; all three originals continue through the TAP.
 const copyStart=sharedTap.clone().add(new V(0,.24,0));
 box(taps,copyStart,[.05,.025,.033],green);
 mesh(copies,ladderTray(new V(sharedTap.x,edge.y+.25,trayZ),new V(sharedTap.x,verifier.y-.72,trayZ),.18),trayMaterial,new V());
 mesh(copies,ladderTray(new V(sharedTap.x,verifier.y-.72,trayZ),new V(verifier.x+.22,verifier.y-.72,trayZ),.18),trayMaterial,new V());
 for(let i=0;i<3;i++){
  const offset=(i-1)*.014;
  cable(copies,[copyStart.clone().add(new V(offset,0,0)),new V(sharedTap.x+offset,verifier.y-.72+offset,2.62),new V(verifier.x+.22,verifier.y-.72+offset,2.62),new V(verifier.x+.22,verifier.y-.72+offset,1.2),new V(verifier.x+.22+offset,verifier.y-.42,1.2)],green,.006,false);
 }
 // Rack-mounted cable guide and connector boots terminate the static copy branch.
 box(verify,verifier.clone().add(new V(.29,-.69,1.85)),[.025,.025,1.55],dark);
 box(verify,verifier.clone().add(new V(.26,-.69,2.58)),[.09,.15,.025],silver);
 for(let i=0;i<3;i++)box(verify,verifier.clone().add(new V(.22+(i-1)*.014,-.423,1.2)),[.012,.035,.019],green);
 // The verifier is exactly one ordinary rack using the same geometry/material as compute.
 const verifyMesh=new THREE.Mesh(rackGeometry,rackMaterial.clone());materials.add(verifyMesh.material);verifyMesh.position.copy(verifier);verify.add(verifyMesh);
 const sampleRing=mesh(sampling,new THREE.TorusGeometry(.47,.022,8,48),green,new V());sampleRing.rotation.x=0;
 label(sampling,options.simple?'Replay a sampled request\nCompare the response':'Sample requests → recompute\nCompare using DiFR',verifier.clone().add(new V(0,-.9,1.65)),2.6,'#356d58');
 label(sampling,options.simple?'Same approved model\nReady before checks begin':'Approved weights + same preprocessing\nLoaded at setup · protocol TBD',verifier.clone().add(new V(.8,.1,3.2)),3.3);
 // Restricted reporting is a static line, with no extra server, cabinet or animated marker.
 cable(reporting,[verifier.clone().add(new V(.2,-.63,.75)),new V(verifier.x+.5,verifier.y-.85,.75),new V(edge.x,verifier.y-.85,.75)],orange,.005,false);
 const boundary=new THREE.BufferGeometry().setFromPoints([new V(edge.x-.9,edge.y-1,.012),new V(edge.x-.9,verifier.y+1.1,.012)]);geometries.add(boundary);
 const boundaryMat=new THREE.LineDashedMaterial({color:0x566962,dashSize:.18,gapSize:.10});materials.add(boundaryMat);const border=new THREE.Line(boundary,boundaryMat);border.computeLineDistances();slow.add(border);
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
  if(changed)for(let row=0;row<rows;row++){const p=locations[row*columns];rowStraps[row].position.y=p.y-.88;rowStraps[row].children.forEach((strap,j)=>{const x=p.x+.4+Math.floor(j/3)*.85;strap.position.x=x;strap.visible=x<trunkX-.15;});replaceGeometry(rowTrays[row],ladderTray(new V(p.x-.2,p.y-.88,trayZ),new V(trunkX+.18,p.y-.88,trayZ)));}
 }

 function setTapInstall(progress){taps.position.z=(1-progress)*1.1;}
 function setPhase(n){phase=n;units.visible=n>=3;storage.visible=options.storage!==false&&n>=4;slow.visible=options.frontendFromStart||n>=4;taps.visible=n>=5;copies.visible=n>=6;verify.visible=n>=6;sampling.visible=n>=7;reporting.visible=n>=8;monitoring.visible=n>=9;}
 function update(t){sampleRing.visible=phase>=7&&sampleActive;if(phase>=7&&sampleActive){const index=sampleIndex??Math.floor(t/2300)%points.length;sampleRing.position.copy(points[index]).add(new V(0,0,2.45));sampleRing.visible=true;}verifyMesh.material.emissive.set(options.palette?(checkState==='replay'||checkState==='pass'?options.palette.green:checkState==='fail'?options.palette.red:0x000000):(checkState==='replay'?0x164936:checkState==='fail'?0x531f18:0x000000));verifyMesh.material.emissiveIntensity=checkState==='replay'?.6+.4*Math.sin(t*.005):.6;}
 function cameraPoints(n){return [...points,...(n>=5?[sharedTap,new V(edge.x,edge.y,0)]:[]),...(n>=6?[verifier]:[])];}
 setPhase(3);return{root,frontendEdge:new V(edge.x,edge.y,trayZ+.0115),frontendTrunkX:trunkX,setPhase,setFrontendLayout,setTapInstall,update,cameraPoints,annotations(){return labels.filter(({sprite,text})=>{let p=sprite.parent;while(p){if(!p.visible)return false;p=p.parent;}return !/^U\d/.test(text);}).map(({sprite,text})=>({text,position:sprite.getWorldPosition(new V())}));},setSampling(active,index=null,state="idle"){sampleActive=active;sampleIndex=index;checkState=state;},diagnostics(){return{phase,units:points.length,frontendCableDiameterMM:9,frontendRouting:'rack guides / row trays / cross-aisle tray / DC exit',frontendTrafficAnimated:false,frontendCabinet:!options.frontendExit,frontendDestination:options.frontendExit?'outside DC':'local switch',frontendObjects:frontendRoutes.flatMap(r=>[r.before.tube.id,r.after.tube.id]),frontendEndpointError:Math.max(...frontendRoutes.map(r=>r.before.points[0].distanceTo(r.nicMesh.position)+r.before.points.at(-1).distanceTo(r.after.points[0])+r.after.points.at(-1).distanceTo(r.end))),slowLinks:slow.visible?points.length:0,taps:phase>=5?1:0,tapChannels:points.length,tapLocation:sharedTap.toArray(),verifierLocation:verifier.toArray(),verifierExtraCabinets:0,packetMarkers:0,verifierUnits:phase>=6?1:0,copyDirection:'TAP to verifier only',reporting:phase>=8?'restricted schema':'hidden',outOfBandMonitoring:phase>=9};},dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
