export const energyVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const energyFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 p = vUv - 0.5;
    float radius = length(p);
    float ring = smoothstep(0.48, 0.34, radius) - smoothstep(0.31, 0.22, radius);
    float core = smoothstep(0.34, 0.02, radius);
    float scan = pow(max(0.0, sin((p.y + uTime * 0.12) * 44.0)), 18.0);
    float spokes = pow(abs(sin(atan(p.y, p.x) * 9.0 + uTime * 0.35)), 22.0);
    float grain = hash(vUv * 180.0 + uTime * 0.03) * 0.08;
    float alpha = (core * 0.34 + ring * 0.42 + scan * 0.16 + spokes * core * 0.08 + grain) * uIntensity;
    vec3 color = mix(vec3(0.015, 0.22, 0.28), vec3(0.26, 0.95, 1.0), core + ring);
    gl_FragColor = vec4(color, alpha);
  }
`;
