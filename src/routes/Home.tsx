// // 4
// import React from "react";
// // 64
// import { useNavigate } from "react-router-dom";
// // 62
// import { auth } from "../firebase";
// // 93
// import { useState } from "react";
// 91
import styled from "styled-components";
import PostForm from "../components/PostForm";
import TimeLine from "../components/TimeLine";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
  height: 90vh;
`;

const Home = () => {
  // 65
  // const navigate = useNavigate();

  // // 61
  // const logout = () => {
  //   // 63 - 로그아웃
  //   // 사용자 정보가 없으면 메인페이지로 가지 못함
  //   auth.signOut();

  //   // 66
  //   navigate("/login");
  // };

  // return {/*<h1> <button onClick={logout}>Logout</button>}</h1> */

  return (
    <Wrapper>
      <PostForm />
      {/* // 114 */}
      <TimeLine />
    </Wrapper>
  );
};

export default Home;
