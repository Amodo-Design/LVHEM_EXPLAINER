import * as THREE from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {createRackGeometries} from './rack_geometry.js';
import {layoutRacks} from './fleet_layout.js';
import {buildCableBundles} from './fleet_bundles.js';
import {buildDataHall,buildHallFrontend} from './data_hall.js';
import {buildVerificationScene} from './verification_scene.js';
import {iceberg,applyIcebergTheme} from './iceberg_theme.js';
const presentation=document.documentElement.dataset.presentation==='iceberg';
const $=id=>document.getElementById(id),stage=$('stage'),V=THREE.Vector3;
const chapters=[
 {short:'Connected DC',title:'A connected data centre.',eyebrow:'01 / THE STARTING POINT',description:'A connected data hall has separate compute and frontend Ethernet paths. Blue request/reply links already exist; they stay connected throughout the installation.',facts:['256 racks shown in context','Follow the installation on 3 of them'],count:'256 racks',subtitle:'Compute fabric + frontend Ethernet',caption:'Drag to orbit · scroll to zoom'},
 {short:'Zoom in',title:'First, look inside the network.',eyebrow:'02 / ZOOM INTO THE CLUSTER',description:'Focus on 3 racks while their high-bandwidth connections are still in place. The rest of the data centre stays visible in the background.',facts:['All connections remain during the zoom','3 racks selected for the installation'],count:'3 connected racks',subtitle:'Zoom first · network still connected',caption:'The next step fades the fast links while moving the units apart.'},
 {short:'Remove network',title:'Remove the fast links.',eyebrow:'03 / LIMIT COMMUNICATION',description:'Fade the fast compute and extra frontend/storage paths while adding 0.3 metres to the gaps between units. Keep the existing blue request/reply link on each rack; the shared TAP will enforce its rate.',facts:['Remove scale-out + most frontend links','Keep internal NVLink + one frontend uplink per rack'],count:'3 racks in focus',subtitle:'Fast fabric removed · external frontend retained',caption:'This is a proposed installation, not a claim that removal alone prevents training.'},
 {short:'Inference units',title:'One rack. One inference unit.',eyebrow:'04 / DEFINE THE UNITS',description:'Each rack must be able to serve the approved model on its own. Its retained frontend routes requests and responses out of the data centre.',facts:['72 GPUs remain connected inside each rack','~1 Gb/s per unit after rate enforcement'],count:'3 inference units',subtitle:'One NVL72 rack per unit · local NVLink retained',caption:'Spacing is enlarged for legibility. No storage relocation is shown.'},
 {short:'Install TAPs',title:'One checkpoint before the exit.',eyebrow:'05 / INSTALL NETWORK TAPS',description:'Fit one three-channel TAP across the outgoing bundle at the data-centre boundary. Every link from the three racks passes through it before leaving; a separate branch copies the traffic to the verifier.',facts:['One shared TAP · three monitored links','Original traffic continues out; copies stay inside'],count:'3 links · 1 TAP',subtitle:'Requests and responses continue through the TAP',caption:'The orange shared TAP monitors all three links independently.'},
 {short:'Recompute system',title:'Install the replay system.',eyebrow:'06 / CONNECT THE VERIFIER',description:'The shared TAP feeds one normal rack just inside the data-centre boundary. This verifier rack replays sampled requests using the approved model.',facts:['One-way packet copies reach the verifier','The approved model is prepared before checks begin'],count:'A separate verifier',subtitle:'Shared TAP → one verifier rack',caption:'One standard verifier rack, inside the boundary.'},
 {short:'Sample check',title:'Replay. Compare. Report.',eyebrow:'07 / RUN A SAMPLE CHECK',description:'Select a request, replay it using the approved model, and compare the result. Only a restricted status is reported outside.',facts:['Recompute sampled requests, not all traffic','A sample result is not proof about the whole data centre'],count:'Check a sampled request',subtitle:'A visual explanation of recomputation',caption:'Illustrative outcomes only. Integrity, management and covert-channel controls remain essential.'}
];
const scene=new THREE.Scene(),contextScene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(37,1,.05,1200);camera.up.set(0,0,1);
function lightScene(s){s.add(new THREE.HemisphereLight(0xffffff,presentation?iceberg.muted:0x586d67,2.2));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-10,-20,40);s.add(light);}lightScene(scene);lightScene(contextScene);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(presentation?iceberg.background:0xf6f4ed,1);stage.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=2;controls.maxDistance=450;controls.maxPolarAngle=Math.PI*.8;controls.screenSpacePanning=true;
const geometries=createRackGeometries(),rackMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.66,metalness:.28,flatShading:true,side:THREE.DoubleSide});
function batches(parent){const b={};for(const level of ['far','medium','high']){const mesh=new THREE.InstancedMesh(geometries[level],rackMaterial,256);mesh.count=0;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);parent.add(mesh);b[level]=mesh;}return b;}
const mainBatches=batches(scene),contextBatches=batches(contextScene),matrix=new THREE.Matrix4();
const originalLayout=layoutRacks(256,32,.1,1.8),original=originalLayout.positions.map(p=>new V(...p)),positions=original.map(p=>p.clone()),focusIds=[];
const focusCols=3;
for(let col=28;col<31;col++)focusIds.push(3*32+col);
const focusSet=new Set(focusIds),center=new V();focusIds.forEach(id=>center.add(original[id]));center.multiplyScalar(1/focusIds.length);
const separated=layoutRacks(focusIds.length,focusCols,.4,1.8).positions.map(p=>new V(...p).add(center));
const fullBundles=buildCableBundles(originalLayout);scene.add(fullBundles.group);
const focusLayout={positions:focusIds.map(id=>original[id].toArray()),cols:focusCols,rows:1,width:2.0};
const focusBundles=buildCableBundles(focusLayout);scene.add(focusBundles.group);focusBundles.group.visible=false;
const installation=buildVerificationScene(separated,geometries.medium,rackMaterial,{storage:false,simple:true,palette:presentation?iceberg:null,columns:focusCols,frontendFromStart:true,frontendExit:[Math.max(...originalLayout.positions.map(p=>p[0]))+6.2,Math.min(...separated.map(p=>p.y))-1.25,.075]});scene.add(installation.root);installation.root.visible=false;installation.setSampling(false);
const hall=buildDataHall(originalLayout);scene.add(hall.group);
const hallFrontend=buildHallFrontend(originalLayout,focusIds,installation.frontendEdge,installation.frontendTrunkX);scene.add(hallFrontend.group);
if(presentation)applyIcebergTheme(scene);
const contextTarget=new THREE.WebGLRenderTarget(1,1),quadScene=new THREE.Scene(),quadCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1),quadMaterial=new THREE.MeshBasicMaterial({map:contextTarget.texture,transparent:true,depthTest:false,depthWrite:false,toneMapped:false});quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),quadMaterial));
let current=0,busy=false,transition=null,dirty=true,lastLOD=0,netOpacity=1,contextOpacity=1,check=null,scenario='match',checkPhase='idle',lastDiagnostics=0;
const diagnostic={main:256,context:0,near:0};
function fill(mesh,ids){mesh.count=ids.length;ids.forEach((id,i)=>{matrix.makeTranslation(positions[id].x,positions[id].y,positions[id].z);mesh.setMatrixAt(i,matrix);});mesh.instanceMatrix.needsUpdate=true;}
function hardwareLOD(){const lists={far:[],medium:[],high:[]},background={far:[],medium:[],high:[]},ppm=stage.clientHeight/(2*Math.tan(camera.fov*Math.PI/360));const sorted=positions.map((p,id)=>({id,d:camera.position.distanceTo(p.clone().add(new V(0,0,1.1)))})).sort((a,b)=>a.d-b.d);for(const {id,d}of sorted){const px=2.236*ppm/Math.max(.5,d);if(current>0&&!focusSet.has(id)){background[px>32?'medium':'far'].push(id);continue;}lists[px>185&&lists.high.length<16?'high':px>32?'medium':'far'].push(id);}for(const level of ['far','medium','high']){fill(mainBatches[level],lists[level]);fill(contextBatches[level],background[level]);}diagnostic.main=lists.far.length+lists.medium.length+lists.high.length;diagnostic.context=background.far.length+background.medium.length;diagnostic.near=lists.high.length;dirty=false;lastLOD=performance.now();}
function fade(group,value){group.visible=value>.001;group.traverse(o=>{if(!o.material)return;const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){m.userData.baseOpacity??=m.opacity;m.opacity=m.userData.baseOpacity*value;m.transparent=value<1||m.userData.baseOpacity<1;}});}
function fit(points){const target=new V();points.forEach(p=>target.add(p));target.multiplyScalar(1/points.length);target.z=1.35;const dir=new V(.58,-.88,.7).normalize(),right=new V().crossVectors(new V(0,0,1),dir).normalize(),up=new V().crossVectors(dir,right).normalize(),tv=Math.tan(camera.fov*Math.PI/360);let distance=7;for(const p of points)for(const x of[-.5,1.4])for(const y of[-1.2,.7])for(const z of[0,3.4]){const q=p.clone().add(new V(x,y,z)).sub(target);distance=Math.max(distance,q.dot(dir)+Math.abs(q.dot(right))/(tv*camera.aspect)*1.12,q.dot(dir)+Math.abs(q.dot(up))/tv*1.18);}return{target,position:target.clone().addScaledVector(dir,distance)};}
function desiredView(step){if(step===0)return fit([...original,...hall.frame]);if(step===1)return fit(focusIds.map(id=>original[id]));return fit(installation.cameraPoints(step<4?4:step===4?5:step===5?6:8));}
function updateUI(){if(presentation){$('previous').disabled=busy||current===0;$('next').disabled=busy;$('next').setAttribute('aria-label',current===6?'Restart presentation':'Next view');return;}const c=chapters[current];$('chapter').textContent=c.eyebrow;$('title').textContent=c.title;$('description').textContent=c.description;$('status-list').replaceChildren(...c.facts.map(text=>{const d=document.createElement('div');d.append(document.createElement('i'),document.createTextNode(text));return d;}));$('check-panel').hidden=current!==6;$('previous').disabled=busy||current===0;$('next').disabled=busy;$('next').textContent=current===6?'Restart →':'Next step →';$('camera-home').disabled=busy;document.querySelectorAll('.step').forEach((button,i)=>{button.disabled=busy;button.setAttribute('aria-current',i===current?'step':'false');});const legend=current<2?[['#cfb149','Fast compute / storage'],['#168eaa','Frontend → outside DC']]:current<5?[['#168eaa','Frontend → outside DC'],...(current===4?[['#c37d3f','Inline TAP']]:[])]:[['#168eaa','Requests / replies'],['#c37d3f','Shared TAP'],['#4d9479','Packet copies'],...(current===6?[['#c37d3f','Restricted result']]:[])];$('legend').innerHTML=legend.map(([color,text])=>`<span><i style="background:${color}"></i>${text}</span>`).join('');}
if(!presentation)chapters.forEach((chapter,i)=>{const b=document.createElement('button');b.className='step';b.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b>${chapter.short}`;b.onclick=()=>goTo(i);$('steps').append(b);});
function cancelCheck(){check=null;checkPhase='idle';installation.setSampling(false);if(presentation)return;$('run-check').disabled=false;$('result').className='result';$('result').textContent='Ready to replay a sampled request.';$('observed-reply').textContent='—';$('recomputed-reply').textContent='—';$('sample-unit').textContent='Sample one inference unit';for(const id of ['observe','replay','compare'])$(id).classList.remove('active');}
const smooth=u=>{u=THREE.MathUtils.clamp(u,0,1);return u*u*(3-2*u);};
function goTo(index,instant=false){
 if(busy&&!instant)return;cancelCheck();const previous=current;current=index;
 if(window.innerWidth<=700)window.scrollTo({top:0,behavior:instant?'instant':'smooth'});
 busy=true;controls.enabled=false;
 const strip=index===2&&previous<2,installTaps=index===4&&previous<4;
 const destination=desiredView(index),duration=instant||matchMedia('(prefers-reduced-motion:reduce)').matches?0:strip?3200:1600;
 const from=focusIds.map(id=>positions[id].clone()),to=focusIds.map((id,i)=>index>=2?separated[i].clone():original[id].clone());
 const surroundings=index>0?contextScene:scene;surroundings.add(fullBundles.group,hall.group,hallFrontend.group);
 installation.setPhase(index<2?2:index<4?4:index===4?5:index===5?6:8);
 installation.root.visible=true;
 installation.setTapInstall(installTaps?0:1);
 installation.setFrontendLayout(from);
 transition={start:performance.now(),duration,from,to,strip,installTaps,fromP:camera.position.clone(),fromT:controls.target.clone(),toP:destination.position,toT:destination.target,fromNet:netOpacity,toNet:index<2?1:0,fromContext:contextOpacity,toContext:index===0?1:.18};
 updateUI();dirty=true;if(duration===0)tickTransition(performance.now());
}
function tickTransition(t){
 if(!transition)return;const tr=transition,u=tr.duration?Math.min(1,(t-tr.start)/tr.duration):1,e=smooth(u);
 // Fade the backend and add 0.3 m to clear rack gaps on the same easing curve.
 const move=e,network=e;
 focusIds.forEach((id,i)=>positions[id].lerpVectors(tr.from[i],tr.to[i],move));
 installation.setFrontendLayout(focusIds.map(id=>positions[id]));
 installation.setTapInstall(tr.installTaps?e:1);
 camera.position.lerpVectors(tr.fromP,tr.toP,move);controls.target.lerpVectors(tr.fromT,tr.toT,move);
 contextOpacity=THREE.MathUtils.lerp(tr.fromContext,tr.toContext,e);netOpacity=THREE.MathUtils.lerp(tr.fromNet,tr.toNet,network);
 fade(fullBundles.group,netOpacity);fade(focusBundles.group,current>0?netOpacity:0);dirty=true;
 if(u===1){transition=null;busy=false;controls.enabled=true;installation.root.visible=true;updateUI();if(presentation&&current===6)startCheck();}
}

$('next').onclick=()=>goTo(current===6?0:current+1);$('previous').onclick=()=>goTo(current-1);if(!presentation){$('restart').onclick=()=>goTo(0,true);$('camera-home').onclick=()=>{const view=desiredView(current);camera.position.copy(view.position);controls.target.copy(view.target);controls.update();dirty=true;};
for(const id of ['match','different'])$(id).onclick=()=>{scenario=id;cancelCheck();$('match').setAttribute('aria-pressed',id==='match');$('different').setAttribute('aria-pressed',id==='different');};
$('run-check').onclick=startCheck;
}
function startCheck(){if(current!==6)return;cancelCheck();const unit=Math.floor(Math.random()*focusIds.length);check={start:performance.now(),unit,scenario};if(!presentation){$('sample-unit').textContent='Sampled unit U'+String(unit+1).padStart(2,'0');$('run-check').disabled=true;}installation.setSampling(true,unit,'copy');}
function tickCheck(t){if(!check)return;const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,elapsed=reduced?5000:t-check.start,phase=elapsed<1200?'copy':elapsed<2900?'replay':elapsed<4200?'compare':'done';if(phase===checkPhase)return;checkPhase=phase;if(presentation){installation.setSampling(true,check.unit,phase==='replay'?'replay':phase==='done'?(check.scenario==='match'?'pass':'fail'):phase);if(phase==='done')check=null;return;}const reply=check.scenario==='match'?'“The meeting is on Tuesday.”':'“The meeting is on Friday.”';$('observe').classList.toggle('active',true);$('replay').classList.toggle('active',phase!=='copy');$('compare').classList.toggle('active',phase==='compare'||phase==='done');$('observed-reply').textContent=reply;if(phase==='copy')$('result').textContent='Copying a request and its observed reply…';if(phase==='replay'){$('result').textContent='The verifier replays the request with the approved model…';installation.setSampling(true,check.unit,'replay');}if(phase==='compare'){$('recomputed-reply').textContent='“The meeting is on Tuesday.”';$('result').textContent='Comparing the observed and recomputed responses…';}if(phase==='done'){const pass=check.scenario==='match';$('recomputed-reply').textContent='“The meeting is on Tuesday.”';$('result').className='result '+(pass?'pass':'fail');$('result').textContent=pass?'PASS · this sampled reply agrees.':'FAIL · this sampled reply differs. Investigate.';$('run-check').disabled=false;installation.setSampling(true,check.unit,pass?'pass':'fail');check=null;}}
const size=new THREE.Vector2();renderer.info.autoReset=false;
function draw(){renderer.info.reset();if(current===0){renderer.render(scene,camera);return;}renderer.getDrawingBufferSize(size);if(contextTarget.width!==size.x||contextTarget.height!==size.y)contextTarget.setSize(size.x,size.y);const alpha=renderer.getClearAlpha();renderer.autoClear=false;renderer.setRenderTarget(contextTarget);renderer.setClearAlpha(0);renderer.clear();renderer.render(contextScene,camera);renderer.setRenderTarget(null);renderer.setClearAlpha(alpha);renderer.clear();quadMaterial.opacity=contextOpacity;renderer.render(quadScene,quadCamera);renderer.clearDepth();renderer.render(scene,camera);renderer.autoClear=true;}
if(!presentation){$('save-view').onclick=()=>{
 const w=stage.clientWidth,h=stage.clientHeight,ratio=renderer.getPixelRatio();
 renderer.setPixelRatio(1);renderer.setSize(3600,Math.round(3600*h/w),false);draw();
 const url=renderer.domElement.toDataURL('image/png');
 renderer.setPixelRatio(ratio);renderer.setSize(w,h);
 $('export-image').src=url;$('download-image').href=url;$('download-image').download=`verification-installation-step-${current+1}.png`;$('export-dialog').showModal();
};
$('close-export').onclick=()=>$('export-dialog').close();}
if(presentation)window.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||busy)return;if(event.key==='ArrowRight'){event.preventDefault();goTo(current===6?0:current+1);}else if(event.key==='ArrowLeft'&&current>0){event.preventDefault();goTo(current-1);}});
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true;}new ResizeObserver(resize).observe(stage);controls.addEventListener('change',()=>dirty=true);
resize();goTo(0,true);hardwareLOD();$('loading')?.remove();
function animate(t){requestAnimationFrame(animate);tickTransition(t);tickCheck(t);controls.update();installation.update(t);if(dirty&&t-lastLOD>65)hardwareLOD();draw();if(t-lastDiagnostics>700){stage.dataset.diagnostics=JSON.stringify({stage:current,busy,mainRacks:diagnostic.main,contextRacks:diagnostic.context,contextOpacity,networkOpacity:netOpacity,storageShown:false,rackGap:+(positions[focusIds[1]].x-positions[focusIds[0]].x-.6).toFixed(3),rowGap:focusIds.length>focusCols?+(positions[focusIds[focusCols]].y-positions[focusIds[0]].y-1.2).toFixed(3):null,frontendVisible:installation.root.visible,frontend:hallFrontend.stats,hall:hall.stats,installation:installation.diagnostics(),checkPhase,result:presentation?checkPhase:$('result').textContent,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles});lastDiagnostics=t;}}requestAnimationFrame(animate);
