import { useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import cookie from "cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppContext } from "context/Store";
import { toast } from "react-toastify";
import axios from "axios";
import api from "@/utils/api"
import { HiOutlineDesktopComputer, HiViewGridAdd, HiOutlineCode } from "react-icons/hi";
import { AiOutlineArrowRight } from "react-icons/ai";
// import Navbar from "../components/NavBar";
import { ControlGroup } from "../components/UI/FormControlGroup";
import { buildUrl } from 'cloudinary-build-url';
import SearchBar from "../components/UI/SearchBar";
import GridMain from "../components/GridMain";
import GridItem from "../components/UI/GridItem";
// import AsideNav from "components/UI/Aside";
import Feed from '../components/Feed';
import TrendAside from "../components/TrendAside";
// import Footer from "../components/Footer";
import HeroGraphic from "../img/hero.svg";
import Blog1 from "../img/blog1.jpg";

// const url = buildUrl('[Your Cloudinary Image ID]', {
//     cloud: {
//       cloudName: '[Your Cloudinary Cloud Name]',
//     },
//     transformations: {
//       effect: {
//         name: 'pixelate',
//         value: 40
//       }
//     }
// });
// const url = buildUrl('[Your Cloudinary Image ID]', {
//     cloud: {
//       cloudName: 'process.env.NEXT_APP_CLOUDINARY_CLOUD_NAME',
//     },
//     transformations: {
//       effect: {
//         name: 'pixelate',
//         value: 40
//       }
//     }
// });

const Home = ({initGeneral, initTrend, initFollow, token}) => {
  console.log("initGzeneral - beginning of page")
  // console.log(initGeneral)
  console.log("FE: token")
  console.log(token)
  const { state, dispatch } = useAppContext();
  const { auth, follow } = state;
  const router = useRouter();
  const [trendList, setTrendList] = useState(initTrend);
  const [emailList, setEmailList] = useState('');

  console.log("trendList")
  console.log(trendList)
  console.log("initFollow")
  console.log(initFollow)
  // useEffect(() => {
  //   if (!auth.isAuthenticated && auth.user.role !== 'user') {
  //     setstate
  //     return router.push("/")
  //   };
  // }, []);
  useEffect(() => {
    if (!token) {
      console.log("useeffect, logging out")
      dispatch({type: "LOGOUT"});
      Cookies.remove("blog__isLoggedIn");
      Cookies.remove("blog__userInfo");
      router.push("/");
    }
    dispatch({type: "GET_ALL_POSTS", payload: {posts: initGeneral.posts, trends: initTrend}});
    console.log("HOME: GET_FOLLOW_STATUS")
    console.log("initFollow")
    console.log(initFollow)
    dispatch({type: "GET_FOLLOW_STATUS", payload: initFollow});
    localStorage.setItem("blog__trends", JSON.stringify(initTrend));
    localStorage.setItem("blog__follows", JSON.stringify(initFollow));
    // Cookies.set("blog__trends", JSON.stringify(initTrend));
  }, []);

  // const onChange = (e) => {
  //   setEmailList({ ...emailList, [e.target.name]: e.target.value })
  // }

  const emailSignUpHandler = async (e) => {
    e.preventDefault();
    if (typeof emailList === 'string' && emailList.length > 0) {
      if (emailList.search('@') && emailList.length > 5) {
        setEmailList('');
        return toast.success("Thank you for signing-up!");
      }
      return toast.error("Please provide a email.");
    }
  };

  return auth.isAuthenticated && Cookies.get("blog__isLoggedIn") ? (
    <section className="feed__layout">
      <div className="container feed-container">
          <Feed />
          <TrendAside />
      </div>
    </section>
  ) : (<>
    <div className="landing">
      <div className="hero">
        <div className="hero__main">
          <h1 className="hero__heading">
            Zuit,{" "}
            <span><em>The Quick Blog</em></span>
          </h1>
          <div className="hero__center">
            <h3 className="hero__sub-text">
              Blog, Share; Anything, Anywhere!
            </h3>
            <h5 className="hero__email">
              Sign up to our e-mail list for site updates and promotionals.
            </h5>
            <form onSubmit={emailSignUpHandler}>
              <ControlGroup
                type={"email"}
                name={"emailList"}
                placeholder={"Enter Your email"}
                id={"heroEmailInput"}
                className={"hero__input"}
                onChange={e => setEmailList(e.target.value)}
                value={emailList}
              />
              <button
                id="heroMainSignUpButton"
                className="hero__sign-up"
                type="submit"
              >
                Sign Up{" "}<AiOutlineArrowRight className={"innerIcon"} size={"25"}/>
              </button>
            </form>
            {/* <Link passHref href={"/register"}>
              <div className="hero__sign-up" id="heroMainSignUpButton">
                <span>
                  Sign Up 
                </span>
                <AiOutlineArrowRight className={"innerIcon"} size={"25"}/> 
              </div>
            </Link> */}
          </div>
          <div className="hero__graphic-wrapper">
            {/* <img src={HeroGraphic} alt="hero graphic" /> */}
            <Image
              className={"heroGraphic"}
              src={HeroGraphic}
              alt='hero graphic'
              // width={700}
              // height={700}
              // layout="fill"
              layout="responsive"
              // layout="raw"
            />
          </div>
        </div>
      </div>
      <section className="landing__highlights">
        <h2 className="header">
          Simplistic UI - makes blogging easy.
        </h2>
        <div className="container">
          <GridMain>
            <GridItem icon={<HiOutlineDesktopComputer className={"grid__item-icon"} size={"30"} />}>
              <h2 className="grid__item-heading">Blogs For Everyone</h2>
              <p className="grid__item-text">Anyone can be a blogger! Share your thoughts with the world.</p>
            </GridItem>          
            <GridItem icon={<HiViewGridAdd className={"grid__item-icon"} size={30} />}>
              <h2 className="grid__item-heading">Get Inspired</h2>
              <p className="grid__item-text">Communicate with ease and explore other users&lsquo; blogs.</p>
            </GridItem>            
            <GridItem icon={<HiOutlineCode className={"grid__item-icon"} size={30} />} >
              <h2 className="grid__item-heading">Blogger&lsquo;s Guide</h2>
              <p className="grid__item-text">Our blogging editor is built with simple use and communication in mind. Making the chore of blogging easy!</p>
            </GridItem>            
          </GridMain>
        </div>
      </section>
      <section className="landing__blogs">
        <h2 className="blog-heading">Express Yourself</h2>
        <p className="blog-sub-heading"> Pick from an assortment of themes to customize your experience!.</p>
        <div className="blog-image">
          <Image
            className={"grid__item-image"}
            src={Blog1}
            alt={""}
            layout="responsive"
          />
          <h3 className="grid__item-heading">Themes</h3>
          <p className="grid__item-description">New themes to be added soon!
          </p>
        </div>
      </section>
      <section className="landing__testimonials">
        <h2 className="heading">What They&#39;ve Said</h2>
        <div className="testimonial">
          <h3 className="landingSubHeading">-{" "}Ali Bravo{" "}-</h3>
          <blockquote className="testimonial-text">
            <em>
              &quot;We have been able to cancel so many other subscriptions since using Zuit. There is no more cross-channel confusion and everyone is much more focused.&quot;
            </em>
          </blockquote>
        </div>
        <Link
          passHref
          href={"/register"}
        >
          <div className="start">Get started for free.</div>
        </Link>
      </section>
    </div>
  </>)
}
export default Home;
export const getServerSideProps = async (context) => {
  // console.log("context")
  // console.log(context)
  // console.log("+++++++++++++++++++++++++")
  try {
    // console.log(">>>>> context.req.headers.cookie <<<<<")
    // console.log(context.req.headers.cookie)
    // console.log(">>>>> context.req.headers.cookie <<<<<")
    // let cookies = context.req.cookies;
    // console.log(">>>>> cookies <<<<<")
    // console.log(cookies)
    // console.log(">>>>> cookies <<<<<")
    let token = context.req.cookies.blog__token;
    let userInfo = context.req.cookies.blog__userInfo;
    // console.log("token")
    // console.log(token)
    // console.log("userinfo")
    // console.log(userInfo)
    // console.log("++++++++++++^^^+++++++++++++")
    // console.log("++++++++++++^^^+++++++++++++")

    // if (!token) {
    //   console.log("token is expired, emoveing logged in coolie")
    //   Cookies.remove("blog__isLoggedIn")
    //   context.res.setHeader(
    //     "Set-Cookie", [
    //     // `blog__token=deleted; Max-Age=0`,
    //     `blog__isLoggedIn=deleted; Max-Age=0`,
    //     `blog__userInfo=deleted; Max-Age=0`]
    //   );
    // };


    // if (!token) {
    //   // Cookies.remove("blog__userInfo")
    //   // Cookies.remove(userInfo)
    //   // Cookies.set("blog__userInfo", '')
    //   // Cookies.remove(userInfo)
    //   // console.log("dispatch logout")
    //   // console.log("userinfo")
    //   // console.log(userInfo)
    //   // context.res.setHeader(
    //   //   "Set-Cookie", [
    //   //     `blog__isLoggedIn=deleted; Max-Age=0`,
    //   //     `blog__userInfo=deleted; Max-Age=0`]
    //   // );


    //   // context.res.setHeader(
    //   //   "Set-Cookie", [
    //   //   `blog__token=deleted; Max-Age=0`,
    //   //   `blog__isLoggedIn=deleted; Max-Age=0`,
    //   //   `blog__userInfo=deleted; Max-Age=0`]
    //   // );


    //   // dispatch({ type: "LOGOUT" });
    //   // ctx.res.setHeader(
    //   //   "Set-Cookie", [
    //   //   `WebsiteToken=deleted; Max-Age=0`,
    //   //   `AnotherCookieName=deleted; Max-Age=0`]
    //   // );
    //   // console.log("attempting to remove cookie")
    //   // Cookies.remove("blog__userInfo");
    //   // Cookies.set("blog__token", '', { expires: new Date(1), path: '/' })
    //   // res.writeHead(302, { Location: '/' });
    //   // res.end()
    //   // res.setHeader(
    //   //   "Set-Cookie",
    //   //   cookie.serialize("blog__token", '', { expires: new Date(1), maxAge: -1, path: '/' })
    //   // );
    //   // const logout = await axios({
    //   const logout = await api.post('/auth/signout', 
    //   { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
    //   );
    //   // await axios({
    //   //   method: 'post',
    //   //   url: 'http://localhost:3000/api/auth/signout',
    //   //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    //   //   withCredentials: true,
    //   //   credentials: 'include'
    //   // });
    //   console.log("**********++^^^++**********")
    //   // console.log("token")
    //   // console.log(token)
    //   // console.log("logout")
    //   // console.log(logout)
    //   console.log("**********++^^^++**********")
    //   return {
    //     props: {
    //       initGeneral: [],
    //       initPersonal: [],
    //       initLiked: []
    //     }
    //   }
    // };




    let inHeaderToken;
    inHeaderToken = cookie.parse(context.req.headers.cookie.blog__token ? context.req.headers.cookie.blog__token || '?' : "");
    // console.log("inHeaderToken")
    // console.log(inHeaderToken)
    // cookie.parse(req ? req.headers.cookie || '' : '')
        
    // const initGeneralFeed = await axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/api/posts?keyword=&category=&tag=&pageNumber=1&offsetItems=12',
    //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    // });
    const initGeneralFeed = await api.get('/posts?keyword=&category=&tag=&pageNumber=1&offsetItems=12',
    {headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
    );
    // console.log("initGeneralFeed.data.data")
    // console.log("+++++++++++++++++++++++++")
    // console.log("+++++++++++++++++++++++++")
    // console.log("+++++++++++++++++++++++++")
    // console.log(initGeneralFeed.data.data)
    // let initGeneral = initGeneralFeed.data.data;
    const initTrendingFeed = await api.get('/posts/trending', 
    { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
    );

    const initFollow = await api.get('/user/follow/status', 
    { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
    );
    // const initTrendingFeed = await axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/api/posts/trending',
    //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    // });
    // console.log("initTrendingFeed")
    // console.log(initTrendingFeed.data.data)
    // console.log(" ^^^^^^^^^^^^^^^ initTrendingFeed - END ^^^^^^^^^^^^^^^")
    // console.log(" ^^^^^^^^^^^^^^^ initTrendingFeed - END ^^^^^^^^^^^^^^^")

    // const initLikeFeed = await axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/api/',
    //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    // });

    // console.log(initLikeFeed.data.data)
    // initGeneral: {posts: [{}, ...], page: #, pages: 12 || 20}
    return {
      props: {
        initGeneral: initGeneralFeed.data.data,
        initTrend: initTrendingFeed.data.data.defaultTrends,
        initFollow: initFollow.data.data.followers,
        token: token
      }
    }
  } catch (err) {
    console.log("ERROR!!!!!!!!")
    // Cookies.remove("blog__isLoggedIn")
    // Cookies.remove("blog__userInfo")
    // Cookies.set("blog__userInfo", '')
    //   // Cookies.remove(userInfo)
    // // dispatch({ type: "LOGOUT" });
    //   context.res.setHeader(
    //     "Set-Cookie", [
    //     `blog__token=deleted; Max-Age=0`,
    //     `blog__isLoggedIn=deleted; Max-Age=0`,
    //     `blog__userInfo=deleted; Max-Age=0`]
    //   );
    return {
      props: {
        initGeneral: [],
        initTrend: [],
        initFollow: [],
        token: ""
      }
    }
  }
};

/* ORIGINAL VERSION
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <h2><Link href="/auth/authTest"><a>Test Auth</a></Link></h2>
        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
*/