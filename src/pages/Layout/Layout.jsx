import { Outlet, Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";

const Layout = () => {
  return (
    <>
      <NavBar></NavBar>

      <Outlet />
    </>
  )
};

export default Layout;