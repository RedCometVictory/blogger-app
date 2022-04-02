import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';
const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
import Blocks from "editorjs-blocks-react-renderer";
import { useRouter } from "next/router";
import { useAppContext } from 'context/Store';
import axios from 'axios';
import api from "@/utils/api";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { toast } from "react-toastify";
import Comment from '../../components/comments/Comment';
import CommentForm from '../../components/comments/CommentForm';
import TrendAside from "../../components/TrendAside";

const Blog = ({ blogData }) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  let [parsedBlocks, setParsedBlocks] = useState();

  const isValidJSONString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  useEffect(() => {
    console.log("auth.isAuthenticated")
    console.log(auth.isAuthenticated)
    if (!Cookies.get("blog__isLoggedIn")) return router.push("/")
    if (!auth.isAuthenticated || auth?.user?.role !== 'user') {
      console.log("redirecting user to home page")
      return router.push("/");
    };
    let validJson = isValidJSONString(blogData.text);
    if (validJson) {
      setParsedBlocks(JSON.parse(blogData.text));
    }
    dispatch({type: "GET_POST_BY_ID", payload: blogData});
  }, []);

  // parent class is blog__text
  const blocksConfig={
    code: {
      className: "code-block"
    },
    delimiter: {
      className: "delimiter"
    },
    embed: {
      className: "border-0"
    },
    header: {
      className: "header"
    },
    image: {
      className: "w-full max-w-screen-md",
      actionsClassNames: {
        stretched: "w-full h-80 object-cover",
        withBorder: "border border-2",
        withBackground: "p-2",
      }
    },
    list: {
      className: "list"
    },
    paragraph: {
      className: "text-base",
      actionsClassNames: {
        alignment: "text-{alignment}", // This is a substitution placeholder: left or center.
      }
    },
    quote: {
      className: "py-3 px-5 italic font-serif"
    },
    table: {
      className: "table-auto"
    }
  };

  const likeHandler = async (id) => {
    try {
      let res = await api.post(`/post/like/${blogData._id}`);
      dispatch({type: "LIKE_POST", payload: res.data.data.likes});
      
      toast.success("Post liked!")
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => toast.error(error.msg));
      }
    }
  };
  
  const unLikeHandler = async (id) => {
    try {
      let res = await api.put(`/post/unlike/${blogData._id}`);
      dispatch({type: "UNLIKE_POST", payload: res.data.data.likes});
      toast.success("Post unliked!")
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => toast.error(error.msg));
      }
    }
  };

  // <section className="feed__layout">
  //   <div className="container feed-container">
  //       <Feed />
  //       <TrendAside />
  //   </div>
  // </section>
  return (<>
    <div className="blog container">
      <section className="blog__page">
        {blogData && blogData.coverImage && (
          <div className="blog__image">
            <Image
              className={"blog__img"}
              src={blogData.coverImage}
              fill="layout"
              alt="user avatar"
              // width={500}
              // height={250}
              layout="fill"
            />
          </div>
        )}
        <div className="blog__container">
          <div className="blog__header">
            <h2>{blogData.title}</h2>
            <div className="blog__user-info">
              {blogData.avatarImage && (
                <div className="blog__image-avatar">
                  <Image
                    className={"blog__img"}
                    src={blogData.avatarImage}
                    fill="layout"
                    alt="user avatar"
                    // width={500}
                    // height={250}
                    layout="fill"
                    // image is stretched, apply custom css to fix
                  />
                </div>
              )}
              <div className="blog__author">
                {/* <span><em>Written By: {`${auth.user.firstName} ${auth.user.lastName}`}</em></span> */}
                <span><em>Written By: {`${blogData.username}`}</em></span>
              </div>
            </div>
            <div className="blog__options">
              {auth.isAuthenticated && auth?.user?._id === blogData?.user && (
                <Link
                  passHref
                  href={`/posts/f/update/${blogData._id}`}
                >
                  <button className="btn btn-secondary">Edit</button>
                </Link>
              )}
              <div className="comment__options blog-header">
                <div className="comment__thumbs">
                  <div className="thumb" onClick={() => likeHandler()}>
                    <FaRegThumbsUp />
                  </div>
                  <div className="">{post?.post?.likes?.length > 0 ? post.post.likes.length : 0}</div>
                  <span className='spacer'>|</span>
                  <div className="thumb" onClick={() => unLikeHandler()}>
                    <FaRegThumbsDown />
                  </div>
                  {/* <div className="">{post.post.likes?.length > 0 ? post.post.likes.length : 0}</div> */}
                </div>
              </div>
            </div>
            <p>Category: {blogData.category}</p>
            <div className="blog__tags">
              {blogData?.tags?.map((tag, index) => (
                <div className="blog__tag-item" key={index}>
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </div>
              ))}
            </div>
          </div>
          <div className="blog__content">
            <div className="blog__text">
              {parsedBlocks ? (
                <Blocks
                  data={parsedBlocks}
                  config={blocksConfig}
                />
              ) : (
                <>{blogData.text}</>
              )}
            </div>
          </div>
          <CommentForm prodId={blogData._id} />
          <Comment comments={post?.post?.comments} />
        </div>
      </section>
      <div className="blog__aside">
        <div className="blog__author blog-block">
          <div className="blog__author-block">
            {blogData.avatarImage && (
              <div className="blog__image-avatar">
                <Image
                  className={"blog__img"}
                  src={blogData.avatarImage}
                  fill="layout"
                  alt="user avatar"
                  // width={500}
                  // height={250}
                  layout="fill"
                  // image is stretched, apply custom css to fix
                />
              </div>
            )}
            <div className="author-name">
              {blogData.username}
            </div>
          </div>
          <div className="blog__follow">
            <button className="btn btn-secondary">
              Follow
            </button>
          </div>
          <div className="joined">Joined {blogData?.createdAt?.slice(0, 10)}</div>
        </div>
        <TrendAside />
      </div>
    </div>
  </>);
};
export default Blog;
export const getServerSideProps = async (context) => {
  try {
    let post_id = context.query.slug;
    let initPostInfo = '';
    // let token = context.req.cookies.blog__token;
    if (context.query.slug !== 'create') {
      // retreive post data
      initPostInfo = await api.get(`/post/${post_id}`, 
      { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      );
      // initPostInfo = await axios({
      //   method: 'get',
      //   url: `http://localhost:3000/api/post/${post_id}`,
      //   headers: context.req ? { cookie: context.req.headers.cookie } : undefined
      // });
    }
    let initBlog = initPostInfo.data.data;

    // console.log("initPostInfo");
    // console.log(initPostInfo.data);

    return {
      props: { blogData: initBlog ? initBlog.postData : '' }
    }
  } catch (err) {
    return {
      props: {
        blogData: ''
      }
    }
  }
};