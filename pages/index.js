import { useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import cookie from "cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppContext } from "context/Store";
import axios from "axios";
import api from "@/utils/api"
import { HiOutlineDesktopComputer, HiViewGridAdd, HiOutlineCode } from "react-icons/hi";
import { AiOutlineArrowRight } from "react-icons/ai";
// import Navbar from "../components/NavBar";
import { ControlGroup } from "../components/UI/FormControlGroup";
import { buildUrl } from 'cloudinary-build-url';
import { Button } from "../components/UI/Button";
import SearchBar from "../components/UI/SearchBar";
import GridMain from "../components/GridMain";
import GridItem from "../components/UI/GridItem";
// import AsideNav from "components/UI/Aside";
import Feed from '../components/Feed';
import TrendAside from "../components/TrendAside";
// import Footer from "../components/Footer";
import HeroGraphic from "../img/hero.svg";
import Blog1 from "../img/blog1.jpg";
import Blog2 from "../img/blog2.jpg";
import Blog3 from "../img/blog3.jpg";
import Blog4 from "../img/blog4.jpg";
import Blog5 from "../img/blog5.png";
import Blog6 from "../img/blog6.jpg";
import theme_Osaka from "../img/themes-osaka.jpg"
import theme_sacramento from "../img/themes-sacramento.jpg"
import theme_florida from "../img/themes-florida.jpg"
import theme_illinois from "../img/themes-illinois.jpg"
import theme_texas from "../img/themes-texas.jpeg"
import theme_toronto from "../img/themes-toronto.jpg"
import theme_toronto2 from "../img/themes-toronto-2.jpg"
import theme_tokyo from "../img/themes-tokyo.jpg"
import image_localization from "../img/globe.png";
import image_money from "../img/money.png";
import image_creditCards from "../img/credit-cards.png";

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

const Home = ({initGeneral, initTrend, token}) => {
  // console.log("initGzeneral - beginning of page")
  // console.log(initGeneral)
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  const [trendList, setTrendList] = useState(initTrend);

  console.log("trendList")
  console.log(trendList)
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
    localStorage.setItem("blog__trends", JSON.stringify(initTrend));
    // Cookies.set("blog__trends", JSON.stringify(initTrend));
  }, []);

  return auth.isAuthenticated && Cookies.get("blog__isLoggedIn") ? (
    <section className="feed__layout">
      <div className="container feed-container">
          <Feed />
          <TrendAside />
      </div>
    </section>
  ) : (<>
    <div className="landing hero">
      <div className="container">
        <div className="hero">
          <div className="heroMain">
            <h1 className="heroMainHeading">
              Lorem, Ipsum 
              <br/>
              <span>BinaryBlog.</span>
              <br/>
              Blog About Anything
            </h1>
            <h3 className="heroMainSubText">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, repellat quidem.
            </h3>
            <ControlGroup type={"email"} placeholder={"Enter Your email"} id={"heroEmailInput"} className={"heroMainInput"} />
            <Link passHref href={"/register"}>
              <div className="heroMainSignUp" id="heroMainSignUpButton">
                <span>
                  Sign Up 
                </span>
                <AiOutlineArrowRight className={"innerIcon"} size={"25"}/> 
              </div>
              {/* <Button id={"heroMainSignUpButton"} className={"heroMainSignUp"} btnText={"Sign Up"} icon={<AiOutlineArrowRight className={"innerIcon"} size={"25"}/>}/>  */}
            </Link>
          </div>
          <div className="heroGraphicWrapper">
            <Image
              className={"heroGraphic"}
              src={HeroGraphic}
              alt='hero graphic'
              width={700}
              height={700}
            />
          </div>
        </div>
      </div> 
    </div>
    <section className="highlights">
      <div className="container">
        <GridMain>
          <GridItem icon={<HiOutlineDesktopComputer className={"gridItemIcon"} size={"30"} />}>
            <h2 className="gridItemHeading">Blogs For Everyone</h2>
            <p className="gridItemText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          </GridItem>            
          <GridItem icon={<HiViewGridAdd className={"gridItemIcon"} size={30} />}>
            <h2 className="gridItemHeading">Get Inspired</h2>
            <p className="gridItemText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          </GridItem>            
          <GridItem icon={<HiOutlineCode className={"gridItemIcon"} size={30} />} >
            <h2 className="gridItemHeading">Developers Guide</h2>
            <p className="gridItemText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          </GridItem>            
        </GridMain>
      </div>
    </section>
    <section className="topBlogs">
      <h1 className="landingHeading">Top Blogs</h1>
      <h2 className="landingSubHeading">Read the Best blogs From around The world.</h2>
      <div className="container">
        <GridMain >
          <GridItem >
            <Image className="gridItemImage"  width={"550px"} height={"400px"} src={Blog1} alt={""} />
            <h2 className="gridItemHeading">Theme</h2>
            <p className="gridItemDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Vel nemo eaque deserunt vitae voluptates.
            </p>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage"  width={"550px"} height={"650px"} src={Blog2} alt={""} />
            <h2 className="gridItemHeading">Theme</h2>
            <p className="gridItemDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Vel nemo eaque deserunt vitae voluptates.
            </p>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage"  width={"550px"} height={"400px"} src={Blog3} alt={""} />
            <h2 className="gridItemHeading">Theme</h2>
            <p className="gridItemDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Vel nemo eaque deserunt vitae voluptates.
            </p>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage" width={"550px"} height={"650px"} src={Blog4} alt={""} />
            <h2 className="gridItemHeading">Theme</h2>
            <p className="gridItemDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Vel nemo eaque deserunt vitae voluptates.
            </p>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage" width={"550px"} height={"400px"} src={Blog5} alt={""} />
            <h2 className="gridItemHeading">Theme</h2>
            <p className="gridItemDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Vel nemo eaque deserunt vitae voluptates.
            </p>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage" width={"550px"} height={"650px"} src={Blog6} alt={""} />
            <h2 className="gridItemHeading">Theme</h2>
            <p className="gridItemDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Vel nemo eaque deserunt vitae voluptates.
            </p>
            {/*GridItemLink */}
          </GridItem>
        </GridMain>
      </div>
    </section>
    <section className="themes">
      <h1 className="landingHeading">Themes</h1>
      <h2 className="landingSubHeading">Try Our Recommented Themes to Customize Your Blog.</h2>
      <div className="container">
        <GridMain>
          <GridItem >
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_Osaka} alt={""} />
            <h2 className="gridItemHeading">Theme : Osaka </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_florida} alt={""} />
            <h2 className="gridItemHeading">Theme : Floria </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_illinois} alt={""} />
            <h2 className="gridItemHeading">Theme : Illinois </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem>
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_texas} alt={""} />
            <h2 className="gridItemHeading">Theme : Texas </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem>
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_tokyo} alt={""} />
            <h2 className="gridItemHeading">Theme : Tokyo </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem>
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_sacramento} alt={""} />
            <h2 className="gridItemHeading">Theme : Sacramento </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem >
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_toronto2} alt={""} />
            <h2 className="gridItemHeading">Theme : Toronto 2 </h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem>
            <Image className="gridItemImage" width={"300px"} height={"300px"} src={theme_Osaka} alt={""} />
            <h2 className="gridItemHeading">Theme : Osaka </h2>
            {/*GridItemLink */}
          </GridItem>
        </GridMain>
        <Button className={"landingBtn"} btnText={"Start Your Free Trial"}/>
      </div>
    </section>
    <section id="active-register-theme" className="active_reg">
      <h1 className="landingHeading">Activate Your Themes</h1>
      <h2 className="landingSubHeading">Begin Increasing Your Reputation to the world today.</h2>
      <div className="container">
        <GridMain>
          <GridItem height={"300px"}>
            <div className="gridItemImageWrapper">
              <Image id="globe" className="gridItemImage" width={"100px"} height={"100px"} src={image_localization} alt={""}
              />
            </div>
            <h2 className="gridItemHeading">Localisation</h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem height={"300px"}>
            <div className="gridItemImageWrapper">
              <Image id="cash" className="gridItemImage" width="100px" height="100px"  src={image_money} alt={""}
              />
            </div>
            <h2 className="gridItemHeading">Monetization</h2>
            {/*GridItemLink */}
          </GridItem>
          <GridItem height={"300px"}>
            <div className="gridItemImageWrapper">
              <Image id="security" className="gridItemImage" width="100px" height="100px" src={image_creditCards} alt={""}
              />
            </div>
            <h2 className="gridItemHeading">Security</h2>
            {/*GridItemLink */}
          </GridItem>
        </GridMain>
        <Button className={"landingBtn"} btnText={"Start Your Free Trial"}/>
      </div>
    </section>
    <section className="testimonials">
      <h1 className="landingHeading">What They&#39;ve Said</h1>
      <div className="testimonial">
        <h3 className="landingSubHeading">Ali Bravo</h3>
        <h2 className="testimonialText">We have been able to cancel so many other subscriptions since using BinaryBlog. There is no more cross-channel confusion and everyone is much more focused.</h2>
      </div>
      <Button className={"landingBtn"} btnText={"Get Started"}/>
    </section>
    {/* <Footer /> */}
  </>)
}
export default Home;
export const getServerSideProps = async (context) => {
  // console.log("context")
  // console.log(context)
  // console.log("+++++++++++++++++++++++++")
  try {
    console.log(">>>>> context.req.headers.cookie <<<<<")
    console.log(context.req.headers.cookie)
    console.log(">>>>> context.req.headers.cookie <<<<<")
    // let cookies = context.req.cookies;
    // console.log(">>>>> cookies <<<<<")
    // console.log(cookies)
    // console.log(">>>>> cookies <<<<<")
    let token = context.req.cookies.blog__token;
    let userInfo = context.req.cookies.blog__userInfo;
    console.log("token")
    console.log(token)
    // console.log("userinfo")
    // console.log(userInfo)
    console.log("++++++++++++^^^+++++++++++++")
    console.log("++++++++++++^^^+++++++++++++")

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
    console.log("inHeaderToken")
    console.log(inHeaderToken)
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
    // const initTrendingFeed = await axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/api/posts/trending',
    //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    // });
    // console.log("initTrendingFeed")
    // console.log(initTrendingFeed.data.data)
    // console.log(" ^^^^^^^^^^^^^^^ initTrendingFeed - END ^^^^^^^^^^^^^^^")
    // console.log(" ^^^^^^^^^^^^^^^ initTrendingFeed - END ^^^^^^^^^^^^^^^")
    // console.log(" ^^^^^^^^^^^^^^^ initTrendingFeed - END ^^^^^^^^^^^^^^^")
    // const initPersonalFeed = await axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/api/',
    //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    // });
    // console.log(initPersonalFeed.data.data)
    
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