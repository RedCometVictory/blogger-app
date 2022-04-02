import Axios from 'axios';
import { useRouter } from 'next/router';
import history from "@/utils/history";
import Cookies from "js-cookie";
import { useAppContext } from 'context/Store';

const api = Axios.create({
  baseURL: 'http://localhost:3000/api',
  // baseURL: `${process.env.NEXTAUTH_URL}/api`,
  // baseURL: '/api',
  timeout:25000,
  // headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
  // headers: {
  //   "Authorization": "Bearer " + Cookies.get("blog__token")
  // },
  // headers: {
    // 'X-Content-Type-Options': "nosniff",
    // 'Content-Type': 'application/json',
    // 'Content-Type': 'multipart/form-data'
  // },
  withCredentials: true,
  credentials: 'include',
});

// api.interceptors.request.use(
  //   function (config) {
//     const token = localStorage.getItem("token");
//     //checking if accessToken exists
//     if (token) {
//       config.headers["Authorization"] = "Bearer " + token;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

//*** ORIGINAL REQQUEST
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    //extracting response and config objects
    const { response, config } = error;
    //checking if error is Aunothorized error
    let originalRequest = config;
    // let router = useRouter();

    if (response?.status === 401) {
      try {
        console.log("AXIOS: 401, logout")
        console.log("AXIOS - attempting to remove cookie")
        // Cookies.remove("blog__userInfo");
        // Cookies.remove("blog__isLoggedIn");
        // const { state, dispatch } = useAppContext();
        console.log("redirecting to main page")
        // history.push("/")
        await api.get("/auth/signout");
        // dispatch({ type: "LOGOUT" });
        // router.push("/login")
      } catch (err) {
        return Promise.reject(err);
      }
      return Promise.reject(err);
    };

    // if (response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refResponse = await api.get("/auth/refresh-token");
    //     let accessToken = refResponse.data.data.token;
    //     if (accessToken) {
    //       store.dispatch(refreshAccessToken(accessToken));
    //       config.headers["Authorization"] = "Bearer " + accessToken;
    //     }
    //     //with new token retry original request
    //     return api(originalRequest);
    //   } catch (err) {
    //     // store.dispatch(logout())
    //     if (err.response && err.response.data) {
    //       return Promise.reject(err.response.data);
    //     }
    //     return Promise.reject(err);
    //   }
    // }
    // return Promise.reject(error)

    // if (response?.status === 401 && originalRequest.url.includes("auth/refresh-token")) {
    //   // stop loop
    //   store.dispatch(logout(history));
    //   return Promise.reject(error);
    // }
    // if (response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refResponse = await api.get("/auth/refresh-token");
    //     let accessToken = refResponse.data.data.token;
    //     if (accessToken) {
    //       store.dispatch(refreshAccessToken(accessToken));
    //       config.headers["Authorization"] = "Bearer " + accessToken;
    //     }
    //     //with new token retry original request
    //     return api(originalRequest);
    //   } catch (err) {
    //     // store.dispatch(logout())
    //     if (err.response && err.response.data) {
    //       return Promise.reject(err.response.data);
    //     }
    //     return Promise.reject(err);
    //   }
    // }
    // return Promise.reject(error)
  }
);


// --------------------------------------------------
// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response.status === 401) {
//       const { state, dispatch } = useAppContext();
//       dispatch({ type: "LOGOUT" });
//       Router.push("/login")
//     }
//     return Promise.reject(err);
//   }
// );
// --------------------------------------------------
export default api;






// const api = Axios.create({
//   baseURL: 'http://localhost:3000/api',
//   // baseURL: `${process.env.NEXTAUTH_URL}/api`,
//   // baseURL: '/api',
//   // headers: {
//   //   "Authorization": "Bearer " + Cookies.get("blog__token")
//   // },
//   // headers: {
//     // 'X-Content-Type-Options': "nosniff",
//     // 'Content-Type': 'application/json',
//     // 'Content-Type': 'multipart/form-data'
//   // },
//   withCredentials: true,
//   credentials: 'include',
// });

// api.interceptors.request.use(
//   function (config) {
//     const token = localStorage.getItem("token");
//     // const token = Cookies.get("blog__token");
//     const token = Cookies.get("blog__token") ? JSON.parse(Cookies.get("blog__token")) : "";
//     if (token) {
//       config.headers["Authorization"] = "Bearer " + token;
//       // config.headers["Authorization"] = token;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response.status === 401) {
//       const { state, dispatch } = useAppContext();
//       // useAppContext.store.dispatch
//       // state.auth
//       dispatch({ type: "LOGOUT" });
//       // store.dispatch({ type: LOGOUT });
//       Router.push("/login")
//     }
//     return Promise.reject(err);
//   }
// );
// export default api;
