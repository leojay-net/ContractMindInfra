/**
 * 3D Robotic Scene - Immersive Landing Page Background
 * Ultra-modern 3D scene with animated elements inspired by Forged.build
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Points,
    PointMaterial,
    OrbitControls,
    Float,
    MeshTransmissionMaterial,
    Environment,
    PerspectiveCamera,
    Sphere,
    MeshDistortMaterial,
    Torus
} from '@react-three/drei';
import * as THREE from 'three';

// Animated particle field with depth
function ParticleField() {
    const ref = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(5000 * 3);
        const colors = new Float32Array(5000 * 3);

        for (let i = 0; i < 5000; i++) {
            const i3 = i * 3;
            // Create a sphere distribution
            const radius = 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Grayscale - white to grey
            const brightness = 0.7 + Math.random() * 0.3;
            colors[i3] = brightness;     // R
            colors[i3 + 1] = brightness; // G
            colors[i3 + 2] = brightness; // B
        }

        return [positions, colors];
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;

            // Pulse effect
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
            ref.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.025}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.9}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// Central hero sphere with distortion and glow
function HeroSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={2}>
                <MeshDistortMaterial
                    color="#FFFFFF"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={1.0}
                    emissive="#FFFFFF"
                    emissiveIntensity={0.6}
                />
            </Sphere>
        </Float>
    );
}

// Orbiting ring system
function OrbitingRings() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            group.current.rotation.z = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={group}>
            {[...Array(3)].map((_, i) => (
                <Torus
                    key={i}
                    args={[2.5 + i * 0.6, 0.04, 16, 100]}
                    rotation={[Math.PI / 4, Math.PI / 3 * i, 0]}
                >
                    <meshStandardMaterial
                        color={['#FFFFFF', '#CCCCCC', '#999999'][i]}
                        emissive={['#FFFFFF', '#CCCCCC', '#999999'][i]}
                        emissiveIntensity={0.5}
                        metalness={1.0}
                        roughness={0.05}
                        transparent
                        opacity={0.7}
                    />
                </Torus>
            ))}
        </group>
    );
}

// Floating data cubes
function DataCubes() {
    const groupRef = useRef<THREE.Group>(null);

    const cubes = useMemo(() => {
        return [...Array(12)].map(() => ({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
            ] as [number, number, number],
            scale: Math.random() * 0.3 + 0.1,
            rotationSpeed: (Math.random() - 0.5) * 0.5,
        }));
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.rotation.x += cubes[i].rotationSpeed * 0.01;
                child.rotation.y += cubes[i].rotationSpeed * 0.015;
                child.position.y += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {cubes.map((cube, i) => (
                <mesh key={i} position={cube.position} scale={cube.scale}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial
                        color="#E5E7EB"
                        emissive="#E5E7EB"
                        emissiveIntensity={0.2}
                        metalness={0.8}
                        roughness={0.2}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Neural network-like connections with animation
function NeuralNetwork() {
    const linesRef = useRef<THREE.LineSegments>(null);

    const geometry = useMemo(() => {
        const points = [];
        const connections = 80;

        for (let i = 0; i < connections; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6
            );
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6
            );
            points.push(start, end);
        }

        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.z = state.clock.getElapsedTime() * 0.015;
            linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <lineBasicMaterial
                color="#FFFFFF"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    );
}

// Main 3D Scene Component
export default function RoboticScene() {
    return (
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 10], fov: 50 }}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#000000'
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance'
                }}
            >
                <color attach="background" args={['#000000']} />

                {/* Bright Lighting for visibility - white/grey scheme */}
                <ambientLight intensity={0.8} color="#FFFFFF" />
                <pointLight position={[10, 10, 10]} intensity={3} color="#FFFFFF" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#CCCCCC" />
                <pointLight position={[0, 0, 15]} intensity={2.5} color="#E5E7EB" />
                <spotLight
                    position={[0, 15, 0]}
                    angle={0.6}
                    penumbra={1}
                    intensity={3}
                    color="#FFFFFF"
                    castShadow
                />

                {/* Environment for reflections */}
                <Environment preset="city" />

                {/* 3D Elements - all visible */}
                <ParticleField />
                <HeroSphere />
                <OrbitingRings />
                <DataCubes />
                <NeuralNetwork />

                {/* Interactive Controls */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 2.2}
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
