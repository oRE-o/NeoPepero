// src/DeveloperModal.tsx
import "./DeveloperModal.css"; // CSS 임포트

interface DevModalProps {
  onClose: () => void;
}

export function DeveloperModal({ onClose }: DevModalProps) {
  return (
    <div className="dev-modal-overlay" onClick={onClose}>
      <div className="dev-modal-content" onClick={(e) => e.stopPropagation()}>
        {" "}
        <h2>이걸 만든 이유</h2>
        <p>
          {`빼빼로데이.
많은 사람들이 빼빼로 혹은 Pocky와 같은 막대과자를 주고 받는 날입니다.
다만 해외의 친구에게 선물하고 싶거나 가챠 게임 등으로 돈이 없어진 대학생들은
많이 사거나 만들 시간이 없습니다.
그리고 저도 그렇습니다.

그래서, 손재주가 좋지는 않지만 코드는 쓸 수 있기 때문에 만들었습니다.
이렇게 탄생한 것이 바로 네오-빼빼로입니다.

네오-빼빼로에는 메쉬와 비트, 바이트들이 다량 함유되어 있으므로,
안심하고 드시면 결코 건강에 좋지 않습니다.
하지만 꽤 귀엽습니다. 친구들에게 공유하고 즐겨주세요!`}
        </p>
        <h2>면책조항</h2>
        <p>
          {`이 웹사이트는 빼빼로의 공식 웹사이트가 아닙니다. 재미를 위해 만든
웹사이트이며, 법적 문제가 발생할 경우 메일 등으로 연락 주시면 즉시
삭제하겠습니다. (협업 제안도 물론 환영합니다!!!!! 빼빼로 연락주세요
and Pocky, if you want to change this site into neo-pocky, please contact me, I'll do it for free.)`}
        </p>
        <h2>Links</h2>
        <div className="dev-links">
          <a
            href="https://github.com/ore-o"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <button className="dev-modal-close-btn" onClick={onClose}>
          돌아가기
        </button>
      </div>
    </div>
  );
}
