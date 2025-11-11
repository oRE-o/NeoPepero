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
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    // ⭐️ scale 속성을 추가해서 박스 크기를 조절!
    //    값이 작아질수록 작아져. 0.1 이면 1/10 크기야!
    //    이 값은 GLB 파일의 원래 크기에 따라 조절해야 해.
    //    일단 0.05 정도로 작게 시작해 볼까?
    <group ref={groupRef} scale={0.2}>
      <Gltf src="/pepero_box.glb" />
    </group>
  );
}
