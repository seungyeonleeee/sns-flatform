// 21 firebase 초기화
// firebase에서 프로젝트 만들고 Firebase SDK 설치

import { initializeApp } from "firebase/app";
// 22 사용자의 정보값을 찾아오는 함수
import { getAuth } from "firebase/auth";
// 102 DB
import { getStorage } from "firebase/storage";
// 103 창고 (DB보다 더 큰 공간)
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwSseOE054eaAqZ6bb0UTnsQvcj3JS3ps",
  authDomain: "sns-platform-a9f1e.firebaseapp.com",
  projectId: "sns-platform-a9f1e",
  storageBucket: "sns-platform-a9f1e.appspot.com",
  messagingSenderId: "443637872256",
  appId: "1:443637872256:web:fa69921c55510798e41865",
};

const app = initializeApp(firebaseConfig);

// 23
export const auth = getAuth(app);

// 104
export const storage = getStorage(app);
// 105
export const db = getFirestore(app);
