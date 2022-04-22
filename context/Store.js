import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { useHistory } from "next/router";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import cookie from "cookie";

const Store = createContext();

export const StoreProvider = ({ reducer, initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  console.log("currentState");
  console.log(state);

  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch]);
  // check if state exists in LS
  useEffect(() => {
    // let authUser = localStorage.getItem("blog__auth") ? JSON.parse(localStorage.getItem("blog__auth")) : ""
    console.log("INIT STORE")
    console.log("Cookies.get('blog__isLoggedIn')")
    console.log(Cookies.get('blog__isLoggedIn'))
    console.log("Cookies.get('blog__userInfo')")
    // console.log(Cookies.get("blog__token"))
    // let token = Cookies.get("blog__token");
    // if (Cookies.get("blog__token")) {
    //   console.log("blog__token = true")
    // } else {
    //   console.log("blog__token = false")
    // }
    // checkUserLoggedIn();
    if (Cookies.get("blog__token")) {
      // Cookies.set("blog__isLoggedIn", true);
    };
    let authUser = Cookies.get("blog__userInfo") ? JSON.parse(Cookies.get("blog__userInfo")) : ""
    console.log("authUser")
    console.log(authUser)
    
    // if (authUser && token) {
    if (authUser && Cookies.get('blog__isLoggedIn')) {
      // Cookies.set("blog__isLoggedIn", true);
      console.log("INIT STORE - Loading User")
      dispatch({
        type: "USER_LOADED",
        payload: authUser
      });
    }
  }, []);
  useEffect(() => {
    // updated state values stored into cookie
    if (state !== initialState) {
      // todo - ensure that when this cookie expires that it does not provent auto loggin out or user
      console.log("STATE STORE CHANGE")
      // console.log(Cookies.get("blog__token"))
      // let token = Cookies.get("blog__token");
      // console.log("token")
      // console.log(token)
      // Cookies.set("blog__userInfo", JSON.stringify(state.auth.user), {expires: 7, sameSite: 'strict'});
      // Cookies.set("blog__isLoggedIn", true);
      Cookies.set("blog__userInfo", JSON.stringify(state.auth.user));
      localStorage.setItem("blog__follows", JSON.stringify(state.follow.followers));
      console.log("State Store Change")
      console.log("STATE:")
      console.log(state);
      // checkUserLoggedIn()

      // cookie.parse();
      // localStorage.setItem("blog__auth", JSON.stringify(state.auth.user));
    }
  }, [state]);

  const checkUserLoggedIn = async() => {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&")
    console.log("CHECKED USER LOGIN STATUS")
    try {
      const res = await fetch(`http://localhost:3000/api/auth/checkAuth`);
      // const initLikeFeed = await axios({
      //   method: 'get',
      //   url: 'http://localhost:3000/api/',
      //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
      // });
      const data = await res.json();
      if (res.ok) {
        console.log("user auth checked - approved")
        console.log("data")
        console.log(data)
      } else {
        console.log("user auth checked - UNAUTHORIZED")
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        Cookies.remove("blog__isLoggedIn")
        Cookies.remove("blog__userInfo")
        dispatch({type: "LOGOUT"});
        history.push("/");
      }
    } catch (err) {
      console.error(err)
    }
  };
  // ------------------------------------------------
  // <Store.Provider value={{value}}>
  // <Store.Provider value={{state, dispatch}}>
  return (
    <Store.Provider value={contextValue}>
      {children}
    </Store.Provider>
  )
};

// // export default StoreProvider;
export function useAppContext() {
  return useContext(Store);
};

/*
import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NEXT_URL } from '@/config/index'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const router = useRouter()

  useEffect(() => checkUserLoggedIn(), [])

  // Register user
  const register = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
      router.push('/account/dashboard')
    } else {
      setError(data.message)
      setError(null)
    }
  }

  // Login user
  const login = async ({ email: identifier, password }) => {
    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
      router.push('/account/dashboard')
    } else {
      setError(data.message)
      setError(null)
    }
  }

  // Logout user
  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST',
    })

    if (res.ok) {
      setUser(null)
      router.push('/')
    }
  }

  // Check if user is logged in
  const checkUserLoggedIn = async (user) => {
    const res = await fetch(`${NEXT_URL}/api/user`)
    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
*/