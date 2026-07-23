import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm";

const SCENARIOS = {
  bull: { label: "Bull case", probability: 28, color: 0x20d5ea, risk: 24, bias: "Bullish", endpoint: [-1.9, 1.5] },
  side: { label: "Sideways", probability: 18, color: 0x2787ff, risk: 31, bias: "Neutral", endpoint: [-0.05, 1.15] },
  bear: { label: "Bear case", probability: 22, color: 0xff8b35, risk: 67, bias: "Bearish", endpoint: [1.85, 1.35] },
  rec: { label: "Recommended path", probability: 62, color: 0xc4a5ff, risk: 38, bias: "Moderately Bullish", endpoint: [3.25, -1.15] }
};

const ROUTES = {
  bull: [[-3.65,-0.18],[-3.0,0.1],[-2.5,0.72],[-1.9,1.5]],
  side: [[-3.65,-0.05],[-2.8,0.28],[-1.45,0.66],[-0.05,1.15]],
  bear: [[-3.65,0.12],[-2.35,0.45],[-0.1,0.72],[1.85,1.35]],
  rec: [[-3.55,-0.38],[-2.45,-0.12],[-1.0,-0.44],[0.65,-0.35],[1.95,-0.62],[3.25,-1.15]]
};

export function mountConvictionAtlas3D({ canvas, root, onScenarioChange }) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Missing Conviction Atlas canvas.");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setClearColor(0x02060b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02060b, 0.043);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 7.9, 9.1);
  camera.lookAt(0, -0.25, 0);

  const world = new THREE.Group();
  world.rotation.x = -0.14;
  world.scale.set(1.12, 1.12, 1.12);
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x4b9bc7, 0x010205, 0.34));
  const key = new THREE.DirectionalLight(0x86ddff, 1.5);
  key.position.set(-5, 9, 5);
  scene.add(key);
  const violet = new THREE.PointLight(0xa56cff, 18, 22, 2);
  violet.position.set(2.4, 3.8, -0.2);
  scene.add(violet);
  const orange = new THREE.PointLight(0xff7f32, 9, 16, 2);
  orange.position.set(2.8, 2.6, 2.1);
  scene.add(orange);

  const state = { activeScenario: "rec", running: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, raf: 0, time: 0, pointerX: 0, pointerY: 0 };
  const terrain = createTerrain();
  world.add(terrain.surface, terrain.majorContours, terrain.minorContours);
  const convergence = createConvergenceNode();
  world.add(convergence.group);

  const routes = new Map();
  Object.keys(SCENARIOS).forEach((id) => { const route = createRoute(id); routes.set(id, route); world.add(route.group); });
  const beacons = new Map();
  Object.keys(SCENARIOS).forEach((id) => { const beacon = createBeacon(id); beacons.set(id, beacon); world.add(beacon); });
  const riskZones = [createRiskZone(-1.85, -1.62), createRiskZone(1.72, -1.7)];
  riskZones.forEach((zone) => world.add(zone.group));
  const streams = createEvidenceStreams();
  world.add(streams.points, streams.lines);

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(bounds.width));
    const height = Math.max(1, Math.floor(bounds.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const handlePointer = (event) => {
    const bounds = canvas.getBoundingClientRect();
    state.pointerX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    state.pointerY = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
  };
  canvas.addEventListener("pointermove", handlePointer);
  canvas.addEventListener("pointerleave", () => { state.pointerX = 0; state.pointerY = 0; });

  function setScenario(id) {
    const scenario = SCENARIOS[id];
    if (!scenario) return;
    state.activeScenario = id;
    root?.setAttribute("data-active-scenario", id);
    routes.forEach((route, routeId) => route.setActive(routeId === id));
    beacons.forEach((beacon, beaconId) => setBeaconActive(beacon, beaconId === id));
    onScenarioChange?.({ id, ...scenario, color: `#${scenario.color.toString(16).padStart(6, "0")}` });
  }

  function render() {
    const targetY = state.pointerX * 0.2;
    const targetX = -0.14 + state.pointerY * 0.08;
    world.rotation.y += (targetY - world.rotation.y) * 0.025;
    world.rotation.x += (targetX - world.rotation.x) * 0.025;
    camera.position.x += (state.pointerX * 0.45 - camera.position.x) * 0.02;
    camera.position.y += ((7.9 - state.pointerY * 0.22) - camera.position.y) * 0.02;
    camera.lookAt(0, -0.2, 0);

    terrain.surface.material.uniforms.uTime.value = state.time;
    terrain.majorContours.material.opacity = 0.42 + Math.sin(state.time * 0.3) * 0.025;
    terrain.minorContours.material.opacity = 0.16 + Math.sin(state.time * 0.22) * 0.015;
    routes.forEach((route, id) => route.update(state.time, id === state.activeScenario));
    beacons.forEach((beacon, id) => updateBeacon(beacon, state.time, id === state.activeScenario));
    riskZones.forEach((zone, index) => updateRiskZone(zone, state.time + index * 1.8));
    updateEvidenceStreams(streams, state.time);
    updateConvergenceNode(convergence, state.time);
    renderer.render(scene, camera);
  }

  function tick() { state.time += 0.016; render(); if (state.running) state.raf = requestAnimationFrame(tick); }
  resize(); setScenario("rec"); render(); if (state.running) state.raf = requestAnimationFrame(tick);

  return {
    setScenario,
    setPaused(paused) { state.running = !paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches; cancelAnimationFrame(state.raf); if (state.running) state.raf = requestAnimationFrame(tick); else render(); },
    destroy() {
      cancelAnimationFrame(state.raf); observer.disconnect(); canvas.removeEventListener("pointermove", handlePointer); renderer.dispose();
      scene.traverse((object) => { object.geometry?.dispose?.(); if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.()); else object.material?.dispose?.(); });
    }
  };
}

function gaussian(x, z, cx, cz, radius, amplitude) {
  const dx = x - cx; const dz = z - cz;
  return Math.exp(-(dx * dx + dz * dz) / radius) * amplitude;
}

function terrainHeight(x, z) {
  const peaks =
    gaussian(x,z,-2.35,0.78,0.58,1.45) + gaussian(x,z,-1.55,1.45,0.34,0.82) +
    gaussian(x,z,-0.15,0.95,0.75,1.28) + gaussian(x,z,1.15,1.18,0.42,0.9) +
    gaussian(x,z,2.25,0.72,0.55,1.32) + gaussian(x,z,3.05,-0.62,0.48,1.0) +
    gaussian(x,z,-0.6,-0.45,1.15,0.52);
  const basins = gaussian(x,z,-1.85,-1.62,0.22,-0.78) + gaussian(x,z,1.72,-1.7,0.25,-0.88);
  const ridges = Math.sin(x * 1.9 + z * 0.9) * 0.11 + Math.cos(z * 2.4 - x * 0.7) * 0.085 + Math.sin((x + z) * 3.1) * 0.035;
  return peaks + basins + ridges;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(12.8, 7.5, 150, 96);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) { const x = position.getX(index); const z = position.getZ(index); position.setY(index, terrainHeight(x, z)); }
  geometry.computeVertexNormals();

  const surfaceMaterial = new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide, depthWrite: true, uniforms: { uTime: { value: 0 } },
    vertexShader: `varying float vHeight; varying vec3 vPosition; varying vec3 vNormalW; void main(){vHeight=position.y;vPosition=position;vNormalW=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `varying float vHeight; varying vec3 vPosition; varying vec3 vNormalW; uniform float uTime; void main(){
      float bands=fract((vHeight+1.9)*10.0); float major=smoothstep(.44,.5,bands)*smoothstep(.78,.5,bands);
      float slope=1.0-clamp(vNormalW.y,0.0,1.0); float micro=(sin(vPosition.x*17.0)+sin(vPosition.z*15.0))*0.015;
      vec3 low=vec3(.006,.022,.04); vec3 high=vec3(.015,.14,.22); vec3 color=mix(low,high,clamp((vHeight+.7)/2.4,0.0,1.0));
      color+=vec3(.02,.30,.42)*major*.65; color+=vec3(.025,.10,.16)*slope*.55; color+=micro;
      float edgeX=smoothstep(6.5,4.5,abs(vPosition.x)); float edgeZ=smoothstep(3.8,2.8,abs(vPosition.z));
      gl_FragColor=vec4(color,(.50+major*.28)*edgeX*edgeZ);
    }`
  });
  const surface = new THREE.Mesh(geometry, surfaceMaterial); surface.position.y = -0.72;

  const majorGeometry = buildContourGeometry(-0.55, 1.9, 0.13, 12.8, 7.5, 110, 72);
  const minorGeometry = buildContourGeometry(-0.55, 1.9, 0.065, 12.8, 7.5, 90, 56);
  const majorContours = new THREE.LineSegments(majorGeometry, new THREE.LineBasicMaterial({ color: 0x258cb5, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending }));
  const minorContours = new THREE.LineSegments(minorGeometry, new THREE.LineBasicMaterial({ color: 0x1a5678, transparent: true, opacity: 0.16 }));
  majorContours.position.y = minorContours.position.y = -0.69;
  return { surface, majorContours, minorContours };
}

function buildContourGeometry(min, max, step, width, depth, xCount, zCount) {
  const vertices = [];
  for (let level = min; level <= max; level += step) {
    for (let iz = 0; iz < zCount - 1; iz += 1) {
      for (let ix = 0; ix < xCount - 1; ix += 1) {
        const x0 = -width/2 + (ix/(xCount-1))*width; const x1 = -width/2 + ((ix+1)/(xCount-1))*width;
        const z0 = -depth/2 + (iz/(zCount-1))*depth; const z1 = -depth/2 + ((iz+1)/(zCount-1))*depth;
        const p = [[x0,terrainHeight(x0,z0),z0],[x1,terrainHeight(x1,z0),z0],[x1,terrainHeight(x1,z1),z1],[x0,terrainHeight(x0,z1),z1]];
        const edges = [[0,1],[1,2],[2,3],[3,0]]; const hits=[];
        edges.forEach(([a,b])=>{const va=p[a][1]-level,vb=p[b][1]-level;if((va<=0&&vb>0)||(va>0&&vb<=0)){const t=va/(va-vb);hits.push([p[a][0]+(p[b][0]-p[a][0])*t,level+0.018,p[a][2]+(p[b][2]-p[a][2])*t]);}});
        if(hits.length===2) vertices.push(...hits[0],...hits[1]);
      }
    }
  }
  return new THREE.BufferGeometry().setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
}

function createRoute(id) {
  const scenario = SCENARIOS[id];
  const points = ROUTES[id].map(([x,z])=>new THREE.Vector3(x,terrainHeight(x,z)-0.66,z));
  const curve = new THREE.CatmullRomCurve3(points,false,"catmullrom",0.28); const group=new THREE.Group();
  const radius=id==="rec"?0.052:0.03;
  const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,140,radius,10,false),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:id==="rec"?1:.28})); group.add(tube);
  const halo=new THREE.Mesh(new THREE.TubeGeometry(curve,140,id==="rec"?.16:.08,10,false),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:id==="rec"?.14:.03,depthWrite:false,blending:THREE.AdditiveBlending})); group.add(halo);
  const groundGlow=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(140)),new THREE.LineBasicMaterial({color:scenario.color,transparent:true,opacity:id==="rec"?.32:.08,blending:THREE.AdditiveBlending})); groundGlow.position.y=-.035; group.add(groundGlow);
  const markerGeometry=new THREE.SphereGeometry(id==="rec"?.075:.05,12,12); const markers=Array.from({length:id==="rec"?18:10},(_,index)=>{const marker=new THREE.Mesh(markerGeometry,new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,blending:THREE.AdditiveBlending}));marker.userData.offset=index/(id==="rec"?18:10);group.add(marker);return marker;});
  return {group,setActive(active){tube.material.opacity=active?1:.18;halo.material.opacity=active?.18:.018;groundGlow.material.opacity=active?.38:.05;tube.scale.setScalar(active?1.18:1);},update(time,active){markers.forEach((marker)=>{const progress=(marker.userData.offset+time*(active?.095:.035))%1;marker.position.copy(curve.getPointAt(progress));marker.material.opacity=active?.95:.16;marker.visible=active||marker.userData.offset<.25;});halo.material.opacity=(active?.17:.018)*(.82+Math.sin(time*2.4)*.18);}};
}

function createBeacon(id) {
  const scenario=SCENARIOS[id]; const [x,z]=scenario.endpoint; const y=terrainHeight(x,z)-.67; const group=new THREE.Group(); group.position.set(x,y,z);
  const disc=new THREE.Mesh(new THREE.CircleGeometry(.26,56),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.2,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));disc.rotation.x=-Math.PI/2;group.add(disc);
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,1.75,8),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.78,blending:THREE.AdditiveBlending}));stem.position.y=.94;group.add(stem);
  for(let index=0;index<4;index+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.14+index*.12,.152+index*.12,64),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.56-index*.1,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.userData.index=index;group.add(ring);}
  const core=new THREE.Mesh(new THREE.SphereGeometry(.11,20,20),new THREE.MeshBasicMaterial({color:scenario.color,blending:THREE.AdditiveBlending}));core.position.y=.03;group.add(core);
  const tip=new THREE.Mesh(new THREE.SphereGeometry(.075,16,16),new THREE.MeshBasicMaterial({color:scenario.color,blending:THREE.AdditiveBlending}));tip.position.y=1.82;group.add(tip);
  group.userData={core,tip,active:false};return group;
}
function setBeaconActive(beacon,active){beacon.userData.active=active;beacon.scale.setScalar(active?1.2:.88);}
function updateBeacon(beacon,time,active){beacon.rotation.y+=active?.005:.0015;beacon.children.forEach((child)=>{if(child.geometry?.type==="RingGeometry"){const index=child.userData.index||0;const scale=1+((time*.28+index*.21)%1)*1.35;child.scale.setScalar(scale);child.material.opacity=(active?.48:.12)*(1.72-scale);}});beacon.userData.core.scale.setScalar(1+Math.sin(time*3.1)*(active?.2:.06));beacon.userData.tip.scale.setScalar(1+Math.sin(time*2.7+1)*(active?.26:.08));}

function createRiskZone(x,z){const y=terrainHeight(x,z)-.68;const group=new THREE.Group();group.position.set(x,y,z);const disc=new THREE.Mesh(new THREE.CircleGeometry(.62,64),new THREE.MeshBasicMaterial({color:0xff3028,transparent:true,opacity:.1,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));disc.rotation.x=-Math.PI/2;group.add(disc);const core=new THREE.Mesh(new THREE.SphereGeometry(.09,16,16),new THREE.MeshBasicMaterial({color:0xff3b34,transparent:true,opacity:.9,blending:THREE.AdditiveBlending}));core.position.y=.02;group.add(core);for(let i=0;i<5;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.16+i*.13,.174+i*.13,56),new THREE.MeshBasicMaterial({color:0xff3b34,transparent:true,opacity:.42-i*.055,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.65;group.add(ring);}return{group,core};}
function updateRiskZone(zone,time){zone.group.children.forEach((child)=>{if(child.geometry?.type==="RingGeometry"){const pulse=1+Math.sin(time*2+child.userData.phase)*.12;child.scale.setScalar(pulse);}});zone.core.scale.setScalar(1+Math.sin(time*3.5)*.25);}

function createConvergenceNode(){const group=new THREE.Group();const x=-2.25,z=-.05,y=terrainHeight(x,z)-.63;group.position.set(x,y,z);const core=new THREE.Mesh(new THREE.SphereGeometry(.13,20,20),new THREE.MeshBasicMaterial({color:0xbadfff,transparent:true,opacity:1,blending:THREE.AdditiveBlending}));group.add(core);for(let i=0;i<3;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.17+i*.12,.183+i*.12,56),new THREE.MeshBasicMaterial({color:i===2?0xb56cff:0x4fdfff,transparent:true,opacity:.46-i*.1,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.userData.index=i;group.add(ring);}return{group,core};}
function updateConvergenceNode(node,time){node.core.scale.setScalar(1+Math.sin(time*4)*.22);node.group.children.forEach((child)=>{if(child.geometry?.type==="RingGeometry"){const scale=1+((time*.35+child.userData.index*.28)%1)*1.15;child.scale.setScalar(scale);child.material.opacity=.42*(1.75-scale);}});}

function createEvidenceStreams(){const colors=[0x3977ff,0x8d55ff,0xb667ff,0x1fd1d7,0x7adf70,0xe6dc52,0xff9b36,0xff792f,0xff3c34];const particles=[],positions=[],particleColors=[],lineGroup=new THREE.Group();colors.forEach((color,lane)=>{const startZ=2.1-lane*.5;const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-6.0,.16,startZ),new THREE.Vector3(-4.65,.18+lane*.022,startZ*.62),new THREE.Vector3(-3.2,.4,-.15+lane*.018),new THREE.Vector3(-2.25,terrainHeight(-2.25,-.05)-.61,-.05));const lineMaterial=new THREE.LineBasicMaterial({color,transparent:true,opacity:.48,blending:THREE.AdditiveBlending});lineGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),lineMaterial));for(let index=0;index<13;index+=1){const progress=(index/13+lane*.061)%1;const point=curve.getPointAt(progress);positions.push(point.x,point.y,point.z);const c=new THREE.Color(color);particleColors.push(c.r,c.g,c.b);particles.push({curve,progress,speed:.0017+lane*.000055});}});const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(particleColors,3));const points=new THREE.Points(geometry,new THREE.PointsMaterial({size:.082,vertexColors:true,transparent:true,opacity:.98,blending:THREE.AdditiveBlending,depthWrite:false}));return{points,lines:lineGroup,particles};}
function updateEvidenceStreams(streams,time){const position=streams.points.geometry.attributes.position;streams.particles.forEach((particle,index)=>{particle.progress=(particle.progress+particle.speed*(.7+particle.progress*1.5))%1;const point=particle.curve.getPointAt(particle.progress);point.y+=Math.sin(time*2.7+index)*.02;position.setXYZ(index,point.x,point.y,point.z);});position.needsUpdate=true;}
