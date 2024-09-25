// 4
import React from "react";
// 64
import { useNavigate } from "react-router-dom";
// 62
import { auth } from "../firebase";

const Home = () => {
  // 65
  const navigate = useNavigate();

  // 61
  const logout = () => {
    // 63 - 로그아웃
    // 사용자 정보가 없으면 메인페이지로 가지 못함
    auth.signOut();

    // 66
    navigate("/login");
  };

  return (
    <h1>
      <button onClick={logout}>Logout</button>
    </h1>
  );
};

export default Home;
