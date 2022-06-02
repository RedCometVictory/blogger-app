import { useEffect, useState} from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "context/Store";
import { toast } from "react-toastify";
import api from "@/utils/api"
import { getData } from "@/utils/fetchData";
import { HiOutlineDesktopComputer, HiViewGridAdd, HiOutlineCode } from "react-icons/hi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { ControlGroup } from "../components/UI/FormControlGroup";
import GridMain from "../components/GridMain";
import GridItem from "../components/UI/GridItem";
import Feed from '../components/Feed';
import TrendAside from "../components/TrendAside";
import HeroGraphic from "../img/hero.svg";
import Blog1 from "../img/blog1.jpg";

const Home = ({initGeneral, initTrend, initFollow, token, feedBtn}) => {
  const { state, dispatch } = useAppContext();
  const { auth, follow } = state;
  const [emailList, setEmailList] = useState('');

  useEffect(() => {
    if (token && auth.isAuthenticated) {
      dispatch({type: "GET_ALL_POSTS", payload: {posts: initGeneral.posts, trends: initTrend}});
      dispatch({type: "GET_FOLLOW_STATUS", payload: initFollow});
      localStorage.setItem("blog__trends", JSON.stringify(initTrend));
      localStorage.setItem("blog__follows", JSON.stringify(initFollow));
    }
  }, [initGeneral]);

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
          <Feed feedBtn={feedBtn}/>
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
          </div>
          <div className="hero__graphic-wrapper">
            <Image
              className={"heroGraphic"}
              src={HeroGraphic}
              alt='hero graphic'
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
  try {
    let loadFeedBtn = false;
    let token = context.req.cookies.blog__token;
    let userInfo = context.req.cookies.blog__userInfo;

    let keyword = context.query.keyword || '';
    let category = context.query.category || '';
    let tag = context.query.tag || '';
    let page = context.query.page || 1;
    let pageNumber = context.query.pageNumber || 1;
    let offsetItems = context.query.itemsPerPage || 12;
    let initGeneralFeed;

    if (keyword || tag || category) {
      loadFeedBtn = true;
    };
    if (category === "All") {
      category = "";
      loadFeedBtn = false;
    };

    if (token) {
      // initGeneralFeed = await api.get(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`,
      // {headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      // );
      // initGeneralFeed = await getData(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`);
      // initGeneralFeed = await getData(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`, {headers: context.req ? { cookie: context.req.headers.cookie } : undefined});
      initGeneralFeed = await getData(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`, context.req ? { cookie: context.req.headers.cookie } : undefined);

      // const initTrendingFeed = await api.get('/posts/trending', 
      // { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      // );
  
      // const initTrendingFeed = await getData(`/posts/trending`, {headers: context.req ? { cookie: context.req.headers.cookie } : undefined});
      const initTrendingFeed = await getData(`/posts/trending`, context.req ? { cookie: context.req.headers.cookie } : undefined);
      // const initTrendingFeed = await getData(`/posts/trending`);

      // const initFollow = await api.get('/user/follow/status', 
      // { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      // );

      // const initFollow = await getData(`/user/follow/status`, {headers: context.req ? { cookie: context.req.headers.cookie } : undefined});
      const initFollow = await getData(`/user/follow/status`, context.req ? { cookie: context.req.headers.cookie } : undefined);
      // const initFollow = await getData(`/user/follow/status`);

      // return {
      //   props: {
      //     initGeneral: initGeneralFeed.data.data,
      //     initTrend: initTrendingFeed.data.data.defaultTrends,
      //     initFollow: initFollow.data.data.followers,
      //     token: token,
      //     feedBtn: loadFeedBtn
      //   }
      // }
      console.log("initGeneralFeed")
      console.log(initGeneralFeed)
      console.log("initTrendingFeed")
      console.log(initTrendingFeed)
      console.log("initFollow")
      console.log(initFollow)
      return {
        props: {
          initGeneral: initGeneralFeed.data,
          initTrend: initTrendingFeed.data.defaultTrends,
          initFollow: initFollow.data.followers,
          token: token,
          feedBtn: loadFeedBtn
        }
      }
    }
    return {
      props: {
        initGeneral: [],
        initTrend: [],
        initFollow: [],
        token: "",
        feedBtn: ""
      }
    }
  } catch (err) {
    console.error(err);
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