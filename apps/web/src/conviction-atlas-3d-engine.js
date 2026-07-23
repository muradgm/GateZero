import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm";

const SCENARIOS = {
  bull: { label: "Bull case", probability: 28, color: 0x20d5ea, risk: 24, bias: "Bullish", endpoint: [-1.6, 1.35] },
  side: { label: "Sideways", probability: 18, color: 0x2787ff, risk: 31, bias: "Neutral", endpoint: [0.1, 1.05] },
  bear: { label: "Bear case", probability: 22, color: 0xff8b35, risk: 67, bias: "Bearish", endpoint: [1.7, 1.25] },
  rec: { label: "Recommended path", probability: 62, color: 0xc4a5ff, risk: 38, bias: "Moderately Bullish", endpoint: [2.9, -1.25] }
};

const ROUTES = {
  bull: [[-4.8, -0.55], [-3.3, -0.35], [-2.5, 0.2], [-1.6, 1.35]],
  side: [[-4.8, -0.15], [-3.1, 0.15], [-1.7, 0.55], [0.1, 1.05]],
  bear: [[-4.8, 0.25], [-2.7, 0.45], [-0.3, 0.6], [1.7, 1.25]],
  rec: [[-3.8, -0.8], [-2.2, -0.45], [-0.4, -0.55], [1.2, -0.35], [2.9, -1.25]]
};

export function mountConvictionAtlas3D({ canvas, root, onScenarioChange }) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Missing Conviction Atlas canvas.");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x02060b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02060b, 0.055);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 7.2, 10.8);
  camera.lookAt(0, 0, 0);

  const world = new THREE.Group();
  world.rotation.x = -0.08;
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x5d91b8, 0x020306, 0.45));
  const key = new THREE.DirectionalLight(0x84d8ff, 1.15);
  key.position.set(-3, 8, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0xa56cff, 14, 20, 2);
  rim.position.set(2, 3, 1);
  scene.add(rim);

  const state = {
    activeScenario: "rec",
    running: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    raf: 0,
    time: 0,
    pointerX: 0,
    pointerY: 0
  };

  const terrain = createTerrain();
  world.add(terrain.surface, terrain.wire);

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

  const riskZones = [createRiskZone(-1.8, -1.65), createRiskZone(1.75, -1.72)];
  riskZones.forEach((zone) => world.add(zone));

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
  canvas.addEventListener("pointerleave", () => {
    state.pointerX = 0;
    state.pointerY = 0;
  });

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
    const targetX = state.pointerX * 0.32;
    const targetY = state.pointerY * 0.14;
    world.rotation.y += (targetX - world.rotation.y) * 0.035;
    world.rotation.x += (-0.08 + targetY - world.rotation.x) * 0.035;

    terrain.surface.material.uniforms.uTime.value = state.time;
    terrain.wire.material.opacity = 0.28 + Math.sin(state.time * 0.35) * 0.025;

    routes.forEach((route, id) => route.update(state.time, id === state.activeScenario));
    beacons.forEach((beacon, id) => updateBeacon(beacon, state.time, id === state.activeScenario));
    riskZones.forEach((zone, index) => updateRiskZone(zone, state.time + index * 1.8));
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

function terrainHeight(x, z) {
  const ridgeA = Math.exp(-((x + 1.7) ** 2 + (z - 0.55) ** 2) * 0.42) * 1.25;
  const ridgeB = Math.exp(-((x - 0.7) ** 2 + (z - 0.8) ** 2) * 0.52) * 1.0;
  const ridgeC = Math.exp(-((x - 2.4) ** 2 + (z + 0.65) ** 2) * 0.5) * 1.15;
  const basinA = Math.exp(-((x + 1.8) ** 2 + (z + 1.6) ** 2) * 1.4) * -0.5;
  const basinB = Math.exp(-((x - 1.75) ** 2 + (z + 1.72) ** 2) * 1.25) * -0.62;
  const noise = Math.sin(x * 1.15 + z * 0.8) * 0.12 + Math.cos(z * 1.65 - x * 0.4) * 0.09;
  return ridgeA + ridgeB + ridgeC + basinA + basinB + noise;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(11.5, 6.6, 96, 64);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const z = position.getZ(index);
    position.setY(index, terrainHeight(x, z));
  }
  geometry.computeVertexNormals();

  const surfaceMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying float vHeight;
      varying vec3 vPosition;
      void main(){
        vHeight = position.y;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying float vHeight;
      varying vec3 vPosition;
      uniform float uTime;
      void main(){
        float contour = smoothstep(.46,.52,fract((vHeight + 1.8) * 7.0));
        float gridX = smoothstep(.96,1.0,abs(sin(vPosition.x * 5.0)));
        float gridZ = smoothstep(.97,1.0,abs(sin(vPosition.z * 5.0)));
        vec3 low = vec3(.012,.035,.06);
        vec3 high = vec3(.03,.18,.27);
        vec3 color = mix(low, high, clamp((vHeight + .6) / 2.1,0.0,1.0));
        color += vec3(.02,.22,.32) * contour * .55;
        color += vec3(.04,.12,.18) * (gridX + gridZ) * .18;
        float edge = smoothstep(6.0,3.2,length(vPosition.xz));
        gl_FragColor = vec4(color, (.48 + contour * .26) * edge);
      }
    `
  });

  const surface = new THREE.Mesh(geometry, surfaceMaterial);
  surface.position.y = -0.65;

  const wireGeometry = new THREE.WireframeGeometry(geometry);
  const wireMaterial = new THREE.LineBasicMaterial({ color: 0x22709a, transparent: true, opacity: 0.28 });
  const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
  wire.position.copy(surface.position);

  return { surface, wire };
}

function createRoute(id) {
  const scenario = SCENARIOS[id];
  const points = ROUTES[id].map(([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) - 0.44, z));
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);
  const group = new THREE.Group();

  const baseGeometry = new THREE.TubeGeometry(curve, 90, id === "rec" ? 0.045 : 0.026, 8, false);
  const baseMaterial = new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.88 : 0.26 });
  const tube = new THREE.Mesh(baseGeometry, baseMaterial);
  group.add(tube);

  const haloGeometry = new THREE.TubeGeometry(curve, 90, id === "rec" ? 0.12 : 0.075, 8, false);
  const haloMaterial = new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: id === "rec" ? 0.12 : 0.035, depthWrite: false, blending: THREE.AdditiveBlending });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  group.add(halo);

  const markerGeometry = new THREE.SphereGeometry(id === "rec" ? 0.085 : 0.055, 12, 12);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: scenario.color, blending: THREE.AdditiveBlending });
  const markers = Array.from({ length: id === "rec" ? 13 : 8 }, (_, index) => {
    const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
    marker.userData.offset = index / (id === "rec" ? 13 : 8);
    group.add(marker);
    return marker;
  });

  return {
    group,
    setActive(active) {
      baseMaterial.opacity = active ? 1 : 0.2;
      haloMaterial.opacity = active ? 0.2 : 0.025;
      tube.scale.setScalar(active ? 1.35 : 1);
    },
    update(time, active) {
      markers.forEach((marker) => {
        const progress = (marker.userData.offset + time * (active ? 0.11 : 0.045)) % 1;
        marker.position.copy(curve.getPointAt(progress));
        marker.material.opacity = active ? 0.95 : 0.2;
        marker.visible = active || marker.userData.offset < 0.35;
      });
      haloMaterial.opacity = (active ? 0.16 : 0.025) * (0.85 + Math.sin(time * 2.2) * 0.15);
    }
  };
}

function createBeacon(id) {
  const scenario = SCENARIOS[id];
  const [x, z] = scenario.endpoint;
  const y = terrainHeight(x, z) - 0.5;
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.35, 6), new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: 0.7 }));
  stem.position.y = 0.78;
  group.add(stem);

  for (let index = 0; index < 3; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.13 + index * 0.12, 0.145 + index * 0.12, 48),
      new THREE.MeshBasicMaterial({ color: scenario.color, transparent: true, opacity: 0.55 - index * 0.13, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.userData.index = index;
    group.add(ring);
  }

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 18), new THREE.MeshBasicMaterial({ color: scenario.color, blending: THREE.AdditiveBlending }));
  core.position.y = 0.04;
  group.add(core);
  group.userData.core = core;
  return group;
}

function setBeaconActive(beacon, active) {
  beacon.userData.active = active;
  beacon.scale.setScalar(active ? 1.28 : 0.9);
}

function updateBeacon(beacon, time, active) {
  beacon.rotation.y += active ? 0.006 : 0.002;
  beacon.children.forEach((child) => {
    if (child.geometry?.type === "RingGeometry") {
      const index = child.userData.index || 0;
      const scale = 1 + ((time * 0.35 + index * 0.27) % 1) * 1.1;
      child.scale.setScalar(scale);
      child.material.opacity = (active ? 0.52 : 0.15) * (1.8 - scale);
    }
  });
  beacon.userData.core.scale.setScalar(1 + Math.sin(time * 3.2) * (active ? 0.22 : 0.08));
}

function createRiskZone(x, z) {
  const y = terrainHeight(x, z) - 0.54;
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.48, 56),
    new THREE.MeshBasicMaterial({ color: 0xff3028, transparent: true, opacity: 0.075, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  disc.rotation.x = -Math.PI / 2;
  group.add(disc);

  for (let index = 0; index < 4; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.16 + index * 0.13, 0.175 + index * 0.13, 48),
      new THREE.MeshBasicMaterial({ color: 0xff3b34, transparent: true, opacity: 0.4 - index * 0.07, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.userData.phase = index * 0.7;
    group.add(ring);
  }
  return group;
}

function updateRiskZone(zone, time) {
  zone.children.forEach((child) => {
    if (child.geometry?.type === "RingGeometry") {
      const pulse = 1 + Math.sin(time * 2 + child.userData.phase) * 0.09;
      child.scale.setScalar(pulse);
    }
  });
}

function createEvidenceStreams() {
  const colors = [0x3977ff,0x8d55ff,0xb667ff,0x1fd1d7,0x7adf70,0xe6dc52,0xff9b36,0xff792f,0xff3c34];
  const particles = [];
  const positions = [];
  const particleColors = [];
  const lineGroup = new THREE.Group();

  colors.forEach((color, lane) => {
    const startZ = 1.9 - lane * 0.43;
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-5.4, 0.1, startZ),
      new THREE.Vector3(-4.0, 0.2 + lane * 0.03, startZ * 0.65),
      new THREE.Vector3(-3.0, 0.35, -0.1 + lane * 0.025),
      new THREE.Vector3(-2.15, terrainHeight(-2.15, -0.05) - 0.34, -0.05)
    );

    const linePoints = curve.getPoints(48);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.36 });
    lineGroup.add(new THREE.Line(lineGeometry, lineMaterial));

    for (let index = 0; index < 10; index += 1) {
      const progress = (index / 10 + lane * 0.073) % 1;
      const point = curve.getPointAt(progress);
      positions.push(point.x, point.y, point.z);
      const c = new THREE.Color(color);
      particleColors.push(c.r, c.g, c.b);
      particles.push({ curve, progress, speed: 0.0014 + lane * 0.00005 });
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(particleColors, 3));
  const material = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  return { points, lines: lineGroup, particles };
}

function updateEvidenceStreams(streams, time) {
  const position = streams.points.geometry.attributes.position;
  streams.particles.forEach((particle, index) => {
    particle.progress = (particle.progress + particle.speed) % 1;
    const point = particle.curve.getPointAt(particle.progress);
    point.y += Math.sin(time * 2.5 + index) * 0.018;
    position.setXYZ(index, point.x, point.y, point.z);
  });
  position.needsUpdate = true;
}
