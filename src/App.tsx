// 2
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Profile from "./routes/Profile";

// 3
const router = createBrowserRouter([
  {
    // 기본 뼈대
    path: "/",
    element: <Layout />,
    // 자식 컴포넌트들
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      {/* // 6 RouterProvider: 자식에게 뿌려주는 */}
      {/* 페이지 라우팅 완료 */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
