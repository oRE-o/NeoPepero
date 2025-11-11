// src/firebaseConfig.ts (이걸로 덮어쓰기!)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⭐️ .env.local 파일에서 변수를 읽어옴!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 인스턴스 내보내기
export const db = getFirestore(app);