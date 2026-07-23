import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm";

const SCENARIOS = {
  bull: { label: "Bull case", probability: 28, color: 0x20d5ea, risk: 24, bias: "Bullish", endpoint: [-2.05, 1.42] },
  side: { label: "Sideways", probability: 18, color: 0x2787ff, risk: 31, bias: "Neutral", endpoint: [-0.1, 1.08] },
  bear: { label: "Bear case", probability: 22, color: 0xff8b35, risk: 67, bias: "Bearish", endpoint: [1.85, 1.34] },
  rec: { label: "Recommended path", probability: 62, color: 0xc4a5ff, risk: 38, bias: "Moderately Bullish", endpoint: [3.35, -1.12] }
};

const ROUTES = {
  bull: [[-3.72,-0.25],[-3.2,0.05],[-2.85,0.55],[-2.55,0.92],[-2.05,1.42]],
  side: [[-3.72,-0.08],[-3.0,0.22],[-2.05,0.55],[-1.0,0.88],[-0.1,1.08]],
  bear: [[-3.72,0.10],[-2.85,0.38],[-1.55,0.58],[-0.15,0.78],[0.95,1.05],[1.85,1.34]],
  rec: [[-3.45,-0.38],[-2.75,-0.10],[-1.75,-0.28],[-0.7,-0.58],[0.35,-0.44],[1.25,-0.18],[2.1,-0.58],[2.75,-0.74],[3.35,-1.12]]
};

export function mountConvictionAtlas3D({ canvas, root, onScenarioChange }) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Missing Conviction Atlas canvas.");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setClearColor(0x02060b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02060b, 0.068);

  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
  camera.position.set(-0.25, 6.4, 9.2);
  camera.lookAt(0.25, -0.25, 0.05);

  const world = new THREE.Group();
  world.rotation.x = -0.13;
  world.position.y = -0.18;
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x497da4, 0x010204, 0.32));
  const cyanKey = new THREE.DirectionalLight(0x65dfff, 1.35);
  cyanKey.position.set(-5, 8, 5);
  scene.add(cyanKey);
  const violetRim = new THREE.PointLight(0xb56cff, 18, 22, 2);
  violetRim.position.set(3, 3.5, -1.5);
  scene.add(violetRim);
  const orangeFill = new THREE.PointLight(0xff8b35, 10, 18, 2);
  orangeFill.position.set(1.8, 2.2, 1.3);
  scene.add(orangeFill);

  const state = {
    activeScenario: "rec",
    running: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    raf: 0,
    time: 0,
    pointerX: 0,
    pointerY: 0
  };

  const terrain = createTerrain();
  world.add(terrain.surface, terrain.wireMajor, terrain.wireMinor);

  const convergence = createConvergenceCore();
  world.add(convergence.group);

  const routes = new Map();
  Object.keys(SCENARIOS).forEach((id) => {
    const route = createRoute(id);
    routes.set(id, route);
    world.add(route.group);
  });

  const beacons = new Map();
  Object.keys(SCENARIOS).forEach((id) => {
    const beacon = createBeacon(id);
    beacons.set(id, beacon);
    world.add(beacon);
  });

  const riskZones = [createRiskZone(-1.95, -1.65), createRiskZone(1.9, -1.72)];
  riskZones.forEach((zone) => world.add(zone.group));

  const streams = createEvidenceStreams();
  world.add(streams.lines, streams.points);

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
    routes.forEach((route, routeId) => route.setEmphasis(routeId === id, routeId === "rec"));
    beacons.forEach((beacon, beaconId) => beacon.setActive(beaconId === id));
    terrain.surface.material.uniforms.uActiveRegion.value = scenarioIndex(id);
    onScenarioChange?.({ id, ...scenario, color: `#${scenario.color.toString(16).padStart(6, "0")}` });
  }

  function render() {
    const targetX = state.pointerX * 0.24;
    const targetY = state.pointerY * 0.08;
    world.rotation.y += (targetX - world.rotation.y) * 0.035;
    world.rotation.x += (-0.13 + targetY - world.rotation.x) * 0.035;

    terrain.surface.material.uniforms.uTime.value = state.time;
    terrain.wireMajor.material.opacity = 0.32 + Math.sin(state.time * 0.32) * 0.025;
    terrain.wireMinor.material.opacity = 0.10;
    convergence.update(state.time);
    routes.forEach((route, id) => route.update(state.time, id === state.activeScenario));
    beacons.forEach((beacon, id) => beacon.update(state.time, id === state.activeScenario));
    riskZones.forEach((zone, index) => zone.update(state.time + index * 1.4));
    updateEvidenceStreams(streams, state.time);

    renderer.render(scene, camera);
  }

  function tick() {
    state.time += 0.016;
    render();
    if (state.running) state.raf = requestAnimationFrame(tick);
  }

  resize();
  setScenario("rec");
  render();
  if (state.running) state.raf = requestAnimationFrame(tick);

  return {
    setScenario,
    setPaused(paused) {
      state.running = !paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cancelAnimationFrame(state.raf);
      if (state.running) state.raf = requestAnimationFrame(tick);
      else render();
    },
    destroy() {
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      renderer.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
        else object.material?.dispose?.();
      });
    }
  };
}

function scenarioIndex(id) {
  return { bull: 0, side: 1, bear: 2, rec: 3 }[id] ?? 3;
}

function gaussian(x, z, cx, cz, sx, sz, amplitude) {
  return Math.exp(-(((x - cx) / sx) ** 2 + ((z - cz) / sz) ** 2)) * amplitude;
}

function ridge(x, z, angle, frequency, amplitude) {
  const direction = x * Math.cos(angle) + z * Math.sin(angle);
  return Math.pow(Math.abs(Math.sin(direction * frequency)), 2.8) * amplitude;
}

function terrainHeight(x, z) {
  const base = Math.sin(x * 0.7 + z * 0.35) * 0.08 + Math.cos(z * 1.15 - x * 0.22) * 0.07;
  const broad = gaussian(x,z,-1.6,0.6,1.65,1.2,1.25) + gaussian(x,z,0.35,0.75,1.35,1.05,1.0) + gaussian(x,z,2.45,-0.55,1.45,1.25,1.18);
  const peaks = gaussian(x,z,-2.05,1.42,0.42,0.4,0.62) + gaussian(x,z,-0.1,1.08,0.48,0.42,0.56) + gaussian(x,z,1.85,1.34,0.48,0.46,0.7) + gaussian(x,z,3.35,-1.12,0.6,0.45,0.6);
  const channels = -gaussian(x,z,-0.8,-0.25,2.4,0.28,0.34) - gaussian(x,z,1.4,-0.55,2.2,0.32,0.26);
  const risks = -gaussian(x,z,-1.95,-1.65,0.5,0.42,0.82) - gaussian(x,z,1.9,-1.72,0.55,0.46,0.9);
  const directional = ridge(x + 0.3, z - 0.2, 0.35, 1.1, 0.08) + ridge(x, z, -0.55, 0.9, 0.07);
  return base + broad + peaks + channels + risks + directional;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(12.8, 7.2, 144, 92);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const z = position.getZ(i);
    position.setY(i, terrainHeight(x, z));
  }
  geometry.computeVertexNormals();

  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: true,
    uniforms: { uTime: { value: 0 }, uActiveRegion: { value: 3 } },
    vertexShader: `varying float vH; varying vec3 vP; void main(){vH=position.y;vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      varying float vH; varying vec3 vP; uniform float uTime; uniform float uActiveRegion;
      float influence(vec2 p, vec2 c, float r){return exp(-dot(p-c,p-c)/(r*r));}
      void main(){
        vec2 p=vP.xz;
        float bull=influence(p,vec2(-2.05,1.42),1.5);
        float side=influence(p,vec2(-0.1,1.08),1.45);
        float bear=influence(p,vec2(1.85,1.34),1.55);
        float rec=influence(p,vec2(2.7,-0.85),2.0);
        float risk=max(influence(p,vec2(-1.95,-1.65),.72),influence(p,vec2(1.9,-1.72),.78));
        float contourMinor=1.0-smoothstep(.08,.16,abs(fract((vH+2.0)*10.0)-.5));
        float contourMajor=1.0-smoothstep(.12,.22,abs(fract((vH+2.0)*4.0)-.5));
        vec3 base=mix(vec3(.008,.022,.038),vec3(.018,.075,.11),clamp((vH+.9)/2.6,0.0,1.0));
        vec3 color=base;
        color+=vec3(.01,.35,.38)*bull*.62;
        color+=vec3(.02,.18,.52)*side*.62;
        color+=vec3(.5,.16,.025)*bear*.56;
        color+=vec3(.30,.12,.48)*rec*.56;
        color=mix(color,vec3(.45,.015,.01),risk*.64);
        float activeBull=1.0-step(.5,abs(uActiveRegion-0.0));
        float activeSide=1.0-step(.5,abs(uActiveRegion-1.0));
        float activeBear=1.0-step(.5,abs(uActiveRegion-2.0));
        float activeRec=1.0-step(.5,abs(uActiveRegion-3.0));
        color+=vec3(.02,.22,.25)*bull*activeBull*.5;
        color+=vec3(.02,.10,.36)*side*activeSide*.5;
        color+=vec3(.32,.08,.01)*bear*activeBear*.55;
        color+=vec3(.22,.08,.38)*rec*activeRec*.55;
        color+=vec3(.03,.28,.38)*contourMinor*.52+vec3(.11,.45,.58)*contourMajor*.55;
        color+=vec3(.4,.0,.0)*risk*(.28+.12*sin(uTime*2.4));
        float edge=smoothstep(6.9,4.5,length(p));
        gl_FragColor=vec4(color,(.48+contourMinor*.32+contourMajor*.2)*edge);
      }
    `
  });

  const surface = new THREE.Mesh(geometry, material);
  surface.position.y = -0.72;

  const major = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x247ea8, transparent: true, opacity: 0.32 }));
  major.position.copy(surface.position);
  const minor = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x0e3952, transparent: true, opacity: 0.1 }));
  minor.scale.set(1.003,1.003,1.003);
  minor.position.copy(surface.position);
  return { surface, wireMajor: major, wireMinor: minor };
}

function pointOnTerrain(x, z, offset = 0.035) {
  return new THREE.Vector3(x, terrainHeight(x, z) - 0.72 + offset, z);
}

function createRoute(id) {
  const scenario = SCENARIOS[id];
  const points = ROUTES[id].map(([x,z]) => pointOnTerrain(x,z,id === "rec" ? 0.055 : 0.04));
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.45);
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 140, id === "rec" ? 0.034 : 0.026, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.9 : 0.42 }));
  const halo = new THREE.Mesh(new THREE.TubeGeometry(curve, 140, id === "rec" ? 0.105 : 0.074, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.12 : 0.05, depthWrite: false, blending: THREE.AdditiveBlending }));
  const ground = new THREE.Mesh(new THREE.TubeGeometry(curve, 140, id === "rec" ? 0.16 : 0.11, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.045 : 0.018, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(ground, halo, core);

  const markers = Array.from({ length: id === "rec" ? 14 : 9 }, (_, index) => {
    const marker = new THREE.Mesh(new THREE.SphereGeometry(id === "rec" ? 0.055 : 0.044, 10, 10), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, blending: THREE.AdditiveBlending }));
    marker.userData.offset = index / (id === "rec" ? 14 : 9);
    group.add(marker);
    return marker;
  });

  return {
    group,
    setEmphasis(active, recommended) {
      const base = active ? 1 : recommended ? 0.38 : 0.16;
      core.material.opacity = base;
      halo.material.opacity = active ? 0.18 : recommended ? 0.07 : 0.018;
      ground.material.opacity = active ? 0.07 : recommended ? 0.03 : 0.01;
    },
    update(time, active) {
      markers.forEach((marker) => {
        const p = (marker.userData.offset + time * (active ? 0.09 : 0.035)) % 1;
        marker.position.copy(curve.getPointAt(p));
        marker.material.opacity = active ? 0.95 : id === "rec" ? 0.36 : 0.12;
        marker.visible = active || id === "rec" || marker.userData.offset < 0.28;
      });
      halo.material.opacity *= 0.995 + Math.sin(time*2.1)*0.005;
    }
  };
}

function createConvergenceCore() {
  const group = new THREE.Group();
  group.position.copy(pointOnTerrain(-3.55,-0.12,0.08));
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12,18,18), new THREE.MeshBasicMaterial({ color: 0xeafcff, blending: THREE.AdditiveBlending }));
  group.add(core);
  const rings = [];
  for (let i=0;i<4;i+=1) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.16+i*.12,0.175+i*.12,64),new THREE.MeshBasicMaterial({color:0x72e7ff,transparent:true,opacity:.36-i*.05,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
    ring.rotation.x=-Math.PI/2; ring.userData.phase=i*.23; group.add(ring); rings.push(ring);
  }
  return { group, update(time){ core.scale.setScalar(1+Math.sin(time*3.2)*.15); rings.forEach((ring)=>{const p=(time*.25+ring.userData.phase)%1;ring.scale.setScalar(.85+p*.8);ring.material.opacity=(1-p)*.42;}); } };
}

function createBeacon(id) {
  const scenario = SCENARIOS[id];
  const [x,z] = scenario.endpoint;
  const group = new THREE.Group();
  group.position.copy(pointOnTerrain(x,z,0.02));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.46,64),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
  disc.rotation.x=-Math.PI/2; group.add(disc);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.5,8),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.65}));
  stem.position.y=.82; group.add(stem);
  const core = new THREE.Mesh(new THREE.SphereGeometry(.09,16,16),new THREE.MeshBasicMaterial({color:scenario.color,blending:THREE.AdditiveBlending}));
  core.position.y=.04; group.add(core);
  const rings=[];
  for(let i=0;i<4;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.14+i*.1,.155+i*.1,56),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.38-i*.05,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.2;group.add(ring);rings.push(ring);}
  return { group, setActive(active){group.scale.setScalar(active?1.2:.92);}, update(time,active){core.scale.setScalar(1+Math.sin(time*3)* (active?.22:.08));disc.material.opacity=active?.16:.055;rings.forEach((ring)=>{const p=(time*.22+ring.userData.phase)%1;ring.scale.setScalar(.9+p*.8);ring.material.opacity=(active?.48:.15)*(1-p);});} };
}

function createRiskZone(x,z) {
  const group = new THREE.Group(); group.position.copy(pointOnTerrain(x,z,0.025));
  const core = new THREE.Mesh(new THREE.SphereGeometry(.09,14,14),new THREE.MeshBasicMaterial({color:0xff241e,transparent:true,opacity:.9,blending:THREE.AdditiveBlending})); group.add(core);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(.5,64),new THREE.MeshBasicMaterial({color:0xff3028,transparent:true,opacity:.11,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));disc.rotation.x=-Math.PI/2;group.add(disc);
  const rings=[]; for(let i=0;i<5;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.14+i*.11,.155+i*.11,56),new THREE.MeshBasicMaterial({color:0xff3b34,transparent:true,opacity:.36-i*.045,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.16;group.add(ring);rings.push(ring);}
  return {group,update(time){core.scale.setScalar(1+Math.sin(time*4)*.2);disc.material.opacity=.09+Math.sin(time*2.4)*.025;rings.forEach((ring)=>{const p=(time*.28+ring.userData.phase)%1;ring.scale.setScalar(.85+p*.9);ring.material.opacity=(1-p)*.4;});}};
}

function createEvidenceStreams() {
  const colors=[0x3977ff,0x8d55ff,0xb667ff,0x1fd1d7,0x7adf70,0xe6dc52,0xff9b36,0xff792f,0xff3c34];
  const particles=[]; const positions=[]; const particleColors=[]; const lines=new THREE.Group();
  colors.forEach((color,lane)=>{
    const startZ=2.15-lane*.5;
    const end=pointOnTerrain(-3.55,-.12,.09);
    const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-6.15,.18,startZ),new THREE.Vector3(-5.05,.2+lane*.02,startZ*.72),new THREE.Vector3(-4.15,.3,-.18+lane*.018),end);
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.48})); lines.add(line);
    for(let i=0;i<12;i+=1){const progress=(i/12+lane*.061)%1;const p=curve.getPointAt(progress);positions.push(p.x,p.y,p.z);const c=new THREE.Color(color);particleColors.push(c.r,c.g,c.b);particles.push({curve,progress,speed:.0018+lane*.00004});}
  });
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(particleColors,3));
  const points=new THREE.Points(geometry,new THREE.PointsMaterial({size:.075,vertexColors:true,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));
  return {lines,points,particles};
}

function updateEvidenceStreams(streams,time){const position=streams.points.geometry.attributes.position;streams.particles.forEach((particle,index)=>{particle.progress=(particle.progress+particle.speed)%1;const p=particle.curve.getPointAt(particle.progress);p.y+=Math.sin(time*2.4+index)*.015;position.setXYZ(index,p.x,p.y,p.z);});position.needsUpdate=true;}
