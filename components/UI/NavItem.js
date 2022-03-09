import Link from "next/link";

const NavItem = ({ className, path, icon, text, logout }) => {

  return (<>
    <h3 className={`${className}`} onClick={logout}>
      <Link passHref href={path}>
        <div className="aside__item-logo">
          {icon !== undefined ? icon : ""}
        </div>
      </Link>
      <Link passHref href={path}>
        <div className="aside__item-text">
          {text}
        </div>
      </Link>
    </h3>
  </>);
}
export default NavItem;