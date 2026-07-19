import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import fallbackImage from "./assets/evidence-architecture.webp";

const vertexShader = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragmentShader = `
  uniform float uTime; varying vec2 vUv;
  void main(){
    vec2 p=vUv-.5; float radius=length(p*vec2(.78,1.));
    float core=smoothstep(.34,.015,radius);
    float ring=smoothstep(.255,.235,radius)-smoothstep(.29,.27,radius);
    float scan=pow(max(0.,sin((p.y+uTime*.035)*28.)),20.)*.055;
    float grain=fract(sin(dot(vUv+uTime*.001,vec2(12.9898,78.233)))*43758.5453)*.025;
    vec3 color=mix(vec3(.004,.012,.017),vec3(.025,.52,.68),core*.42+ring*.55+scan);
    gl_FragColor=vec4(color,.07+core*.36+ring*.12+grain);
  }`;

type EvidenceStage = "observe" | "frame" | "verify" | "risk" | "review" | "record";
const stageOrder: EvidenceStage[] = ["observe", "frame", "verify", "risk", "review", "record"];

export default function EvidenceScene({
  stage,
  reducedEffects = false
}: {
  stage: EvidenceStage;
  reducedEffects?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(stage);
  const renderRef = useRef<(() => void) | null>(null);
  stageRef.current = stage;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const economical = reducedMotion || reducedEffects;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, economical ? 1 : 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080a, 0.065);
    const camera = new THREE.PerspectiveCamera(31, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0.55, 0.28, 11.9);
    const sculpture = new THREE.Group();
    sculpture.rotation.set(-0.08, 0.31, -0.025);
    sculpture.position.set(0.08, -0.02, 0);
    scene.add(sculpture);
    const scopeGate = new THREE.Group();
    scopeGate.position.set(-1.35, 0, 0);
    scopeGate.scale.setScalar(0.72);
    sculpture.add(scopeGate);

    scene.add(new THREE.HemisphereLight(0xa8bdc5, 0x010203, 0.88));
    const key = new THREE.SpotLight(0xf4f8fa, 58, 25, 0.36, 0.65, 1.5);
    key.position.set(-5.5, 7.5, 6);
    key.target.position.set(-0.6, 0.5, 0);
    scene.add(key, key.target);
    const cyanRim = new THREE.PointLight(0x25d4ff, 28, 8, 2);
    cyanRim.position.set(3.2, -0.2, 1.8);
    scene.add(cyanRim);
    const amberRim = new THREE.PointLight(0xffa928, 7, 7, 2);
    amberRim.position.set(-3.5, -2.8, 2.5);
    scene.add(amberRim);

    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0xa6b0b5,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12
    });
    const darkChrome = new THREE.MeshPhysicalMaterial({
      color: 0x242b2f,
      metalness: 0.65,
      roughness: 0.24,
      clearcoat: 0.75
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x07151c,
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.62,
      thickness: 1.2,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const barGeometry = new RoundedBoxGeometry(1, 1, 1, 7, 0.14);
    const addBar = (
      scale: [number, number, number],
      position: [number, number, number],
      material = chrome
    ) => {
      const bar = new THREE.Mesh(barGeometry, material);
      bar.scale.set(...scale);
      bar.position.set(...position);
      scopeGate.add(bar);
      return bar;
    };
    const leftBar = addBar([0.32, 5.25, 0.48], [-2.34, 0.12, 0.3]);
    const topBar = addBar([3.05, 0.32, 0.48], [-0.83, 2.58, 0.3]);
    const rightBar = addBar([0.32, 5.25, 0.48], [2.34, -0.12, -0.3], darkChrome);
    const bottomBar = addBar([3.05, 0.32, 0.48], [0.83, -2.58, -0.3], darkChrome);

    const panelGeometry = new RoundedBoxGeometry(4.08, 4.08, 0.18, 10, 0.18);
    const glassPanel = new THREE.Mesh(panelGeometry, glass);
    glassPanel.position.z = -0.1;
    scopeGate.add(glassPanel);
    const panelEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(panelGeometry, 38),
      new THREE.LineBasicMaterial({
        color: 0x5edcf4,
        transparent: true,
        opacity: 0.12
      })
    );
    panelEdge.position.copy(glassPanel.position);
    scopeGate.add(panelEdge);
    const membraneMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const membrane = new THREE.Mesh(new THREE.CircleGeometry(1.82, 96), membraneMaterial);
    membrane.position.set(0.18, -0.05, 0.17);
    membrane.scale.set(0.78, 0.88, 1);
    scopeGate.add(membrane);

    const riskMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7a3100,
      emissive: 0xff8f21,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0,
      transmission: 0.16,
      roughness: 0.22,
      depthWrite: false
    });
    const riskBoundary = new THREE.Mesh(
      new RoundedBoxGeometry(0.18, 4.6, 2.9, 6, 0.08),
      riskMaterial
    );
    riskBoundary.position.set(0.72, 0, 0.05);
    riskBoundary.scale.y = 0.001;
    sculpture.add(riskBoundary);
    const riskRailMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x47301f,
      metalness: 0.62,
      roughness: 0.22,
      emissive: 0xff8f21,
      emissiveIntensity: 0.12
    });
    const riskTop = new THREE.Mesh(barGeometry, riskRailMaterial);
    riskTop.scale.set(1.35, 0.18, 0.32);
    riskTop.position.set(0.72, 2.35, 0.05);
    sculpture.add(riskTop);
    const riskBottom = riskTop.clone();
    riskBottom.position.y = -2.35;
    sculpture.add(riskBottom);

    const reviewMaterial = new THREE.MeshBasicMaterial({
      color: 0x25d4ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const reviewRing = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.055, 10, 96), reviewMaterial);
    reviewRing.position.set(2.35, 0, 0.46);
    reviewRing.rotation.y = -0.18;
    sculpture.add(reviewRing);

    const recordMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x10242c,
      emissive: 0x25d4ff,
      emissiveIntensity: 0.32,
      metalness: 0.3,
      roughness: 0.28,
      transparent: true,
      opacity: 0
    });
    const record = new THREE.Mesh(new RoundedBoxGeometry(1.58, 2.12, 0.16, 7, 0.1), recordMaterial);
    record.position.set(4.05, 0, -0.2);
    record.scale.set(0.01, 0.01, 0.01);
    sculpture.add(record);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.135, 3),
      new THREE.MeshStandardMaterial({
        color: 0xbdf7ff,
        emissive: 0x25d4ff,
        emissiveIntensity: 5,
        roughness: 0.14
      })
    );
    core.position.set(2.35, 0, 0.62);
    sculpture.add(core);
    const coreLight = new THREE.PointLight(0x25d4ff, 28, 4.5, 1.7);
    coreLight.position.copy(core.position);
    sculpture.add(coreLight);

    const ribbonMaterial = new THREE.MeshBasicMaterial({
      color: 0x6ee8ff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    for (let index = 0; index < 1; index += 1) {
      const offset = 0;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.8, -1.55 + offset, -1.8),
        new THREE.Vector3(-2.7, -0.8 - offset, -0.55),
        new THREE.Vector3(-0.45, 0.25 + offset, 0.2),
        new THREE.Vector3(2.4, 0.95 - offset, -0.4),
        new THREE.Vector3(4.9, 1.55 + offset, -1.7)
      ]);
      sculpture.add(
        new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.012, 6, false), ribbonMaterial)
      );
    }

    const particles: THREE.Mesh[] = [];
    const particleCount = economical ? 7 : 14;
    for (let index = 0; index < particleCount; index += 1) {
      const contradictory = index === 3 || index === 10;
      const material = new THREE.MeshBasicMaterial({
        color: contradictory ? 0xffa13d : 0x25d4ff,
        transparent: true,
        opacity: 0.7
      });
      const particle = new THREE.Mesh(
        new THREE.OctahedronGeometry(index % 5 === 0 ? 0.11 : 0.055, 0),
        material
      );
      const start = new THREE.Vector3(
        -5.8 - (index % 4) * 0.34,
        -1.65 + (index % 7) * 0.53,
        -1.2 + (index % 3) * 0.7
      );
      const aligned = new THREE.Vector3(
        -1.45 + (index % 5) * 0.62,
        -1.25 + Math.floor(index / 5) * 0.82,
        0.28
      );
      particle.position.copy(start);
      particle.userData = {
        phase: index * 0.61,
        start,
        aligned,
        contradictory
      };
      sculpture.add(particle);
      particles.push(particle);
    }

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 14),
      new THREE.MeshPhysicalMaterial({
        color: 0x050708,
        metalness: 0.55,
        roughness: 0.34,
        transparent: true,
        opacity: 0.75
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -3.45, -1.1);
    scene.add(floor);

    let pointerX = 0,
      pointerY = 0,
      raf = 0,
      inViewport = true,
      running = !document.hidden;
    const pointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const pointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    mount.addEventListener("pointermove", pointerMove);
    mount.addEventListener("pointerleave", pointerLeave);
    const clock = new THREE.Clock();
    const render = () => {
      if (!running) return;
      const time = clock.getElapsedTime();
      membraneMaterial.uniforms.uTime.value = time;
      const stageIndex = stageOrder.indexOf(stageRef.current);
      const frameAmount = stageIndex >= 1 ? 1 : 0;
      const verifyAmount = stageIndex >= 2 ? 1 : 0;
      const riskAmount = stageIndex >= 3 ? 1 : 0;
      const reviewAmount = stageIndex >= 4 ? 1 : 0;
      const recordAmount = stageIndex >= 5 ? 1 : 0;
      const ease = economical ? 1 : 0.045;
      leftBar.position.x += (-3.25 + frameAmount * 0.91 - leftBar.position.x) * ease;
      topBar.position.y += (3.45 - frameAmount * 0.87 - topBar.position.y) * ease;
      rightBar.position.x += (3.25 - frameAmount * 0.91 - rightBar.position.x) * ease;
      bottomBar.position.y += (-3.45 + frameAmount * 0.87 - bottomBar.position.y) * ease;
      glassPanel.material.opacity +=
        ((frameAmount ? 0.34 : 0.06) - glassPanel.material.opacity) * ease;
      membraneMaterial.opacity += ((verifyAmount ? 1 : 0.08) - membraneMaterial.opacity) * ease;
      membrane.scale.x += ((verifyAmount ? 0.78 : 0.08) - membrane.scale.x) * ease;
      membrane.scale.y += ((verifyAmount ? 0.88 : 0.08) - membrane.scale.y) * ease;
      riskMaterial.opacity +=
        ((riskAmount && !recordAmount ? 0.54 : 0) - riskMaterial.opacity) * ease;
      riskBoundary.scale.y +=
        ((riskAmount && !recordAmount ? 1 : 0.001) - riskBoundary.scale.y) * ease;
      reviewMaterial.opacity +=
        ((reviewAmount && !recordAmount ? 0.48 : 0) - reviewMaterial.opacity) * ease;
      reviewRing.scale.setScalar(
        reviewRing.scale.x +
          ((reviewAmount && !recordAmount ? 1 : 0.05) - reviewRing.scale.x) * ease
      );
      recordMaterial.opacity += ((recordAmount ? 0.72 : 0) - recordMaterial.opacity) * ease;
      const recordScale = record.scale.x + ((recordAmount ? 1 : 0.01) - record.scale.x) * ease;
      record.scale.setScalar(recordScale);
      if (!economical) {
        sculpture.rotation.y += (0.42 + pointerX * 0.095 - sculpture.rotation.y) * 0.025;
        sculpture.rotation.x += (-0.11 + pointerY * 0.055 - sculpture.rotation.x) * 0.025;
        sculpture.position.y = -0.02 + Math.sin(time * 0.32) * 0.035;
        core.rotation.x = time * 0.45;
        core.rotation.y = time * 0.62;
        core.scale.setScalar(1 + Math.sin(time * 1.7) * 0.08);
        particles.forEach((particle, index) => {
          const target = verifyAmount
            ? particle.userData.aligned.clone()
            : particle.userData.start.clone();
          if (riskAmount && particle.userData.contradictory)
            target.set(0.9, particle.userData.aligned.y * 0.7, 1.35);
          if (recordAmount && !particle.userData.contradictory)
            target.set(4.05, -0.72 + (index % 6) * 0.28, 0.05);
          particle.position.lerp(target, 0.035);
          particle.rotation.y = time * (0.18 + index * 0.012);
          const material = particle.material as THREE.MeshBasicMaterial;
          material.opacity +=
            ((riskAmount && particle.userData.contradictory ? 0.2 : 0.72) - material.opacity) *
            0.04;
        });
        reviewRing.rotation.z = time * 0.24;
        camera.position.x += (0.55 + pointerX * -0.16 - camera.position.x) * 0.02;
        camera.position.y += (0.28 + pointerY * 0.1 - camera.position.y) * 0.02;
      }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!economical) raf = requestAnimationFrame(render);
    };
    renderRef.current = economical ? render : null;
    const visibility = () => {
      running = !document.hidden && inViewport;
      if (running) {
        clock.start();
        cancelAnimationFrame(raf);
        render();
      } else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", visibility);
    const viewportObserver = new IntersectionObserver(
      (entries) => {
        inViewport = entries[0]?.isIntersecting ?? false;
        visibility();
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    viewportObserver.observe(mount);
    const contextLost = (event: Event) => {
      event.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      mount.classList.add("webgl-fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    const resize = new ResizeObserver(() => {
      const width = mount.clientWidth,
        height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
    resize.observe(mount);
    render();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      mount.removeEventListener("pointermove", pointerMove);
      mount.removeEventListener("pointerleave", pointerLeave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.filter(Boolean).forEach((material) => material.dispose());
      });
      renderRef.current = null;
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedEffects]);

  useEffect(() => {
    renderRef.current?.();
  }, [stage]);

  return (
    <div
      className="evidence-scene evidence-scene--gate"
      ref={mountRef}
      role="img"
      aria-label={`Interactive Trader Frame Evidence Gate: ${stage} state`}
    >
      <img src={fallbackImage} alt="" aria-hidden="true" />
      <div className="scene-readout" aria-hidden="true">
        <span>Evidence gate / {stage}</span>
        <b>
          {stage === "risk"
            ? "Progression blocked"
            : stage === "record"
              ? "Local audit record formed"
              : "Evidence under control"}
        </b>
      </div>
    </div>
  );
}
