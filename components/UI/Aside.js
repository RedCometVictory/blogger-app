import NavItem from "./NavItem";
import { FaHome } from "react-icons/fa";
import { MdArticle, MdFavorite, MdInfo, MdSettings } from "react-icons/md";

const AsideNav = ({openMenu}) => {
  return (
    <div className={`aside ${openMenu ? "active" : ""}`}>
      <div className="aside__container">
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/"}
          icon={<FaHome className={"asideIcon"} size={50} />}
          text={"Home"}
        />
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/listings"}
          icon={<MdArticle className={"asideIcon"} size={50} />}
          text={"Listings"}
        />
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/favorites"}
          icon={<MdFavorite className={"asideIcon"} size={50} />}
          text={"Favorites"}
        />
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/about"}
          icon={<MdInfo className={"asideIcon"} size={50} />}
          text={"About"}
        />
        <NavItem
          className={`aside__menu-item ${openMenu ? "active" : ""}`}
          path={"/settings"}
          icon={<MdSettings className={"asideIcon"} size={50} />}
          text={"Settings"}
        />
      </div>
    </div>
  );
};
export default AsideNav;