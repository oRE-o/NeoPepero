// src/Pepero.tsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 빼빼로 컴포넌트!
export function Pepero() {
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

  // 빼빼로의 전체 길이 (예: 5)
  const totalLength = 5;
  // 과자 부분의 비율 (15%)
  const biscuitRatio = 0.2;
  // 과자 부분의 길이
  const biscuitLength = totalLength * biscuitRatio;
  // 초코 부분의 길이
  const chocolateLength = totalLength - biscuitLength;

  return (
    // ⭐️ 과자와 초코를 하나의 그룹으로 묶어서 함께 회전하게!
    <group ref={groupRef}>
      {/* 1. 과자 부분 (Biscuit Part) */}
      <mesh position={[0, -totalLength / 2 + biscuitLength / 2, 0]}>
        {/* 과자 부분은 전체 길이의 15% */}
        <cylinderGeometry args={[0.2, 0.2, biscuitLength, 16]} />
        {/* 과자 색상 (밝은 베이지) */}
        <meshStandardMaterial color="#dec09a" />
      </mesh>

      {/* 2. 초코 부분 (Chocolate Part) */}
      <mesh position={[0, totalLength / 2 - chocolateLength / 2, 0]}>
        {/* 초코 부분은 나머지 85% */}
        <cylinderGeometry args={[0.22, 0.22, chocolateLength, 16]} />{" "}
        {/* ⭐️ 초코가 살짝 더 두껍게! */}
        {/* 초코 색상 (짙은 갈색) */}
        <meshStandardMaterial color="#4b3325" />
      </mesh>

    </group>
  );
}
