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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55));
  renderer.setClearColor(0x02060b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.72;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02060b, 0.095);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 90);
  camera.position.set(-0.45, 5.7, 8.8);
  camera.lookAt(0.4, -0.5, 0.1);

  const world = new THREE.Group();
  world.rotation.x = -0.16;
  world.scale.set(1.13, 1.13, 1.13);
  world.position.set(0, -0.44, 0.2);
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x284a63, 0x010204, 0.16));
  const cyanKey = new THREE.DirectionalLight(0x51d7ff, 0.72);
  cyanKey.position.set(-5, 8, 5);
  scene.add(cyanKey);
  const violetRim = new THREE.PointLight(0xb56cff, 9, 22, 2);
  violetRim.position.set(3.2, 3.5, -1.8);
  scene.add(violetRim);
  const orangeFill = new THREE.PointLight(0xff8b35, 6.5, 18, 2);
  orangeFill.position.set(2.0, 2.4, 1.4);
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
    const targetX = state.pointerX * 0.15;
    const targetY = state.pointerY * 0.045;
    world.rotation.y += (targetX - world.rotation.y) * 0.035;
    world.rotation.x += (-0.16 + targetY - world.rotation.x) * 0.035;

    terrain.surface.material.uniforms.uTime.value = state.time;
    terrain.meshLines.material.opacity = 0.022 + Math.sin(state.time * 0.22) * 0.003;
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
  const base = Math.sin(x * 0.46 + z * 0.31) * 0.045 + Math.cos(z * 0.92 - x * 0.18) * 0.038;
  const broad = gaussian(x,z,-2.0,0.65,1.9,1.45,.74) + gaussian(x,z,0.15,0.8,1.7,1.35,.62) + gaussian(x,z,2.55,-0.5,1.8,1.55,.7);
  const peaks = gaussian(x,z,-2.52,1.48,.5,.34,.58) + gaussian(x,z,-.35,1.28,.58,.38,.46) + gaussian(x,z,2.08,1.42,.48,.34,.62) + gaussian(x,z,3.72,-1.18,.7,.42,.5);
  const shoulders = gaussian(x,z,-1.75,1.12,.95,.32,.24) + gaussian(x,z,.7,.95,.9,.28,.2) + gaussian(x,z,2.75,.9,.9,.3,.2);
  const secondary = gaussian(x,z,-1.3,0.15,.54,.34,.25) + gaussian(x,z,.9,-.05,.58,.36,.22) + gaussian(x,z,2.7,.2,.52,.32,.2);
  const channels = -gaussian(x,z,-.9,-.28,2.7,.2,.38) - gaussian(x,z,1.5,-.62,2.4,.24,.32) - gaussian(x,z,-2.8,-.45,1.3,.18,.18);
  const risks = -gaussian(x,z,-2.15,-1.8,.48,.4,1.1) - gaussian(x,z,2.15,-1.85,.52,.44,1.14);
  const ridges = warpedRidge(x+.2,z-.1,.35,1.55,.08,.16) + warpedRidge(x-.25,z+.2,-.62,1.35,.065,.18);
  return base + broad + peaks + shoulders + secondary + channels + risks + ridges;
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
        float bull=influence(p,vec2(-2.45,1.55),1.55);
        float side=influence(p,vec2(-0.2,1.35),1.5);
        float bear=influence(p,vec2(2.0,1.55),1.6);
        float rec=influence(p,vec2(3.0,-0.95),2.15);
        float risk=max(influence(p,vec2(-2.15,-1.8),.72),influence(p,vec2(2.15,-1.85),.76));
        float rawMinor=abs(fract((vH+2.4)*20.0)-.5);
        float rawMajor=abs(fract((vH+2.4)*6.0)-.5);
        float contourMinor=1.0-smoothstep(.472,.5,rawMinor);
        float contourMajor=1.0-smoothstep(.44,.5,rawMajor);
        float a0=1.0-step(.5,abs(uActiveRegion-0.0));
        float a1=1.0-step(.5,abs(uActiveRegion-1.0));
        float a2=1.0-step(.5,abs(uActiveRegion-2.0));
        float a3=1.0-step(.5,abs(uActiveRegion-3.0));
        vec3 base=vec3(.0025,.007,.014);
        base+=vec3(.002,.012,.02)*clamp((vH+.9)/2.2,0.0,1.0);
        vec3 regional=vec3(0.0);
        regional+=vec3(.0,.15,.18)*bull*(.42+a0*.58);
        regional+=vec3(.0,.055,.22)*side*(.42+a1*.58);
        regional+=vec3(.24,.055,.003)*bear*(.42+a2*.58);
        regional+=vec3(.13,.035,.24)*rec*(.42+a3*.58);
        vec3 contour=vec3(.015,.16,.22)*contourMinor + vec3(.05,.38,.5)*contourMajor;
        contour+=vec3(.0,.27,.31)*bull*contourMajor;
        contour+=vec3(.02,.13,.5)*side*contourMajor;
        contour+=vec3(.65,.14,.01)*bear*contourMajor;
        contour+=vec3(.38,.1,.64)*rec*contourMajor;
        vec3 color=base+regional+contour;
        color=mix(color,vec3(.09,.001,.001),risk*.9);
        color+=vec3(.75,.005,.002)*risk*contourMajor*(.65+.25*sin(uTime*2.8));
        float edge=smoothstep(8.2,5.3,length(p));
        float alpha=(.18+contourMinor*.46+contourMajor*.34+regional.r*.16+regional.g*.12)*edge;
        gl_FragColor=vec4(color,alpha);
      }
    `
  });

  const surface = new THREE.Mesh(geometry, material);
  surface.position.y = -0.82;

  const meshLines = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x082a3a, transparent: true, opacity: 0.022 })
  );
  meshLines.position.copy(surface.position);
  return { surface, meshLines };
}

function pointOnTerrain(x, z, offset = 0.035) {
  return new THREE.Vector3(x, terrainHeight(x, z) - 0.82 + offset, z);
}

function createRoute(id) {
  const scenario = SCENARIOS[id];
  const points = ROUTES[id].map(([x,z]) => pointOnTerrain(x,z,id === "rec" ? 0.055 : 0.04));
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.52);
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, id === "rec" ? 0.026 : 0.022, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.9 : 0.38 }));
  const halo = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, id === "rec" ? 0.07 : 0.052, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.11 : 0.035, depthWrite: false, blending: THREE.AdditiveBlending }));
  const ground = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, id === "rec" ? 0.12 : 0.085, 8, false), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.032 : 0.01, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(ground, halo, core);

  const markers = Array.from({ length: id === "rec" ? 16 : 10 }, (_, index) => {
    const marker = new THREE.Mesh(new THREE.SphereGeometry(id === "rec" ? 0.045 : 0.038, 10, 10), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, blending: THREE.AdditiveBlending }));
    marker.userData.offset = index / (id === "rec" ? 16 : 10);
    group.add(marker);
    return marker;
  });

  return {
    group,
    setEmphasis(active, recommended) {
      core.material.opacity = active ? 1 : recommended ? 0.42 : 0.12;
      halo.material.opacity = active ? 0.16 : recommended ? 0.075 : 0.012;
      ground.material.opacity = active ? 0.052 : recommended ? 0.026 : 0.006;
    },
    update(time, active) {
      markers.forEach((marker) => {
        const p = (marker.userData.offset + time * (active ? 0.095 : 0.034)) % 1;
        marker.position.copy(curve.getPointAt(p));
        marker.material.opacity = active ? 0.98 : id === "rec" ? 0.4 : 0.08;
        marker.visible = active || id === "rec" || marker.userData.offset < 0.18;
      });
    }
  };
}

function createConvergenceCore() {
  const group = new THREE.Group();
  group.position.copy(pointOnTerrain(-4.15,-0.18,0.11));
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.18,20,20), new THREE.MeshBasicMaterial({ color: 0xf1fdff, blending: THREE.AdditiveBlending }));
  group.add(core);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.42,20,20), new THREE.MeshBasicMaterial({ color: 0x67e4ff, transparent: true, opacity: 0.15, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(halo);
  const rings = [];
  for (let i=0;i<5;i+=1) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.2+i*.15,0.215+i*.15,72),new THREE.MeshBasicMaterial({color:0x78ebff,transparent:true,opacity:.46-i*.055,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
    ring.rotation.x=-Math.PI/2; ring.userData.phase=i*.18; group.add(ring); rings.push(ring);
  }
  const bridgeCurve = new THREE.CatmullRomCurve3([pointOnTerrain(-4.1,-.18,.08),pointOnTerrain(-3.55,-.02,.06),pointOnTerrain(-3.05,.1,.05)],false,"centripetal",.5);
  const bridge = new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve,60,.028,8,false),new THREE.MeshBasicMaterial({color:0xdffaff,transparent:true,opacity:.74,blending:THREE.AdditiveBlending}));
  group.add(bridge);
  bridge.position.sub(group.position);
  return { group, update(time){ core.scale.setScalar(1+Math.sin(time*3.6)*.18);halo.scale.setScalar(1+Math.sin(time*2.4)*.1);rings.forEach((ring)=>{const p=(time*.28+ring.userData.phase)%1;ring.scale.setScalar(.82+p*.92);ring.material.opacity=(1-p)*.46;}); } };
}

function createBeacon(id) {
  const scenario = SCENARIOS[id];
  const [x,z] = scenario.endpoint;
  const group = new THREE.Group();
  group.position.copy(pointOnTerrain(x,z,0.025));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.48,72),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.1,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
  disc.rotation.x=-Math.PI/2; group.add(disc);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,1.15,8),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.58}));
  stem.position.y=.62; group.add(stem);
  const top = new THREE.Mesh(new THREE.SphereGeometry(.052,14,14),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.8,blending:THREE.AdditiveBlending}));
  top.position.y=1.22; group.add(top);
  const core = new THREE.Mesh(new THREE.SphereGeometry(.085,18,18),new THREE.MeshBasicMaterial({color:scenario.color,blending:THREE.AdditiveBlending}));
  core.position.y=.035; group.add(core);
  const rings=[];
  for(let i=0;i<4;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.14+i*.1,.155+i*.1,64),new THREE.MeshBasicMaterial({color:scenario.color,transparent:true,opacity:.4-i*.055,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.2;group.add(ring);rings.push(ring);}
  return { group, setActive(active){group.scale.setScalar(active?1.1:.95);}, update(time,active){core.scale.setScalar(1+Math.sin(time*3.2)*(active?.2:.07));disc.material.opacity=active?.17:.07;stem.material.opacity=active?.78:.38;top.material.opacity=active?.95:.55;rings.forEach((ring)=>{const p=(time*.24+ring.userData.phase)%1;ring.scale.setScalar(.88+p*.82);ring.material.opacity=(active?.48:.18)*(1-p);});} };
}

function createRiskZone(x,z) {
  const group = new THREE.Group(); group.position.copy(pointOnTerrain(x,z,0.035));
  const core = new THREE.Mesh(new THREE.SphereGeometry(.13,16,16),new THREE.MeshBasicMaterial({color:0xff1712,transparent:true,opacity:1,blending:THREE.AdditiveBlending})); group.add(core);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(.62,72),new THREE.MeshBasicMaterial({color:0x240000,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));disc.rotation.x=-Math.PI/2;group.add(disc);
  const rings=[]; for(let i=0;i<6;i+=1){const ring=new THREE.Mesh(new THREE.RingGeometry(.16+i*.13,.176+i*.13,64),new THREE.MeshBasicMaterial({color:0xff332b,transparent:true,opacity:.5-i*.055,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.userData.phase=i*.14;group.add(ring);rings.push(ring);}
  return {group,update(time){core.scale.setScalar(1+Math.sin(time*4.3)*.24);disc.material.opacity=.46+Math.sin(time*2.6)*.06;rings.forEach((ring)=>{const p=(time*.32+ring.userData.phase)%1;ring.scale.setScalar(.82+p*1.02);ring.material.opacity=(1-p)*.5;});}};
}

function createEvidenceStreams() {
  const colors=[0x3977ff,0x8d55ff,0xb667ff,0x1fd1d7,0x7adf70,0xe6dc52,0xff9b36,0xff792f,0xff3c34];
  const particles=[]; const positions=[]; const particleColors=[]; const lines=new THREE.Group();
  colors.forEach((color,lane)=>{
    const startZ=2.4-lane*.55;
    const end=pointOnTerrain(-4.15,-.18,.11);
    const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-7.1,.22,startZ),new THREE.Vector3(-5.95,.26+lane*.022,startZ*.74),new THREE.Vector3(-4.85,.42,-.22+lane*.02),end);
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(82)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.48})); lines.add(line);
    for(let i=0;i<14;i+=1){const progress=(i/14+lane*.057)%1;const p=curve.getPointAt(progress);positions.push(p.x,p.y,p.z);const c=new THREE.Color(color);particleColors.push(c.r,c.g,c.b);particles.push({curve,progress,speed:.002+lane*.000045});}
  });
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(particleColors,3));
  const points=new THREE.Points(geometry,new THREE.PointsMaterial({size:.078,vertexColors:true,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));
  return {lines,points,particles};
}

function updateEvidenceStreams(streams,time){const position=streams.points.geometry.attributes.position;streams.particles.forEach((particle,index)=>{particle.progress=(particle.progress+particle.speed)%1;const p=particle.curve.getPointAt(particle.progress);p.y+=Math.sin(time*2.6+index)*.016;position.setXYZ(index,p.x,p.y,p.z);});position.needsUpdate=true;}
