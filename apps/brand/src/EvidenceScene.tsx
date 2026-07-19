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

export default function EvidenceScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
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
    sculpture.rotation.set(-0.11, 0.42, -0.035);
    sculpture.position.set(0.22, -0.02, 0);
    scene.add(sculpture);

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
      sculpture.add(bar);
    };
    addBar([0.32, 5.25, 0.48], [-2.34, 0.12, 0.3]);
    addBar([3.05, 0.32, 0.48], [-0.83, 2.58, 0.3]);
    addBar([0.32, 5.25, 0.48], [2.34, -0.12, -0.3], darkChrome);
    addBar([3.05, 0.32, 0.48], [0.83, -2.58, -0.3], darkChrome);

    const panelGeometry = new RoundedBoxGeometry(4.08, 4.08, 0.18, 10, 0.18);
    const glassPanel = new THREE.Mesh(panelGeometry, glass);
    glassPanel.position.z = -0.1;
    sculpture.add(glassPanel);
    const panelEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(panelGeometry, 38),
      new THREE.LineBasicMaterial({ color: 0x5edcf4, transparent: true, opacity: 0.12 })
    );
    panelEdge.position.copy(glassPanel.position);
    sculpture.add(panelEdge);
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
    sculpture.add(membrane);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.135, 3),
      new THREE.MeshStandardMaterial({
        color: 0xbdf7ff,
        emissive: 0x25d4ff,
        emissiveIntensity: 5,
        roughness: 0.14
      })
    );
    core.position.set(0.16, -0.06, 0.48);
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
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffbd55 });
    for (let index = 0; index < 4; index += 1) {
      const particle = new THREE.Mesh(
        new THREE.OctahedronGeometry(index === 0 ? 0.06 : 0.035, 0),
        particleMaterial
      );
      const angle = index * Math.PI * 0.53;
      particle.position.set(
        Math.cos(angle) * (2.1 + index * 0.12),
        Math.sin(angle) * (1.45 + index * 0.08),
        0.45 - index * 0.13
      );
      particle.userData.phase = angle;
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
      if (!reducedMotion) {
        sculpture.rotation.y += (0.42 + pointerX * 0.095 - sculpture.rotation.y) * 0.025;
        sculpture.rotation.x += (-0.11 + pointerY * 0.055 - sculpture.rotation.x) * 0.025;
        sculpture.position.y = -0.02 + Math.sin(time * 0.32) * 0.035;
        core.rotation.x = time * 0.45;
        core.rotation.y = time * 0.62;
        core.scale.setScalar(1 + Math.sin(time * 1.7) * 0.08);
        particles.forEach((particle, index) => {
          particle.position.z += Math.sin(time * 0.5 + particle.userData.phase) * 0.0015;
          particle.rotation.y = time * (0.18 + index * 0.012);
        });
        camera.position.x += (0.55 + pointerX * -0.16 - camera.position.x) * 0.02;
        camera.position.y += (0.28 + pointerY * 0.1 - camera.position.y) * 0.02;
      }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!reducedMotion) raf = requestAnimationFrame(render);
    };
    const visibility = () => {
      running = !document.hidden;
      if (running) {
        clock.start();
        cancelAnimationFrame(raf);
        render();
      } else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", visibility);
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
      document.removeEventListener("visibilitychange", visibility);
      mount.removeEventListener("pointermove", pointerMove);
      mount.removeEventListener("pointerleave", pointerLeave);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.filter(Boolean).forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="evidence-scene evidence-scene--gate"
      ref={mountRef}
      role="img"
      aria-label="Interactive three-dimensional Trader Frame decision gate sculpture"
    >
      <img src={fallbackImage} alt="" aria-hidden="true" />
      <div className="scene-readout" aria-hidden="true">
        <span>Decision gate</span>
        <b>Evidence / risk / control</b>
      </div>
    </div>
  );
}
