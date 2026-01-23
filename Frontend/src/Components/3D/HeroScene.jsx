import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment, OrbitControls } from '@react-three/drei';

const AnimatedGlobe = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2.5, 2]} />
                <MeshDistortMaterial
                    color="#06b6d4" // Cyan-500
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};

const HeroScene = () => {
    return (
        <div className="w-full h-[400px] md:h-[600px] absolute top-0 right-0 z-0 opacity-50 md:opacity-100 pointer-events-none md:pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="blue" intensity={2} />
                <AnimatedGlobe />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default HeroScene;
