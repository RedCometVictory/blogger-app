import NavItem from "./NavItem";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdArticle, MdFavorite, MdInfo, MdSettings, MdPerson, MdExitToApp } from "react-icons/md";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/Store";

const AsideNav = ({openMenu}) => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const logoutHandler = async () => {
    console.log("logging out user")
    try {
      let res = await api.post("/auth/signout");
      
      console.log("logout res")
      console.log(res.data)
      dispatch({type: "LOGOUT"});
      // Cookies.remove("token");
      Cookies.remove("blog__isLoggedIn");
      Cookies.remove("blog__userInfo");
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout.");
      // const errors = err.response.data.errors;
      // if (errors) {
      //   errors.forEach(error => toast.error(error.msg));
      // }
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
        {/* <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/listings"}
          icon={<MdArticle className={"asideIcon"} size={50} />}
          text={"Listings"}
        /> */}
        {/* <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/favorites"}
          icon={<MdFavorite className={"asideIcon"} size={50} />}
          text={"Favorites"}
        /> */}
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
        {/* <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/settings"}
          icon={<MdSettings className={"asideIcon"} size={50} />}
          text={"Settings"}
        /> */}
        {state?.auth?.isAuthenticated ? (
          <NavItem
            className={`aside__menu-item ${openMenu ? "active" : ""}`}
            path={"/"}
            icon={<MdExitToApp className={"asideIcon"} size={50} />}
            text={"Logout"}
            // onClick={logoutHandler}
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