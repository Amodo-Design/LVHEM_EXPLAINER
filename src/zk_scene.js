import * as THREE from 'three';
import {roundedCablePath,ladderTray} from './cable_routes.js';
import {buildVerificationScene} from './verification_scene.js?v=photo-callouts';
import {iceberg} from './iceberg_theme.js';

// The zero-knowledge installation, drawn into the same data hall as the
// recomputation walkthrough. It reuses that scene's inference units and their
// frontend cabling, and replaces the TAP and the verifier rack with:
//   - the Network Certifier: a sealed inline unit on the exit tray. Every link
//     out of the data centre passes through it, and it keeps the record.
//   - the prover: one ordinary rack inside the boundary, beside the model.
//   - the verifier: a small console outside the boundary. No rack, no model.
// Phases: <=4 units only · 5 certifier + verifier · 6 prover · 7 seal · 8 serve and record · 9 sample · 10 prove · 11 check.
const V=THREE.Vector3,VIOLET=0x7759b4,TRAY_Z=2.60;

export function buildZkScene(points,rackGeometry,rackMaterial,options={}){
 const base=buildVerificationScene(points,rackGeometry,rackMaterial,{...options,boundary:false});
 const root=base.root,info=base.diagnostics(),tap=new V(...info.tapLocation),proverAt=new V(...info.verifierLocation),edge=base.frontendEdge.clone();
 const consoleAt=new V(edge.x+.25,edge.y+1.05,0),boundaryX=edge.x-.9;
 const geometries=new Set(),materials=new Set(),textures=new Set(),reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let phase=3,phaseStart=0;

 const mat=(color,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.62,metalness:.18,...extra});materials.add(m);return m;};
 const glow=color=>{const m=new THREE.MeshBasicMaterial({color});materials.add(m);return m;};
 const ink=mat(iceberg.foreground),steel=mat(iceberg.muted),light=mat(iceberg.white),orange=mat(iceberg.yellow),orangeDeep=mat(0xa85e2b),green=mat(iceberg.green),violet=mat(VIOLET),trayMat=mat(iceberg.muted),padMat=mat(0xf1f2f5,{roughness:.9,metalness:0});
 function section(){const g=new THREE.Group();root.add(g);return g;}
 function mesh(g,geometry,m,at=new V()){geometries.add(geometry);const o=new THREE.Mesh(geometry,m);o.position.copy(at);g.add(o);return o;}
 const box=(g,x,y,z,w,d,h,m)=>mesh(g,new THREE.BoxGeometry(w,d,h),m,new V(x,y,z));
 function cable(g,pts,m,r=.02){const curve=roundedCablePath(pts,.09);mesh(g,new THREE.TubeGeometry(curve,160,r,8,false),m);return curve;}
 function canvasTexture(size,draw){const c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d'),size);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.add(t);return t;}
 function sprite(g,texture,scale){const m=new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true});materials.add(m);const s=new THREE.Sprite(m);s.scale.set(scale,scale,1);s.renderOrder=30;s.visible=false;g.add(s);return s;}

 // ---- Network Certifier -------------------------------------------------
 // Local origin: the centre of the three links where they cross the unit.
 const certifier=section(),unit=new THREE.Group();unit.position.copy(tap);certifier.add(unit);
 box(unit,0,0,-.165,1.06,.62,.035,steel);                         // cradle bolted to the tray
 for(const x of[-.44,.44])for(const y of[-.26,.26])box(unit,x,y,-.14,.05,.05,.03,ink);
 box(unit,0,0,-.07,.94,.54,.16,ink);                              // chassis: the links run through it
 box(unit,0,0,.012,.96,.56,.012,light);                           // lid seam
 box(unit,0,0,.082,.94,.54,.128,orange);                          // sealed lid
 box(unit,-.2,0,.149,.44,.34,.012,ink);                           // window over the three links
 const laneLights=[-1,0,1].map(i=>box(unit,-.2,i*.095,.157,.34,.022,.006,glow(0x7da0e0)));
 box(unit,.27,0,.168,.32,.42,.05,green);                          // record module: keeps one entry per exchange
 for(const y of[-.12,0,.12])box(unit,.27,y,.195,.24,.05,.006,light);
 box(unit,.085,0,.156,.018,.42,.024,orangeDeep);
 const statusMat=glow(iceberg.muted);box(unit,-.2,-.215,.151,.07,.035,.012,statusMat); // status light, front edge
 box(unit,0,-.273,.03,.5,.008,.07,light);                         // front plate
 box(unit,0,-.279,.03,.16,.006,.035,ink);
 for(const x of[-.33,.33]){box(unit,x,-.276,.012,.07,.014,.1,light);box(unit,x,-.285,.012,.03,.006,.03,mat(iceberg.red));} // tamper seals across the seam
 for(let i=-1;i<=1;i++)for(const side of[-1,1]){box(unit,side*.478,i*.075,0,.03,.05,.04,ink);box(unit,side*.5,i*.075,0,.03,.026,.024,steel);} // link ports
 box(unit,.2,.305,.0,.36,.08,.15,green);                          // record and proof ports: the only other way out
 box(unit,.1,.352,.0,.05,.02,.04,ink);for(const y of[.29,.33])box(unit,.385,y,.0,.02,.026,.04,ink);

 // ---- Boundary ------------------------------------------------------------
 const border=section(),y0=edge.y-1.2,y1=proverAt.y+1.3;
 box(border,boundaryX,(y0+y1)/2,.012,.06,y1-y0,.024,ink);
 const glass=new THREE.MeshBasicMaterial({color:iceberg.blue,transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false});materials.add(glass);
 const wall=mesh(border,new THREE.PlaneGeometry(y1-y0,3.1),glass,new V(boundaryX,(y0+y1)/2,1.55));wall.rotation.set(Math.PI/2,Math.PI/2,0);

 // ---- Verifier: a console outside the boundary ----------------------------
 const verifier=section(),desk=new THREE.Group();desk.position.copy(consoleAt);verifier.add(desk);
 box(verifier,consoleAt.x+.15,consoleAt.y,-.02,1.9,2.0,.03,padMat);
 box(desk,0,0,.74,1.1,.62,.04,light);for(const x of[-.5,.5])for(const y of[-.26,.26])box(desk,x,y,.36,.04,.04,.72,steel);
 box(desk,0,.08,.775,.3,.2,.03,ink);box(desk,0,.1,.93,.05,.04,.3,ink);       // monitor stand
 box(desk,0,.1,1.2,.78,.035,.5,ink);                                           // monitor
 const screenTextures={
  ledger:canvasTexture(256,(c,s)=>{c.fillStyle='#f3f4f7';c.fillRect(0,0,s,s);c.fillStyle='#668e3d';for(let i=0;i<5;i++)c.fillRect(30,52+i*36,i===4?120:196,14);}),
  sealed:canvasTexture(256,(c,s)=>{c.fillStyle='#f3f4f7';c.fillRect(0,0,s,s);drawSeal(c,s/2,s/2,84);}),
  pass:canvasTexture(256,(c,s)=>{c.fillStyle='#4f6f2f';c.fillRect(0,0,s,s);c.strokeStyle='#ffffff';c.lineWidth=30;c.lineCap=c.lineJoin='round';c.beginPath();c.moveTo(62,134);c.lineTo(110,180);c.lineTo(196,84);c.stroke();})
 };
 // The record on the verifier's screen: one green row per answer; the sampled row turns orange.
 const drawLedger=(rows,picked=-1)=>canvasTexture(256,(c,s)=>{c.fillStyle='#f3f4f7';c.fillRect(0,0,s,s);for(let i=0;i<rows;i++){c.fillStyle=i===picked?'#c57339':'#668e3d';c.fillRect(30,34+i*34,i%3===2?150:196,16);}if(picked>=0){c.strokeStyle='#c57339';c.lineWidth=5;c.strokeRect(19,25+picked*34,218,34);}});
 const ledgerTextures=Array.from({length:7},(_,n)=>drawLedger(n));screenTextures.picked=drawLedger(6,3);
 const screenMat=new THREE.MeshBasicMaterial({map:screenTextures.ledger});materials.add(screenMat);
 const screen=mesh(desk,new THREE.PlaneGeometry(.72,.44),screenMat,new V(0,.081,1.2));screen.rotation.x=Math.PI/2;
 box(desk,-.02,-.14,.77,.44,.15,.018,steel);                                   // keyboard

 // ---- Record link: certifier -> verifier ----------------------------------
 const sideX=edge.x-.3;
 mesh(verifier,ladderTray(new V(sideX,edge.y+.2,TRAY_Z),new V(sideX,consoleAt.y+.12,TRAY_Z),.16),trayMat);
 box(verifier,sideX+.14,consoleAt.y+.12,1.3,.035,.035,2.6,steel);
 const recordLink=cable(verifier,[new V(tap.x+.39,tap.y+.29,2.625),new V(tap.x+.62,tap.y+.29,2.625),new V(tap.x+.62,edge.y+.13,2.625),new V(sideX-.02,edge.y+.13,2.625),new V(sideX-.02,consoleAt.y+.06,2.625),new V(sideX-.02,consoleAt.y+.06,.8),new V(consoleAt.x-.1,consoleAt.y+.06,.8)],green);

 // ---- Prover: one ordinary rack, inside, beside the model ------------------
 const prover=section(),proverMat=rackMaterial.clone();materials.add(proverMat);
 const proverRack=new THREE.Mesh(rackGeometry,proverMat);proverRack.position.copy(proverAt);prover.add(proverRack);
 const band=mat(VIOLET,{emissive:VIOLET,emissiveIntensity:0});
 box(prover,proverAt.x,proverAt.y-.652,1.18,.5,.016,.5,band);box(prover,proverAt.x,proverAt.y,2.262,.6,1.24,.03,band);box(prover,proverAt.x+.306,proverAt.y,1.18,.014,1.0,.5,band);
 for(const x of[-.12,.12])mesh(prover,new THREE.CylinderGeometry(.085,.085,.012,20),ink,new V(proverAt.x+x,proverAt.y-.664,1.18));
 mesh(prover,ladderTray(new V(tap.x+.1,edge.y+.36,TRAY_Z),new V(tap.x+.1,proverAt.y-.72,TRAY_Z),.18),trayMat);
 mesh(prover,ladderTray(new V(tap.x+.1,proverAt.y-.72,TRAY_Z),new V(proverAt.x+.22,proverAt.y-.72,TRAY_Z),.18),trayMat);
 box(prover,proverAt.x+.29,proverAt.y-.69,1.85,.025,.025,1.55,ink);
 // The proof channel also crosses at the certifier, then follows the record link out.
 const channel=cable(prover,[new V(proverAt.x+.22,proverAt.y-.42,1.2),new V(proverAt.x+.22,proverAt.y-.72,1.2),new V(proverAt.x+.22,proverAt.y-.72,2.625),new V(tap.x+.1,proverAt.y-.72,2.625),new V(tap.x+.1,tap.y+.33,2.625),new V(tap.x+.39,tap.y+.33,2.625),new V(tap.x+.68,tap.y+.33,2.625),new V(tap.x+.68,edge.y+.17,2.625),new V(sideX+.02,edge.y+.17,2.625),new V(sideX+.02,consoleAt.y+.1,2.625),new V(sideX+.02,consoleAt.y+.1,.8),new V(consoleAt.x-.06,consoleAt.y+.1,.8)],violet);

 // ---- What travels: a fingerprint, then a proof ------------------------------
 function drawSeal(c,x,y,r,stroke='#7759b4'){c.strokeStyle=stroke;c.lineCap='round';c.lineWidth=r*.13;for(const [rr,a0,a1]of[[r*.92,Math.PI*1.06,Math.PI*1.94],[r*.62,Math.PI,Math.PI*2],[r*.32,Math.PI,Math.PI*2]]){c.beginPath();c.arc(x,y+r*.25,rr,a0,a1);c.stroke();}c.beginPath();c.moveTo(x,y+r*.25);c.lineTo(x,y+r*.6);c.stroke();}
 const tokens=section();
 const fingerprint=sprite(tokens,canvasTexture(256,(c,s)=>{c.fillStyle='#ffffff';c.beginPath();c.arc(s/2,s/2,s/2-10,0,7);c.fill();c.lineWidth=12;c.strokeStyle='#7759b4';c.stroke();drawSeal(c,s/2,s/2,74);}),.8);
 const proof=sprite(tokens,canvasTexture(256,(c,s)=>{c.fillStyle='#7759b4';c.beginPath();c.moveTo(56,20);c.lineTo(160,20);c.lineTo(204,64);c.lineTo(204,236);c.lineTo(56,236);c.closePath();c.fill();c.fillStyle='#c9bbee';c.beginPath();c.moveTo(160,20);c.lineTo(160,64);c.lineTo(204,64);c.closePath();c.fill();c.fillStyle='#ffffff';for(let i=0;i<4;i++)c.fillRect(82,96+i*32,i===3?56:96,12);}),.9);
 const request=sprite(tokens,canvasTexture(128,(c,s)=>{c.fillStyle='#33374c';c.beginPath();c.arc(s/2,s/2,s/2-12,0,7);c.fill();c.fillStyle='#ffffff';c.font='700 72px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('?',s/2,s/2+4);}),.6);
 const verdict=sprite(tokens,canvasTexture(256,(c,s)=>{c.fillStyle='#4f6f2f';c.beginPath();c.arc(s/2,s/2,s/2-10,0,7);c.fill();c.strokeStyle='#ffffff';c.lineWidth=26;c.lineCap=c.lineJoin='round';c.beginPath();c.moveTo(70,134);c.lineTo(112,174);c.lineTo(188,88);c.stroke();}),1.0);
 // One green record per answer, on its way from the certifier to the verifier.
 const recordTexture=canvasTexture(128,(c,s)=>{c.fillStyle='#668e3d';c.fillRect(14,24,100,80);c.fillStyle='#ffffff';for(let i=0;i<3;i++)c.fillRect(30,42+i*20,i===2?42:68,8);});
 const records=[0,1].map(()=>sprite(tokens,recordTexture,.42));
 const restAt=consoleAt.clone().add(new V(-.55,.1,1.95)),verdictAt=consoleAt.clone().add(new V(.45,.1,2.05));
 const ease=u=>{u=THREE.MathUtils.clamp(u,0,1);return u*u*(3-2*u);};
 const along=(s,u)=>s.position.copy(channel.getPointAt(THREE.MathUtils.clamp(u,0,1))).add(new V(0,0,.16));
 const alongRecord=(s,u)=>s.position.copy(recordLink.getPointAt(THREE.MathUtils.clamp(u,0,1))).add(new V(0,0,.14));

 function setPhase(n){
  if(n!==phase)phaseStart=performance.now();phase=n;base.setPhase(Math.min(n,4));
  certifier.visible=border.visible=verifier.visible=n>=5;prover.visible=n>=6;tokens.visible=n>=7;
 }
 function update(t){
  base.update(t);
  const s=reduced?99:(t-phaseStart)/1000;
  for(const o of[fingerprint,proof,request,verdict,...records])o.visible=false;
  let screenMap=screenTextures.ledger,proving=0,passed=false;
  if(phase===7){ // seal: the fingerprint travels out and stays with the verifier
   fingerprint.visible=true;const u=ease((s-.7)/4.2);
   if(u<1)along(fingerprint,u);else{fingerprint.position.copy(restAt);screenMap=screenTextures.sealed;}
  }else if(phase>=8){
   fingerprint.visible=true;fingerprint.position.copy(restAt);
   if(phase===8){ // serve and record: one record per answer reaches the verifier, and its list grows
    const period=1.3,travel=1.7,k=Math.floor((s-.5)/period);
    records.forEach((r,i)=>{const u=(s-.5-(k-i)*period)/travel;if(k-i>=0&&u>=0&&u<1){r.visible=true;alongRecord(r,ease(u));}});
    screenMap=ledgerTextures[THREE.MathUtils.clamp(Math.floor((s-.5-travel)/period)+1,0,6)];
   }else if(phase===9){ // sample: the verifier picks one row and asks the prover for a proof of it
    screenMap=screenTextures.picked;
    if(s>.9){request.visible=true;along(request,1-ease((s-.9)/3));}
   }else if(phase===10){ // prove: the prover works, then the proof travels out
    screenMap=screenTextures.picked;
    if(s<3.4)proving=.55+.45*Math.sin(s*5);
    if(s>=3.4){proof.visible=true;if(s<7.2)along(proof,ease((s-3.4)/3.8));else proof.position.copy(verdictAt);}
   }else{ // check: the proof matches the fingerprint and the record
    passed=true;screenMap=screenTextures.pass;verdict.visible=true;verdict.position.copy(verdictAt);
   }
  }
  if(screenMat.map!==screenMap){screenMat.map=screenMap;screenMat.needsUpdate=true;}
  band.emissiveIntensity=proving;proverMat.emissive.setHex(VIOLET);proverMat.emissiveIntensity=proving*.35;
  statusMat.color.setHex(passed?0x8fd15a:phase>=5?0x7da0e0:iceberg.muted);
  laneLights.forEach((l,i)=>l.material.color.setHex(i===Math.floor(t/900)%3?0xffffff:0x7da0e0));
 }
 // Views: wide while the hardware arrives, close on the certifier to show what it is.
 function view(step){
  const unitsAndExit=[...points,tap,new V(edge.x,edge.y,0)];
  if(step<=3)return{points};
  if(step===4)return{points:unitsAndExit};
  if(step===5){const dir=new V(.42,-.84,.5).normalize(),target=tap.clone().add(new V(.12,.1,-.02));return{target,position:target.clone().addScaledVector(dir,3.1)};}
  return{points:[...unitsAndExit,proverAt,consoleAt.clone().add(new V(.5,0,0))]};
 }
 // Name tags for the overlay; each appears with its hardware.
 function tags(step){
  if(phase<5)return[];
  if(step===5)return[
   {text:'Every link out passes through',at:tap.clone().add(new V(-.2,0,.17)),color:'#2d539e',dx:-150,dy:-96},
   {text:'Sealed against tampering',at:tap.clone().add(new V(-.33,-.29,.02)),color:'#33374c',dx:-210,dy:24},
   {text:'One record of everything said',at:tap.clone().add(new V(.27,0,.2)),color:'#4f6f2f',dx:190,dy:-86}];
  const list=[{text:'Network Certifier',at:tap.clone().add(new V(0,-.2,.1)),color:'#9a5626',dx:-30,dy:96},{text:'Verifier',at:consoleAt.clone().add(new V(.45,-.2,.76)),color:'#4f6f2f',dx:110,dy:26}];
  if(phase>=6)list.push({text:'Prover',at:proverAt.clone().add(new V(0,0,2.3)),color:'#55408c',dx:-36,dy:-60});
  return list;
 }
 setPhase(3);certifier.position.z=0;
 return{root,frontendEdge:base.frontendEdge,frontendTrunkX:base.frontendTrunkX,setPhase,update,view,tags,
  setFrontendLayout:base.setFrontendLayout,setTapInstall(progress){certifier.position.z=(1-progress)*1.1;},
  cameraPoints:()=>[...points,tap,proverAt,consoleAt],calloutAnchors:base.calloutAnchors,setSampling(){},
  diagnostics(){return{...base.diagnostics(),variant:'zk',phase,certifierLocation:tap.toArray(),proverLocation:proverAt.toArray(),verifierLocation:consoleAt.toArray(),verifierHoldsWeights:false};},
  dispose(){base.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
