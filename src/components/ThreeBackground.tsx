import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useRef, Suspense } from "react";
import * as THREE from "three";
// alias deprecated Clock to Timer to silence warning
if ((THREE as any).Clock && !(THREE as any).Timer) {
  (THREE as any).Timer = (THREE as any).Clock;
  console.warn("THREE.Clock deprecated – aliasing to Timer");
}

function StarField() {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = useState(() => {
    // Reduced from 5000 to 2000 particles for better performance
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  });

  // Reduce animation frame rate for better performance
  let frameCount = 0;
  useFrame((state, delta) => {
    frameCount++;
    // Only update every 2 frames instead of every frame
    if (frameCount % 2 === 0) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]} // Limit DPR for performance
        performance={{ min: 0.5 }} // Enable adaptive performance
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL context lost, attempting to restore');
          });
        }}
      >
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  );
}
