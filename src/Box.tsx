// src/Box.tsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Gltf } from "@react-three/drei";
import * as THREE from "three";

export function Box() {
  const groupRef = useRef<THREE.Group>(null!);

  // 초기 기울기 설정
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI * 0.2;
      groupRef.current.rotation.z = Math.PI * 0.1;
    }
  }, []);

  // 자동 회전 애니메이션
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef} scale={0.2}>
      <Gltf src="/pepero_box.glb" />
    </group>
  );
}
