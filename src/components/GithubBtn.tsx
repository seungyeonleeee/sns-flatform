// 76
import React from "react";
// 81 github와의 연결고리 (firbase함수)
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
// 83
import { useNavigate } from "react-router-dom";
// 79
import styled from "styled-components";
// 80
import { auth } from "../firebase";

const Button = styled.span`
  width: 100%;
  background: #fff;
  color: #000;
  font-weight: 600;
  padding: 10px 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 50px;
  cursor: pointer;
`;
const Logo = styled.img`
  height: 25px;
`;

const GithubBtn = () => {
  // 84
  const navigate = useNavigate();

  // 82
  // 깃허브 확인 후 파이어베이스 인증 (순서가 있음 await)
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // 85
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src="/github-mark.svg" />
      Continue Width Github
    </Button>
  );
};

export default GithubBtn;
