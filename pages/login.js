import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "@/utils/api";
import { useAppContext } from "context/Store";
import { toast } from "react-toastify";
import { ControlGroup } from "../components/UI/FormControlGroup";

const Login = () => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [formData, setFormData] = useState ({
    email: '', password: ''
  });
  
  useEffect(() => {
    if (state?.auth?.isAuthenticated) router.push('/');
  }, []);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const signinHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post('/auth/signin', formData);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data.user });
      console.log("loggin intyo acct")
      console.log(res.data)
      router.push('/');
    } catch (err) {
      toast.error('Invalid password or email. Try again.')
      // const errors = err.response.data.errors;
      // if (errors) {
      //   errors.forEach(error => toast.error(error.msg));
      // }
    }
  };

  return(<>
    <div className="login__body">
      <div id="login-id" className="login">
        <div className="login__screen">
          <div className="log__sign">
            <div id="login__sign-top-id" className="login__sign-top">
              <Link passHref={true} href="/login" data-attr="login" id="log-head-id" className="login__head">
              <h3 id="log-head-h3">Login</h3>
            </Link>
            <Link passHref={true} href="/register" data-attr="signUp" id="sign-head-id" className="login__sign-up-head">
              <h3 id="sign-up-h3">Sign Up</h3>
            </Link>
            </div>
          <hr className="login__sign-hr login-hr" id="login__sign-hr-id" />
        </div>
        <div  className="login__app-title login-title" id="login-title-id">
          <h1>Login</h1>
        </div>
        <form onSubmit={signinHandler} className="login__form" id="login-form-id">
          <ControlGroup
            name={"email"}
            type={"email"}
            placeholder={"email"}
            id={"login-name"}
            className={"fui-user"}
            onChange={onChange}
            value={email}
            required={true}
          />
          <ControlGroup
            name={"password"}
            type={"password"}
            placeholder={"password"}
            id={"login-pass"}
            className={"fui-lock"}
            onChange={onChange}
            value={password}
            required={true}
          />
          <button id="btn-reg" className="btn btn-primary btn-secondary btn-large btn-block" type="submit">
            Sign In
          </button>
          <p>
            Don&apos;t have an account?{" "}<Link passHref href="/register"><span className="form login__link">Sign up.</span></Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  </>)
}
export default Login;