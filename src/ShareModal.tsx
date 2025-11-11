// src/ShareModal.tsx
import React from "react";
import "./ShareModal.css"; // (CSS는 그대로 v3.0 쓰면 돼!)

// ⭐️ 1. Props 타입에 onShareSuccess 추가!
interface ShareModalProps {
  onClose: () => void;
  onShareSuccess: () => void; // App.tsx로부터 받음!
}

export function ShareModal({ onClose, onShareSuccess }: ShareModalProps) {
  const shareUrl = "https://neopepero.yon.cat";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 복사되었어요! 💖\n친구에게 전달해 주세요!");

      // ⭐️ 2. 복사 성공! App.tsx에게 "성공했다!"고 알리기!
      onShareSuccess();
      onClose(); // 모달 닫기
    } catch (err) {
      alert("링크 복사에 실패했어요 🥲");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>공유하기</h2>
        <button className="share-btn copy" onClick={handleCopyLink}>
          링크 복사하기
        </button>
        <button className="share-btn close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
