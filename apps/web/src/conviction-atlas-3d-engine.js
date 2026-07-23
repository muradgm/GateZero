import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm";

const SCENARIOS = {
  bull: { label: "Bull case", probability: 28, color: 0x20d5ea, risk: 24, bias: "Bullish", endpoint: [-2.45, 1.55] },
  side: { label: "Sideways", probability: 18, color: 0x2787ff, risk: 31, bias: "Neutral", endpoint: [-0.2, 1.35] },
  bear: { label: "Bear case", probability: 22, color: 0xff8b35, risk: 67, bias: "Bearish", endpoint: [2.0, 1.55] },
  rec: { label: "Recommended path", probability: 62, color: 0xc4a5ff, risk: 38, bias: "Moderately Bullish", endpoint: [3.85, -1.3] }
};

const ROUTES = {
  bull: [[-4.35,-0.45],[-3.72,-0.18],[-3.2,0.38],[-2.82,0.98],[-2.45,1.55]],
  side: [[-4.35,-0.2],[-3.45,0.12],[-2.55,0.58],[-1.35,1.02],[-0.2,1.35]],
  bear: [[-4.35,0.02],[-3.25,0.28],[-1.95,0.58],[-0.55,0.84],[0.75,1.12],[2.0,1.55]],
  rec: [[-4.05,-0.62],[-3.25,-0.18],[-2.15,-0.32],[-1.15,-0.72],[-0.05,-0.52],[0.95,-0.18],[1.95,-0.68],[2.85,-0.86],[3.85,-1.3]]
};

export function mountConvictionAtlas3D({ canvas, root, onScenarioChange }) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Missing Conviction Atlas canvas.");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x02060b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02060b, 0.085);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 90);
  camera.position.set(-0.55, 5.35, 8.25);
  camera.lookAt(0.45, -0.55, 0.05);

  const world = new THREE.Group();
  world.rotation.x = -0.18;
  world.scale.set(1.18, 1.18, 1.18);
  world.position.set(0, -0.42, 0.25);
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x3f7297, 0x010204, 0.28));
  const cyanKey = new THREE.DirectionalLight(0x71e9ff, 1.5);
  cyanKey.position.set(-5, 8, 5);
  scene.add(cyanKey);
  const violetRim = new THREE.PointLight(0xb56cff, 20, 24, 2);
  violetRim.position.set(3.4, 3.8, -1.8);
  scene.add(violetRim);
  const orangeFill = new THREE.PointLight(0xff8b35, 14, 20, 2);
  orangeFill.position.set(2.1, 2.7, 1.5);
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
  world.add(terrain.surface, terrain.meshLines);

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
    world.add(beacon.group);
  });

  const riskZones = [createRiskZone(-2.15, -1.8), createRiskZone(2.15, -1.85)];
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
    const targetX = state.pointerX * 0.18;
    const targetY = state.pointerY * 0.055;
    world.rotation.y += (targetX - world.rotation.y) * 0.035;
    world.rotation.x += (-0.18 + targetY - world.rotation.x) * 0.035;

    terrain.surface.material.uniforms.uTime.value = state.time;
    terrain.meshLines.material.opacity = 0.055 + Math.sin(state.time * 0.24) * 0.006;
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

function warpedRidge(x, z, angle, frequency, amplitude, warp) {
  const wx = x + Math.sin(z * 1.3) * warp;
  const wz = z + Math.cos(x * 1.1) * warp;
  const direction = wx * Math.cos(angle) + wz * Math.sin(angle);
  return Math.pow(Math.max(0, Math.sin(direction * frequency)), 4.2) * amplitude;
}

function terrainHeight(x, z) {
  const base = Math.sin(x * 0.46 + z * 0.31) * 0.055 + Math.cos(z * 0.92 - x * 0.18) * 0.045;
  const broad = gaussian(x,z,-2.0,0.65,1.75,1.3,1.08) + gaussian(x,z,0.15,0.8,1.5,1.15,0.92) + gaussian(x,z,2.55,-0.5,1.55,1.35,1.05);
  const peaks = gaussian(x,z,-2.45,1.55,0.34,0.32,0.9) + gaussian(x,z,-0.2,1.35,0.36,0.34,0.76) + gaussian(x,z,2.0,1.55,0.38,0.36,0.96) + gaussian(x,z,3.85,-1.3,0.5,0.4,0.76);
  const secondary = gaussian(x,z,-1.3,0.15,0.5,0.36,0.38) + gaussian(x,z,0.9,-0.05,0.55,0.38,0.32) + gaussian(x,z,2.7,0.2,0.48,0.35,0.3);
  const channels = -gaussian(x,z,-0.9,-0.28,2.7,0.2,0.42) - gaussian(x,z,1.5,-0.62,2.4,0.24,0.36) - gaussian(x,z,-2.8,-0.45,1.3,0.18,0.22);
  const risks = -gaussian(x,z,-2.15,-1.8,0.46,0.38,1.05) - gaussian(x,z,2.15,-1.85,0.5,0.42,1.08);
  const ridges = warpedRidge(x+0.2,z-0.1,0.35,1.55,0.09,0.16) + warpedRidge(x-0.25,z+0.2,-0.62,1.35,0.075,0.18);
  return base + broad + peaks + secondary + channels + risks + ridges;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(15.8, 8.8, 180, 112);
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
        float bull=influence(p,vec2(-2.45,1.55),1.7);
        float side=influence(p,vec2(-0.2,1.35),1.65);
        float bear=influence(p,vec2(2.0,1.55),1.75);
        float rec=influence(p,vec2(3.0,-0.95),2.3);
        float risk=max(influence(p,vec2(-2.15,-1.8),.72),influence(p,vec2(2.15,-1.85),.76));
        float rawMinor=abs(fract((vH+2.2)*16.0)-.5);
        float rawMajor=abs(fract((vH+2.2)*5.0)-.5);
        float contourMinor=1.0-smoothstep(.455,.5,rawMinor);
        float contourMajor=1.0-smoothstep(.41,.5,rawMajor);
        vec3 color=vec3(.004,.012,.022);
        color+=vec3(.0,.05,.075)*clamp((vH+.95)/2.7,0.0,1.0);
        color+=vec3(.005,.34,.42)*bull*.68;
        color+=vec3(.01,.14,.56)*side*.76;
        color+=vec3(.72,.19,.02)*bear*.72;
        color+=vec3(.38,.11,.68)*rec*.74;
        color=mix(color,vec3(.46,.006,.004),risk*.82);
        float a0=1.0-step(.5,abs(uActiveRegion-0.0));
        float a1=1.0-step(.5,abs(uActiveRegion-1.0));
        float a2=1.0-step(.5,abs(uActiveRegion-2.0));
        float a3=1.0-step(.5,abs(uActiveRegion-3.0));
        color+=vec3(.02,.35,.38)*bull*a0*.78;
        color+=vec3(.02,.12,.5)*side*a1*.78;
        color+=vec3(.62,.12,.0)*bear*a2*.85;
        color+=vec3(.38,.09,.58)*rec*a3*.82;
        color+=vec3(.025,.22,.29)*contourMinor*.5;
        color+=vec3(.1,.48,.62)*contourMajor*.75;
        color+=vec3(.62,.0,.0)*risk*(.42+.16*sin(uTime*2.8));
        float edge=smoothstep(8.2,5.3,length(p));
        gl_FragColor=vec4(color,(.36+contourMinor*.34+contourMajor*.28)*edge);
      }
    `
  });

  const surface = new THREE.Mesh(geometry, material);
  surface.position.y = -0.78;

  const meshLines = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x0d4059, transparent: true, opacity: 0.055 })
  );
  meshLines.position.copy(surface.position);
  return { surface, meshLines };
}

function pointOnTerrain(x, z, offset = 0.035) {
  return new THREE.Vector3(x, terrainHeight(x, z) - 0.78 + offset, z);
}

function createRoute(id) {
  const scenario = SCENARIOS[id];
  const points = ROUTES[id].map(([x,z]) => pointOnTerrain(x,z,id === "rec" ? 0.06 : 0.045));
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.52);
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, id === "rec" ? 0.03 : 0.025, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.82 : 0.38 }));
  const halo = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, id === "rec" ? 0.082 : 0.06, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.11 : 0.04, depthWrite: false, blending: THREE.AdditiveBlending }));
  const ground = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, id === "rec" ? 0.14 : 0.1, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.04 : 0.014, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(ground, halo, core);

  const markers = Array.from({ length: id === "rec" ? 16 : 10 }, (_, index) => {
    const marker = new THREE.Mesh(new THREE.SphereGeometry(id === "rec" ? 0.052 : 0.043, 10, 10), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, blending: THREE.AdditiveBlending }));
    marker.userData.offset = index / (id === "rec" ? 16 : 10);
    group.add(marker);
    return marker;
  });

  return {
    group,
    setEmphasis(active, recommended) {
      core.material.opacity = active ? 1 : recommended ? 0.48 : 0.14;
      halo.material.opacity = active ? 0.18 : recommended ? 0.09 : 0.014;
      ground.material.opacity = active ? 0.065 : recommended ? 0.035 : 0.008;
    },
    update(time, active) {
      markers.forEach((marker) => {
        const p = (marker.userData.offset + time * (active ? 0.095 : 0.034)) % 1;
        marker.position.copy(curve.getPointAt(p));
        marker.material.opacity = active ? 0.98 : id === "rec" ? 0.42 : 0.1;
        marker.visible = active || id === "rec" || marker.userData.offset < 0.2;
      });
    }
  };
}

function createConvergenceCore() {
  const group = new THREE.Group();
  group.position.copy(pointOnTerrain(-4.15,-0.18,0.11));
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.16,20,20), new THREE.MeshBasicMaterial({ color: 0xf1fdff, blending: THREE.AdditiveBlending }));
  group.add(core);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.34,20,20), new THREE.MeshBasicMaterial({ color: 0x67e4ff, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(halo);
  const rings = [];
  for (let i=0;i<5;i+=1) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.19+i*.14,0.205+i*.14,72),new THREE.MeshBasicMaterial({color:0x78ebff,transparent:true,opacity:.42-i*.055,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
    ring.rotation.x=-Math.PI/2; ring.userData.phase=i*.18; group.add(ring); rings.push(ring);
  }
  const bridgeCurve = new THREE.CatmullRomCurve3([pointOnTerrain(-4.1,-.18,.08),pointOnTerrain(-3.55,-.02,.06),pointOnTerrain(-3.05,.1,.05)],false,"centripetal",.5);
  const bridge = new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve,60,.035,8,false),new THREE.MeshBasicMaterial({color:0xdffaff,transparent:true,opacity:.8,blending:THREE.AdditiveBlending}));
  group.add(bridge);
  bridge.position.sub(group.position);
  return { group, update(time){ core.scale.setScalar(1+Math.sin(time*3.6)*.18);halo.scale.setScalar(1+Math.sin(time*2.4)*.1);rings.forEach((ring)=>{const p=(time*.28+ring.userData.phase)%1;ring.scale.setScalar(.82+p*.92);ring.material.opacity=(1-p)*.46;}); } };
}

function createBeacon(id) {
  const scenario = SCENARIOS[id];
  const [x,z] = scenario.endpoint;
  const group = new THREE.Group();
  group.position.copy(pointOnTerrain(x,z,0.025));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.56,72),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
  disc.rotation.x=-Math.PI/2; group.add(disc);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,1.72,8),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.72}));
  stem.position.y=.93; group.add(stem);
  const top = new THREE.Mesh(new THREE.SphereGeometry(.075,14,14),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.9,blending:THREE.AdditiveBlending}));
  top.position.y=1.8; group.add(top);
  const core = new THREE.Mesh(new THREE.SphereGeometry(.105,18,18),new THREE.MeshBasicMaterial({color:scenario.color,blending:THREE.AdditiveBlending}));
  core.position.y=.045; group.add(core);
  const rings=[];
  for(let i=0;i<5;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.16+i*.11,.175+i*.11,64),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.48-i*.055,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.18;group.add(ring);rings.push(ring);}
  return { group, setActive(active){group.scale.setScalar(active?1.16:.98);}, update(time,active){core.scale.setScalar(1+Math.sin(time*3.2)*(active?.24:.1));disc.material.opacity=active?.2:.1;stem.material.opacity=active?.9:.55;top.material.opacity=active?1:.72;rings.forEach((ring)=>{const p=(time*.24+ring.userData.phase)%1;ring.scale.setScalar(.88+p*.9);ring.material.opacity=(active?.54:.24)*(1-p);});} };
}

function createRiskZone(x,z) {
  const group = new THREE.Group(); group.position.copy(pointOnTerrain(x,z,0.035));
  const core = new THREE.Mesh(new THREE.SphereGeometry(.13,16,16),new THREE.MeshBasicMaterial({color:0xff1d18,transparent:true,opacity:1,blending:THREE.AdditiveBlending})); group.add(core);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(.64,72),new THREE.MeshBasicMaterial({color:0xff3028,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));disc.rotation.x=-Math.PI/2;group.add(disc);
  const rings=[]; for(let i=0;i<6;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.16+i*.13,.178+i*.13,64),new THREE.MeshBasicMaterial({color:0xff332b,transparent:true,opacity:.46-i*.05,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.14;group.add(ring);rings.push(ring);}
  return {group,update(time){core.scale.setScalar(1+Math.sin(time*4.3)*.24);disc.material.opacity=.14+Math.sin(time*2.6)*.035;rings.forEach((ring)=>{const p=(time*.32+ring.userData.phase)%1;ring.scale.setScalar(.82+p*1.02);ring.material.opacity=(1-p)*.48;});}};
}

function createEvidenceStreams() {
  const colors=[0x3977ff,0x8d55ff,0xb667ff,0x1fd1d7,0x7adf70,0xe6dc52,0xff9b36,0xff792f,0xff3c34];
  const particles=[]; const positions=[]; const particleColors=[]; const lines=new THREE.Group();
  colors.forEach((color,lane)=>{
    const startZ=2.4-lane*.55;
    const end=pointOnTerrain(-4.15,-.18,.11);
    const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-7.1,.22,startZ),new THREE.Vector3(-5.95,.26+lane*.022,startZ*.74),new THREE.Vector3(-4.85,.42,-.22+lane*.02),end);
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(82)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.55})); lines.add(line);
    for(let i=0;i<14;i+=1){const progress=(i/14+lane*.057)%1;const p=curve.getPointAt(progress);positions.push(p.x,p.y,p.z);const c=new THREE.Color(color);particleColors.push(c.r,c.g,c.b);particles.push({curve,progress,speed:.002+lane*.000045});}
  });
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(particleColors,3));
  const points=new THREE.Points(geometry,new THREE.PointsMaterial({size:.082,vertexColors:true,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));
  return {lines,points,particles};
}

function updateEvidenceStreams(streams,time){const position=streams.points.geometry.attributes.position;streams.particles.forEach((particle,index)=>{particle.progress=(particle.progress+particle.speed)%1;const p=particle.curve.getPointAt(particle.progress);p.y+=Math.sin(time*2.6+index)*.016;position.setXYZ(index,p.x,p.y,p.z);});position.needsUpdate=true;}
