import Axios from 'axios';
import history from "@/utils/history";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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

//*** ORIGINAL REQQUEST
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    //extracting response and config objects
    const { response, config } = error;
    //checking if error is Aunothorized error
    let originalRequest = config;

    if (response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        console.log("AXIOS: 401 attempting to remove cookie")
        toast.error("Error: Token expired. Authorization denied.")
        Cookies.remove("blog__isLoggedIn")
        Cookies.remove("blog__userInfo")
        return history.push("/");
      } catch (err) {
        return Promise.reject(err);
      }
      return Promise.reject(err);
    };
  }
);
export default api;