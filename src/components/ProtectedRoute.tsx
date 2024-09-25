// 50 - 로그인 한 사람만 볼 수 있는 페이지
import React from "react";
// 53, // 58 Navigate => 함수가 컴포넌트를 감싸않는 구조가 안되기 때문
import { Navigate } from "react-router-dom";
// 51 - 로그인 되어진 사용자 정보가 있는 곳
import { auth } from "../firebase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // 54
  // const navigate = useNavigate();

  // 52
  const user = auth.currentUser;

  // 60
  // console.log(user);

  if (user === null) {
    // 55
    // 사용자 정보가 없다면 로그인페이지로 이동
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default ProtectedRoute;
