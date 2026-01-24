import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Sphere, shaderMaterial, Float, Environment, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

// --- Custom Shader Material ---
const GlobeMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color(0.2, 0.4, 1.0),
        uHover: 0, // 0 to 1
        uMouse: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uHover;

    // Simplex Noise (simplified for vertex displacement)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Basic position
      vec3 pos = position;
      
      // Add subtle ripple displacement on hover
      float noiseVal = snoise(pos * 3.0 + uTime * 0.5);
      float displacement = uHover * noiseVal * 0.2; // Only displace when hovering
      
      pos = pos + normal * displacement;

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uHover;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Frensel Term for Atmosphere
    float fresnel(vec3 viewVector, vec3 worldNormal) {
        return pow(1.0 + dot(viewVector, worldNormal), 3.0);
    }

    void main() {
      // Base Color - Deep Ocean
      vec3 color = uColor * 0.2;

      // Scanning Grid / Wave Effect
      float scan = sin(vPosition.y * 10.0 - uTime * 2.0) * 0.5 + 0.5;
      float scan2 = cos(vPosition.x * 10.0 + uTime * 1.5) * 0.5 + 0.5;
      
      // Grid lines
      float grid = step(0.9, scan) + step(0.9, scan2);
      vec3 gridColor = vec3(0.0, 1.0, 1.0) * grid * (0.2 + uHover * 0.5); // Brighter on hover

      // Bloom Core (Ripple) - Rings moving up with some noise distortion
      float noiseSignal = sin(vPosition.x * 5.0 + vPosition.z * 5.0 + uTime);
      float ripple = sin(vPosition.y * 6.0 - uTime * 4.0 + noiseSignal * 0.5);
      vec3 rippleColor = vec3(0.4, 0.9, 1.0) * smoothstep(0.8, 1.0, ripple) * uHover;

      // Fresnel Glow (Edge Highlight)
      vec3 viewDirection = normalize(cameraPosition - vPosition); // Approx in local space
      // Since we are in local space mostly for simple spheres, we use z axis approximation for view if not passed
      // But actually standard fresnel approx:
      float fresnelTerm = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0); // Simple view-aligned
      
      vec3 globeColor = color + gridColor + rippleColor;
      
      // Add "Atmosphere" ring
      globeColor += vec3(0.2, 0.6, 1.0) * fresnelTerm * (0.5 + uHover * 1.0);

      gl_FragColor = vec4(globeColor, 1.0);
    }
  `
);

extend({ GlobeMaterial });

const InteractiveGlobe = (props) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (materialRef.current) {
            // Update Time
            materialRef.current.uTime = state.clock.getElapsedTime();

            // Smoothly interpolate uHover value based on hovered state
            // Lerp current value towards target (1 if hovered, 0 if not)
            const targetHover = hovered ? 1 : 0;
            easing.damp(materialRef.current, 'uHover', targetHover, 0.25, delta);

            // Rotate the globe slowly
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    return (
        <group {...props}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere
                    ref={meshRef}
                    args={[2.2, 64, 64]}
                    onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
                    onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
                >
                    {/* @ts-ignore */}
                    <globeMaterial
                        ref={materialRef}
                        transparent
                        uColor={new THREE.Color("#0c1222")}
                    />
                </Sphere>

                {/* Ambient Particles/Stars specifically around the globe */}
                <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            </Float>
        </group>
    );
};

const HeroScene = () => {
    return (
        <div className="w-full h-[500px] md:h-screen absolute top-0 right-0 z-0 pointer-events-none md:pointer-events-auto opacity-30 sm:opacity-50 md:opacity-100">
            {/* Use a separate div for canvas to allow pointer events effectively on the globe */}
            <div className="absolute inset-0 z-10">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                    <InteractiveGlobe position={[2.5, 0, 0]} />

                    <Environment preset="city" />
                    {/* Orbit Controls with limits to prevent getting lost */}
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                </Canvas>
            </div>
            {/* Gradient Overlay to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-900/50 to-slate-900 pointer-events-none z-20" />
        </div>
    );
};

export default HeroScene;
