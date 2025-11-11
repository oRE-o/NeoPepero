import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Pepero } from "./Pepero";
import { Box } from "./Box";
import { ShareModal } from "./ShareModal";
import "./index.css";
import { db } from "./firebaseConfig";
// ⭐️ setDoc, increment, doc, getDoc 다 필요해!
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

// ⭐️ 아이콘도 추가해볼까? (설치 필요! pnpm add react-icons)
import { FaShareAlt } from "react-icons/fa";

// ⭐️ 2. 새로 만든 개발자 모달 임포트!
import { DeveloperModal } from "./DeveloperModal";
// ⭐️ 3. (필요하면) index.css도 임포트!
import "./DeveloperModal.css"; // (CSS 임포트)

function App() {
  // ... (isBoxMode, isDarkMode 상태는 그대로) ...
  const [isBoxMode, setIsBoxMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // ⭐️ 2. 3가지 카운트 상태 만들기
  const [_toggleCount, setToggleCount] = useState(0); // 기존 토글 횟수
  const [visitorCount, setVisitorCount] = useState(0); // n명
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const shareDocRef = doc(db, "counts", "shares");
  // ⭐️ 3. Firestore 문서 참조 (3개!)
  const toggleDocRef = doc(db, "counts", "toggleButton");
  const visitorDocRef = doc(db, "counts", "visitors");

  // ⭐️ 4. (중요!) 처음 로드될 때 모든 카운트 불러오기 + 접속자 수 1 올리기
  useEffect(() => {
    // 모든 카운트 값 불러오는 함수
    const fetchCounts = async () => {
      // Promise.all로 3개를 한꺼번에 불러오자!
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

  // ⭐️ 5. "박스로 주세요" 버튼 로직 (이제 toggleCount를 업데이트!)
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

  // ⭐️ 2. (MODIFIED!) 이게 메인 공유 버튼이 호출할 "스마트" 함수!
  const handleShare = async () => {
    const shareUrl = "https://neopepero.yon.cat";
    const shareData = {
      title: "네오빼빼로 월드! 💖",
      text: "너에게 네오빼빼로를 보낼게! (클릭!)",
      url: shareUrl,
    };

    // 1. 모바일 (navigator.share 기능이 있으면)
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
