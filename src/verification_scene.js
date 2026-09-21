import * as THREE from 'three';
const V=THREE.Vector3;
export function buildVerificationScene(points,rackGeometry,rackMaterial){
 const root=new THREE.Group(),sections={},moving=[],labels=[],geometries=new Set(),materials=new Set(),textures=new Set();let phase=3;
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),cy=(minY+maxY)/2;
 const edge=new V(maxX+2.0,minY-.8,.75),aggregator=new V(maxX+2.4,cy+.35,.55),verifier=new V(maxX+4.5,cy,0),report=new V(maxX+8,cy,.8);
 function section(n){const g=new THREE.Group();root.add(g);sections[n]=g;return g;}
 const units=section('units'),storage=section('storage'),slow=section('slow'),taps=section('taps'),copies=section('copies'),verify=section('verify'),sampling=section('sampling'),reporting=section('reporting'),monitoring=section('monitoring');
 function material(color){const m=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.15});materials.add(m);return m;}
 const teal=material(0x237f85),green=material(0x4d9479),orange=material(0xc37d3f),dark=material(0x333d41),silver=material(0x8f9b9a);
 function mesh(g,geometry,m,pos){geometries.add(geometry);const o=new THREE.Mesh(geometry,m);o.position.copy(pos);g.add(o);return o;}
 function box(g,p,size,m){return mesh(g,new THREE.BoxGeometry(...size),m,p);}
 function label(g,text,p,width=2.4,color='#254542'){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;const c=canvas.getContext('2d');c.fillStyle='#fbfaf5';c.fillRect(0,0,768,160);c.strokeStyle='#cbd5ce';c.lineWidth=3;c.strokeRect(2,2,764,156);c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';const lines=text.split('\n');c.font='600 31px Arial';lines.forEach((line,i)=>c.fillText(line,384,80+(i-(lines.length-1)/2)*43));const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.add(texture);const m=new THREE.SpriteMaterial({map:texture,depthTest:false});materials.add(m);const sprite=new THREE.Sprite(m);sprite.position.copy(p);sprite.scale.set(width,width*160/768,1);sprite.renderOrder=20;g.add(sprite);labels.push(sprite);return sprite;
 }
 function cable(g,positions,m,r=.012,packet=false,reverse=false){const curve=new THREE.CatmullRomCurve3(positions.map(p=>p.clone()),false,'centripetal');mesh(g,new THREE.TubeGeometry(curve,36,r,6,false),m,new V());if(packet){const dot=mesh(g,new THREE.SphereGeometry(.043,8,6),m,new V());moving.push({dot,curve,offset:moving.length*.137,reverse});}return curve;}
 function arrow(g,curve,t,m){const tip=curve.getPoint(t),dir=curve.getTangent(t);const o=mesh(g,new THREE.ConeGeometry(.048,.14,8),m,tip);o.quaternion.setFromUnitVectors(new V(0,1,0),dir);}
 const tapPoints=[];
 points.forEach((p,i)=>{
  // Boundaries are unit markers, not a claim that added physical spacing blocks covert channels.
  const corners=[[-.34,-.64],[.34,-.64],[.34,.64],[-.34,.64],[-.34,-.64]].map(([x,y])=>new V(p.x+x,p.y+y,.015));const geom=new THREE.BufferGeometry().setFromPoints(corners);geometries.add(geom);const lm=new THREE.LineBasicMaterial({color:0x268181});materials.add(lm);units.add(new THREE.Line(geom,lm));label(units,'U'+String(i+1).padStart(2,'0'),p.clone().add(new V(0,0,2.48)),.52);
  box(storage,p.clone().add(new V(0,-.48,.24)),[.42,.23,.1],dark);for(let d=0;d<6;d++)box(storage,p.clone().add(new V(-.16+d*.064,-.603,.24)),[.05,.008,.064],silver);
  const nic=p.clone().add(new V(.19,-.63,.4)),tap=p.clone().add(new V(.46,-.91,.25));tapPoints.push(tap);
  box(slow,nic,[.055,.06,.035],silver);
  const before=cable(slow,[nic,nic.clone().add(new V(0,-.08,-.08)),tap],teal,.011,true);
  const laneY=minY-1.05-i*.021;
  const after=cable(slow,[tap,new V(tap.x+.16,tap.y-.13,.09),new V(tap.x+.2,laneY,.075),new V(edge.x-.3,laneY,.075),edge],teal,.011,true,i%2===0);
  box(taps,tap,[.24,.17,.13],orange);for(const x of[-.065,.065])box(taps,tap.clone().add(new V(x,-.09,0)),[.038,.012,.03],dark);
  const monitor= tap.clone().add(new V(.125,0,0));
  const copy=cable(copies,[monitor,new V(monitor.x+.13,monitor.y,.32),new V(maxX+.85+i*.024,monitor.y,.32),new V(maxX+1.1+i*.024,cy+.35,.32),aggregator],green,.009,true);arrow(copies,copy,.9,green);
 });
 box(slow,edge,[.6,.4,.65],dark);for(let i=0;i<4;i++)box(slow,edge.clone().add(new V(0,-.206,-.19+i*.12)),[.48,.008,.035],silver);
 label(slow,'Remaining frontend\n~1 Gb/s per unit · proposal',edge.clone().add(new V(0,0,.7)),2.65);
 label(storage,'Local cold storage\nKV cache / approved weights',points[0].clone().add(new V(0,-1.02,.7)),2.2);
 label(taps,'Active FPGA TAPs\nForward traffic + copy',tapPoints[0].clone().add(new V(-.3,-.3,.55)),2.15,'#946035');
 box(copies,aggregator,[.48,.36,.2],green);for(let i=0;i<8;i++)box(copies,aggregator.clone().add(new V(-.18+i*.05,-.185,0)),[.032,.008,.052],dark);
 const verifyMesh=new THREE.Mesh(rackGeometry,rackMaterial.clone());materials.add(verifyMesh.material);verifyMesh.position.copy(verifier);verify.add(verifyMesh);box(verify,verifier.clone().add(new V(0,-.6,.15)),[.6,.025,.2],green);
 label(verify,'VERIFIER · recomputation\nOne model-capable unit',verifier.clone().add(new V(0,0,2.7)),2.75,'#356d58');
 label(copies,'Packet-copy aggregation\nOne-way data feed',aggregator.clone().add(new V(0,.1,.55)),2.2,'#356d58');
 const inbound=cable(copies,[aggregator,aggregator.clone().add(new V(.5,0,.2)),verifier.clone().add(new V(-.55,-.75,.8)),verifier.clone().add(new V(-.2,-.63,1.0))],green,.019,true);arrow(copies,inbound,.82,green);
 // A visibly separate server/storage cabinet stands for the verifier's extra support hardware.
 box(verify,verifier.clone().add(new V(.75,0,.65)),[.44,.65,1.3],dark);for(let i=0;i<6;i++)box(verify,verifier.clone().add(new V(.75,-.33,.2+i*.17)),[.36,.01,.08],silver);
 const sampleRing=mesh(sampling,new THREE.TorusGeometry(.47,.022,8,48),green,new V());sampleRing.rotation.x=Math.PI/2;
 label(sampling,'Sample requests → recompute\nCompare using DiFR',verifier.clone().add(new V(0,-.9,1.65)),2.6,'#356d58');
 label(sampling,'Approved weights + same preprocessing\nLoaded at setup · protocol TBD',verifier.clone().add(new V(.8,.1,3.2)),3.3);
 const reportTap=verifier.clone().add(new V(1.7,-.25,.65));box(reporting,reportTap,[.27,.2,.15],orange);
 const reportCurve=cable(reporting,[verifier.clone().add(new V(.2,-.6,.75)),reportTap,report.clone().add(new V(-.5,-.2,0)),report],orange,.015,true);arrow(reporting,reportCurve,.87,orange);
 box(reporting,report,[.6,.25,.45],silver);label(reporting,'External verifier\nRestricted pass / fail schema',report.clone().add(new V(.1,0,.7)),2.9,'#946035');label(reporting,'Prover checks report format\nNo raw tokens or weights',reportTap.clone().add(new V(0,-.6,.5)),2.55,'#946035');
 const boundary=new THREE.BufferGeometry().setFromPoints([new V(maxX+6.1,minY-2,0),new V(maxX+6.1,maxY+2,0)]);geometries.add(boundary);const dash=new THREE.LineDashedMaterial({color:0xc37d3f,dashSize:.2,gapSize:.12});materials.add(dash);const border=new THREE.Line(boundary,dash);border.computeLineDistances();reporting.add(border);
 label(reporting,'DATA CENTRE BOUNDARY',new V(maxX+6.1,maxY+1.3,.4),2.4,'#946035');
 [points[0],points.at(-1),verifier].forEach(p=>{const at=p.clone().add(new V(-.6,-.75,.35));box(monitoring,at,[.16,.16,.2],orange);mesh(monitoring,new THREE.CylinderGeometry(.018,.018,.38,6),silver,at.clone().add(new V(0,0,.2))).rotation.x=Math.PI/2;for(const r of[.2,.32,.44]){const geo=new THREE.RingGeometry(r,r+.009,40);mesh(monitoring,geo,new THREE.MeshBasicMaterial({color:0xc37d3f,side:THREE.DoubleSide}),at.clone().add(new V(0,0,-.24)));}});
 label(monitoring,'Also monitor undeclared channels\nPower · EM / RF · acoustic · management',new V((minX+maxX)/2,maxY+1.1,2.8),4,'#946035');
 function setPhase(n){phase=n;units.visible=n>=3;storage.visible=n>=4;slow.visible=n>=4;taps.visible=n>=5;copies.visible=n>=6;verify.visible=n>=6;sampling.visible=n>=7;reporting.visible=n>=8;monitoring.visible=n>=9;}
 function update(t){if(!matchMedia('(prefers-reduced-motion:reduce)').matches)for(const p of moving)p.dot.position.copy(p.curve.getPoint((p.reverse?1:0)+(p.reverse?-1:1)*((t*.00013+p.offset)%1)));else for(const p of moving)p.dot.position.copy(p.curve.getPoint(.5));if(phase>=7){const index=Math.floor(t/2300)%points.length;sampleRing.position.copy(points[index]).add(new V(0,0,2.45));sampleRing.visible=true;}}
 function cameraPoints(n){return [...points,...(n>=4?[edge]:[]),...(n>=6?[verifier,verifier.clone().add(new V(1,0,0))]:[]),...(n>=8?[report]:[])];}
 setPhase(3);return{root,setPhase,update,cameraPoints,diagnostics(){return{phase,units:points.length,slowLinks:phase>=4?points.length:0,taps:phase>=5?points.length:0,verifierUnits:phase>=6?1:0,copyDirection:'TAP to verifier only',reporting:phase>=8?'restricted schema':'hidden',outOfBandMonitoring:phase>=9};},dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
