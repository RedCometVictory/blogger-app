import NavItem from "./NavItem";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdInfo, MdPerson, MdExitToApp } from "react-icons/md";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/Store";

const AsideNav = ({openMenu}) => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await api.post("/auth/signout");
      dispatch({type: "LOGOUT"});
      Cookies.remove("blog__isLoggedIn");
      Cookies.remove("blog__userInfo");
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout.");
    }
  };

  return (
    <div className={`aside ${openMenu ? "active" : ""}`}>
      <div className="aside__container">
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/"}
          icon={<FaHome className={"asideIcon"} size={50} />}
          text={"Feed"}
        />
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/about"}
          icon={<MdInfo className={"asideIcon"} size={50} />}
          text={"About"}
        />
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/profile"}
          icon={<MdPerson className={"asideIcon"} size={50} />}
          text={"Profile"}
        />
        {state?.auth?.isAuthenticated ? (
          <NavItem
            className={`aside__menu-item ${openMenu ? "active" : ""}`}
            path={"/"}
            icon={<MdExitToApp className={"asideIcon"} size={50} />}
            text={"Logout"}
            logout={logoutHandler}
          />
        ) : (
          <NavItem
            className={`aside__menu-item ${openMenu ? "active" : ""}`}
            path={"/login"}
            icon={<MdExitToApp className={"asideIcon"} size={50} />}
            text={"Login"}
          />
        )}
      </div>
    </div>
  );
};
export default AsideNav;