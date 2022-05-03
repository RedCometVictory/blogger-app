import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FaPalette, FaChevronLeft } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import api from "@/utils/api";
import { ThemeContext } from 'use-theme-switcher';
import { useAppContext, logoutUser } from '../context/Store';
import SearchBar from "./UI/SearchBar";
import ThemePicker from "./ThemePicker";

const Navbar = ({openMenu, setOpenMenu}) => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const { theme, switchTheme } = useContext(ThemeContext);
  const [showThemes, isShowThemes] = useState(false);

  const logoutHandler = async () => {
    try {
      await api.post("/auth/signout");
      dispatch({type: "LOGOUT"});
      logoutUser();
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout.");
    }
  };

  const ThemeSelectModal = ({show, showHandler}) => {
    let activeClass = show ? 'active' : '';
    return (
      <section className={`palette ${activeClass}`}>
        <ThemePicker
          theme={theme}
          setTheme={switchTheme}
        />
      </section>
    );
  };

  return (<>
    <nav className="nav">
      <ThemeSelectModal show={showThemes} showHandler={isShowThemes} />
      <div className="nav__container">
        <div className="nav__sub-container left">
          <div className="nav__content title">
            <Link passHref href="/">
              <h1 className="nav__title">Zuit</h1>
            </Link>
          </div>
          <div className="nav__content left">
            <div className="nav__aside-expand" onClick={setOpenMenu}>
              {!openMenu ? <GiHamburgerMenu /> : <FaChevronLeft />}
            </div>
          </div>
          <div className="nav__content left">
            <div className={`palette__theme-select ${showThemes ? 'active' : ''}`} onClick={() => isShowThemes(!showThemes)}>
              <FaPalette />
            </div>
          </div>
          {state?.auth?.isAuthenticated && (
            <div className="nav__content left">
              <SearchBar />
            </div>
          )}
        </div>
      <div className="nav__sub-container right">
        {state?.auth?.isAuthenticated ? (
          <>
          <h3 className="nav__content right">
            <Link passHref href={"/about"}>
              <div className="">
                About
              </div>
            </Link>
          </h3>
          <h3 className="nav__content right">
            <Link passHref href={"/profile"}>
              <div className="">
                Profile
              </div>
            </Link>
          </h3>
          <h3 className="nav__content right" onClick={logoutHandler}>
            <Link passHref href={"/"}>
              <div className="">
                Logout
              </div>
            </Link>
          </h3>
          </>
        ) : (
          <>
          <h3 className="nav__content right">
            <Link passHref href={"/login"}>
              <div className="">
                Login
              </div>
            </Link>
          </h3>
          </>
        )}
        </div>
      </div>
    </nav>
  </>);
}
export default Navbar;