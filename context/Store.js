import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Store = createContext();

export const StoreProvider = ({ reducer, initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch]);
  // check if state exists in LS
  useEffect(() => {
    let authUser = Cookies.get("blog__userInfo") ? JSON.parse(Cookies.get("blog__userInfo")) : ""

    if (authUser && Cookies.get('blog__isLoggedIn')) {
      dispatch({
        type: "USER_LOADED",
        payload: authUser
      });
    }
  }, []);
  useEffect(() => {
    // updated state values stored into cookie
    if (state !== initialState) {
      Cookies.set("blog__userInfo", JSON.stringify(state.auth.user));
      localStorage.setItem("blog__follows", JSON.stringify(state.follow.followers));
    }
  }, [state]);

  const checkUserLoggedIn = async () => {
    try {
      // const res = await fetch(`http://localhost:3000/api/auth/checkAuth`);
      const res = await fetch(`http://process.env.DOMAIN/api/auth/checkAuth`);
      const data = await res.json();
      if (res.ok) {
        console.log("user auth checked - approved");
      } else {
        Cookies.remove("blog__isLoggedIn");
        Cookies.remove("blog__userInfo");
        dispatch({type: "LOGOUT"});
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Store.Provider value={contextValue}>
      {children}
    </Store.Provider>
  )
};

export function useAppContext() {
  return useContext(Store);
};

export const logoutUser = async () => {
  try {
    Cookies.remove("blog__isLoggedIn")
    Cookies.remove("blog__userInfo")
    if (localStorage.getItem("blog__follows")) localStorage.removeItem("blog__follows");
    if (localStorage.getItem("blog__trends")) localStorage.removeItem("blog__trends");
  } catch (err) {
    console.error(err);
  }
};