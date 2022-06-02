import Axios from 'axios';
import history from "@/utils/history";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const api = Axios.create({
  // baseURL: 'http://localhost:3000/api', // ---
  // baseURL: `${process.env.NEXT_APP_DOMAIN}/api`,
  // baseURL: 'https://blogger-app-umber.vercel.app/api',
  baseURL: '/api', // ---
  timeout:25000,
  // headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
  withCredentials: true,
  credentials: 'include',
});

//*** ORIGINAL REQQUEST
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // extracting response and config objects
    const { response, config } = error;
    // checking if error is unauthorized error
    let originalRequest = config;

    if (response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        toast.error("Error: Token expired. Authorization denied.")
        Cookies.remove("blog__isLoggedIn")
        Cookies.remove("blog__userInfo")
        return history.push("/");
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return Promise.reject(err);
  }
);
export default api;