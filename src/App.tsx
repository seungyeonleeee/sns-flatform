// 2
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
// 11
import { createGlobalStyle } from "styled-components";
// 14
import reset from "styled-reset";
// 24
import { auth } from "./firebase";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
// 19
import LoadingScreen from "./components/LoadingScreen";
import CreateAccount from "./routes/CreateAccount";
// 56
import ProtectedRoute from "./components/ProtectedRoute";

// 3
const router = createBrowserRouter([
  {
    // 기본 뼈대
    path: "/",
    element: (
      // 59
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    // 자식 컴포넌트들
    children: [
      {
        path: "",
        element: <Home />,
        // 57
        // element: (
        //   <ProtectedRoute>
        //     <Home />
        //   </ProtectedRoute>
        // ),
      },
      {
        path: "profile",
        element: <Profile />,
        // 57
        // element: (
        //   <ProtectedRoute>
        //     <Profile />
        //   </ProtectedRoute>
        // ),
      },
    ],
  },
  {
    // 9 login 별도의 페이지 라우팅 - 여기를 통과해야 홈, 프로필로 이동 // 홈, 프로필 보호
    path: "/login",
    element: <Login />,
  },
  {
    // 10 회원가입 마찬가지
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

// 12
const GlobalStyles = createGlobalStyle`
${reset}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body{
  background: #000;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

`;

function App() {
  // 15 인증
  const [isLoading, setIsLoading] = useState(true);

  // 16 초기화
  const init = async () => {
    // 25 사용자가 로그인한 상태를 가져옴
    // 여기까지 백엔드 세팅 끝
    // form 만들러 createAccount로 이동
    await auth.authStateReady();

    // 16
    // firebase Authentication 순서를 기다려야 함 (동기) - await
    // setTimeout(() => setIsLoading(false), 2000); // 잘 나오는지 확인
    setIsLoading(false);
  };

  // 17 마운트가 되는 시점 한번만
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {/* 13 */}
      <GlobalStyles />

      {/* // 6 RouterProvider: 자식에게 뿌려주는 */}
      {/* 페이지 라우팅 완료 */}
      {/* <RouterProvider router={router} /> */}

      {/* // 20 Protected Router */}
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
