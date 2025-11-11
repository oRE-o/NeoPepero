import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Pepero } from "./Pepero";
import { Box } from "./Box";
import { ShareModal } from "./ShareModal";
import "./index.css";
import { db } from "./firebaseConfig";

import { doc, getDoc, setDoc, increment } from "firebase/firestore";

import { FaShareAlt } from "react-icons/fa";

import { DeveloperModal } from "./DeveloperModal";

import "./DeveloperModal.css"; // (CSS 임포트)

function App() {
  const [isBoxMode, setIsBoxMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [_toggleCount, setToggleCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const shareDocRef = doc(db, "counts", "shares");
  const toggleDocRef = doc(db, "counts", "toggleButton");
  const visitorDocRef = doc(db, "counts", "visitors");

  useEffect(() => {
    const fetchCounts = async () => {
      const [toggleSnap, visitorSnap, shareSnap] = await Promise.all([
        getDoc(toggleDocRef),
        getDoc(visitorDocRef),
        getDoc(shareDocRef),
      ]);

      setToggleCount(toggleSnap.exists() ? toggleSnap.data().total : 0);
      setVisitorCount(visitorSnap.exists() ? visitorSnap.data().total : 0);
      setShareCount(shareSnap.exists() ? shareSnap.data().total : 0);
    };

    // "이 브라우저에서 처음 방문했는지" 확인
    const checkFirstVisit = async () => {
      const visited = localStorage.getItem("neoPeperoVisited");
      if (!visited) {
        // 처음 방문했다면!
        localStorage.setItem("neoPeperoVisited", "true");

        // 1. Firebase 접속자 수 1 증가
        await setDoc(visitorDocRef, { total: increment(1) }, { merge: true });

        // 2. (선택) 방금 올린 값을 다시 불러오거나, 로컬 상태를 1 증가
        setVisitorCount((prev) => prev + 1); // ⭐️ 즉시 반영!
      }
    };

    fetchCounts();
    checkFirstVisit();
  }, []); // 빈 배열: 맨 처음에 딱 한 번만 실행!

  // ... (toggleDarkMode 함수는 그대로) ...
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleMode = async () => {
    setIsBoxMode(!isBoxMode);
    await setDoc(toggleDocRef, { total: increment(1) }, { merge: true });
    setToggleCount((prev) => prev + 1);
  };

  const handleShareSuccess = async () => {
    try {
      await setDoc(shareDocRef, { total: increment(1) }, { merge: true });
      setShareCount((prev) => prev + 1);
      console.log("Share count incremented!");
    } catch (err) {
      console.error("Share count update failed:", err);
    }
  };
  const openDevModal = () => {
    setIsDevModalOpen(true);
  };

  const handleShare = async () => {
    const shareUrl = "https://neopepero.yon.cat";
    const shareData = {
      title: "디지털 막대과자를 받으세요.",
      text: "아마도 먹을 순 없습니다. 하지만 귀엽죠?",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // ⭐️ 공유 성공! (사용자가 취소 안 누름)
        handleShareSuccess();
      } catch (err) {
        // (사용자가 공유를 취소함)
        console.log("Native share cancelled:", err);
      }
    } else {
      // 2. PC (navigator.share 기능이 없으면)
      // ⭐️ 우리가 만든 모달을 띄운다!
      setIsModalOpen(true);
    }
  };

  return (
    <div className={isDarkMode ? "app-container dark" : "app-container light"}>
      {/* ⭐️ 7. 상단 텍스트 표시! */}
      <div className="stats-display">
        지금까지 {visitorCount}명이 네오-빼빼로를 받아갔습니다!
        <br />
        {shareCount}명은 친구에게 네오-빼빼로를 전달했습니다!
      </div>

      {/* (다크 모드 버튼) */}
      <button className="dm-toggle-button" onClick={toggleDarkMode}>
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* ⭐️ 8. (NEW!) 공유 버튼 */}
      <button className="share-button" onClick={handleShare}>
        <FaShareAlt />
      </button>
      <button className="dev-link-button" onClick={openDevModal}>
        만든 사람?
      </button>
      {/* (박스 토글 버튼) */}
      <button className="toggle-button" onClick={toggleMode}>
        {isBoxMode ? "빼빼로 주세요!" : "박스로 주세요!"}
      </button>

      <Canvas camera={{ position: [0, 0, 7] }}>
        {/* ... (조명, 모델 등은 그대로) ... */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-3, -5, -2]} intensity={0.8} />
        {isBoxMode ? <Box /> : <Pepero />}
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
      {isModalOpen && (
        <ShareModal
          onClose={() => setIsModalOpen(false)}
          onShareSuccess={handleShareSuccess}
        />
      )}
      {isDevModalOpen && (
        <DeveloperModal onClose={() => setIsDevModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
