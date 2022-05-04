import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
const Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });
import Blocks from "editorjs-blocks-react-renderer";
import { useRouter } from "next/router";
import { useAppContext, logoutUser } from 'context/Store';
import api from "@/utils/api";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { toast } from "react-toastify";
import Comment from '../../components/comments/Comment';
import CommentForm from '../../components/comments/CommentForm';
import TrendAside from "../../components/TrendAside";
import Spinner from "../../components/Spinner";

const Blog = ({ blogData, token }) => {
  const { state, dispatch } = useAppContext();
  const { auth, post, follow } = state;
  const router = useRouter();
  let [parsedBlocks, setParsedBlocks] = useState();
  const [setConfirmDelete, isSetConfirmDelete] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  let isCurrentlyFollowing;

  let followResult = follow?.followers?.filter(follow => follow.follower_id === auth?.user?._id && follow.following_id === blogData?.user);
  isCurrentlyFollowing = followResult?.length > 0;

  let [showFollow, setShowFollow] = useState(isCurrentlyFollowing);

  const isValidJSONString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  useEffect(() => {
    if (!token) {
      dispatch({type: "LOGOUT"});
      logoutUser();
      return router.push("/");
    }
    setIsLoading(false);
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

  const followHandler = async (id) => {
    try {
      let res = await api.post(`/user/follow/${blogData.user}`);
      if (res) {
        dispatch({type: "FOLLOW_USER", payload: res.data.data.followUser});

        // set to false
        setShowFollow(!showFollow);
        toast.success("User followed.");
      } else {
        toast.error("Failed to follow user.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failure to follow user.");
    }
  };
  
  const unFollowHandler = async (id) => {
    try {
      let res = await api.put(`/user/follow/unfollow?user_id=${blogData.user}`);
      if (res) {
        dispatch({type: "UNFOLLOW_USER", payload: res.data.data.followers});
        setShowFollow(!showFollow);
        toast.success("User unfollowed!");
      } else {
        toast.error("Failed to unfollow user.");
      };
    } catch (err) {
      console.error(err);
      toast.error("Failure to follow user.");
    }
  };

  const likeHandler = async (id) => {
    try {
      let res = await api.post(`/post/like/${blogData._id}`);
      if (res) {
        dispatch({type: "LIKE_POST", payload: res.data.data.likes});
      
        toast.success("Post liked!");
      } else {
        toast.error("Failed to like post.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failure to like blog post.");
    }
  };
  
  const unLikeHandler = async (id) => {
    try {
      let res = await api.put(`/post/unlike/${blogData._id}`);
      if (res) {
        dispatch({type: "UNLIKE_POST", payload: res.data.data.likes});

        toast.success("Post unliked!");
      } else {
        toast.error("Failed to unlike blog post.");
      };
    } catch (err) {
      console.error(err);
      toast.error("Failure to unlike blog post.");
    }
  };
  
  const onDeleteHandler = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/post/${blogData._id}`);
      toast.success("Deleted post!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
      setIsLoading(false);
    }
  };

  const DeleteModal = () => {
    return (
      <div className="blog__delete-modal">
        <div className="comment__btns">
          <div className="comment__delete-confirm">
            <div>Delete post? Are you sure?</div>
            <div className="comment__delete-btns">
              <button className="btns del-primary" onClick={e => onDeleteHandler(blogData._id)}>Yes</button>
              <button className="btns del-secondary" onClick={() => isSetConfirmDelete(false)}>No</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return isLoading ? (
    <Spinner />
  ) : (<>
    {setConfirmDelete && (
      <DeleteModal />
    )}
    <div className="blog container">
      <section className="blog__page">
        {blogData && blogData.coverImage && (
          <div className="blog__image">
            <Image
              className={"blog__img"}
              src={blogData.coverImage}
              alt="user avatar"
              layout="fill"
            />
          </div>
        )}
        <div className="blog__container">
          <div className="blog__header">
            <h2>{blogData.title}</h2>
            <div className="blog__user-info">
              {blogData.avatarImage && (
                <Link
                  passHref
                  href={`/profile/${blogData?.user}`}
                >
                  <div className="blog__image-avatar">
                    <Image
                      className={"blog__img"}
                      src={blogData.avatarImage}
                      alt="user avatar"
                      layout="fill"
                      // image is stretched, apply custom css to fix
                    />
                  </div>
                </Link>
              )}
              <div className="blog__author">
                <span>
                  <em>Written By:{" "}
                    <Link
                      className="blog__auth-name"
                      passHref
                      href={`/profile/${blogData?.user}`}
                    >
                      {`${blogData.username}`}
                    </Link>
                  </em>
                </span>
              </div>
            </div>
            <div className="blog__options">
              <div className="blog__option-btns">
                {auth.isAuthenticated && auth?.user?._id === blogData?.user ? (<>
                  <Link
                    passHref
                    href={`/posts/f/update/${blogData._id}`}
                  >
                    <button className="btn btn-secondary">Edit</button>
                  </Link>
                    <div className="delete">
                      <button className="btn btn-secondary" onClick={() => isSetConfirmDelete(true)}>Delete</button>
                    </div>
                </>) : showFollow ? (
                  <div className="blog__follow menu">
                    <button className="btn btn-secondary" onClick={() => unFollowHandler()}>
                      Unfollow
                    </button>
                  </div>
                ) : (
                  <div className="blog__follow menu">
                    <button className="btn btn-secondary" onClick={() => followHandler()}>
                      Follow
                    </button>
                  </div>
                )}
              </div>
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
              <Link
                passHref
                href={`/profile/${blogData?.user}`}
              >
                <div className="blog__image-avatar">
                  <Image
                    className={"blog__img"}
                    src={blogData.avatarImage}
                    fill="layout"
                    alt="user avatar"
                    layout="fill"
                  />
                </div>
              </Link>
            )}
            <Link
              passHref
              href={`/profile/${blogData?.user}`}
            >
              <div className="author-name">
                {blogData.username}
              </div>
            </Link>
          </div>
          {auth?.user?._id === blogData?.user ? (
            <>
            <div className=""></div>
            </>
          ) : showFollow ? (
            <div className="blog__follow">
              <button className="btn btn-secondary" onClick={() => unFollowHandler()}>
                Unfollow
              </button>
            </div>
          ) : (
            <div className="blog__follow">
              <button className="btn btn-secondary" onClick={() => followHandler()}>
                Follow
              </button>
            </div>
          )}
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
    let token = context.req.cookies.blog__token;
    // let userInfo = context.req.cookies.blog__userInfo;

    let post_id = context.query.slug;
    let initPostInfo = '';
    if (context.query.slug !== 'create') {
      // retreive post data
      initPostInfo = await api.get(`/post/${post_id}`, 
      { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      );
    }
    let initBlog = initPostInfo.data.data;
    return {
      props: {
        blogData: initBlog ? initBlog.postData : '',
        token: token
      }
    }
  } catch (err) {
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
      props: {},
    };
  }
};