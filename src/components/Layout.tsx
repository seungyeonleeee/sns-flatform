// 1 최상위요소
import { Outlet } from "react-router-dom";
// Outlet : 언제라도 최상위 부모요소가 자식요소를 수집할 수 있음

const Layout = () => {
  return (
    <>
      <h2>Layout</h2>
      <Outlet />
    </>
  );
};

export default Layout;
