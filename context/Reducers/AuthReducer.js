import Cookies from "js-cookie";
export const authInitialState = {
  token: '',
  isAuthenticated: Cookies.get("blog__isLoggedIn") ? true : false,
  // isAuthenticated: !Cookies.get("blog__isLoggedIn") ? false : JSON.parse(Cookies.get("blog__isLoggedIn")) ? true : false,
  // isAuthenticated: false,
  loading: true,
  // user: {}
  user: Cookies.get("blog__userInfo") ? JSON.parse(Cookies.get("blog__userInfo")) : {}
  // user: localStorage.getItem("blog__auth") ? JSON.parse(localStorage.getItem("blog__auth")) : {}
};

export const AuthReducer = (state = authInitialState, action) => {
  const { type, payload } = action;
  switch(type) {
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      return {
        ...state,
        auth: {
          user: payload,
          isAuthenticated: true,
          loading: false
        },
      }
    case "USER_LOADED":
      return {
        ...state,
        auth: {
          user: payload,
          isAuthenticated: true,
          loading: false
        }
      }
    case "UPDATE_USER_INFO":
      return {
        ...state,
        auth: {
          user: payload,
          isAuthenticated: true,
          loading: false
        }
      }
    case "REGISTER_FAIL":
    case "AUTH_ERROR":
    case "LOGIN_FAILURE":
    case "LOGOUT":
    case "ACCOUNT_DELETED":
      return {
        ...state,
        auth: {
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null
        }
      }
    default:
      return state;
  }
};