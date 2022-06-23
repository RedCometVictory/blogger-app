import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppContext, logoutUser } from "context/Store";
import api from "@/utils/api";
import { getData } from "@/utils/fetchData";
import Image from "next/image";
import { FaRegThumbsUp, FaRegCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import TrendAside from "../../../components/TrendAside";
import { FaLaptopCode, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaReddit, FaGithub } from 'react-icons/fa';
import Spinner from "../../../components/Spinner";

const PublicProfile = ({publicProfile, token}) => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { auth, profile, follow } = state;
  let { profileData } = profile;
  let [isLoading, setIsLoading] = useState(true);

  let isCurrentlyFollowing;
  let followResult = follow?.followers?.filter(follow => follow.follower_id === auth?.user?._id && follow.following_id === publicProfile?.user?._id);
  isCurrentlyFollowing = followResult?.length > 0;

  let [showFollow, setShowFollow] = useState(isCurrentlyFollowing);

  useEffect(() => {
    if (!token) {
      dispatch({type: "LOGOUT"});
      logoutUser();
      return router.push("/");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (publicProfile) {
      dispatch({type: "GET_PROFILE", payload: publicProfile})
    } else {
      try {
        let publicProfile = api.get('/user/public-profile');
        if (publicProfile) {
          dispatch({type: "GET_PROFILE", payload: publicProfile.data.data});
        
          toast.success("Profile fetched!")
        } else {
          toast.error("Failed to get user profile.")  
        }
      } catch (err) {
        console.error(err);
        toast.error("Profile does not exist.");
      }
    }
  }, []);

  const followHandler = async (id) => {
    try {
      let res = await api.post(`/user/follow/${profileData?.user?._id}`);
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
      let res = await api.put(`/user/follow/unfollow?user_id=${profileData?.user._id}`);
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

  const ProfileSocials = ({socials}) => {
    return (
      <section>
        <div className="profile__socials-wrapper">
          <div className="profile__socials">
            {socials && socials?.website && (
              <a className="profile__social" href={socials?.website} target="_blank" rel="noopener noreferrer">
                <FaLaptopCode />
              </a>
            )}
            {socials && socials?.youtube && (
              <a className="profile__social" href={socials?.youtube} target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            )}
            {socials && socials?.facebook && (
              <a className="profile__social" href={socials?.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
            )}
            {socials && socials?.twitter && (
              <a className="profile__social" href={socials?.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            )}
            {socials && socials?.instagram && (
              <a className="profile__social" href={socials?.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}
            {socials && socials?.linkedin && (
              <a className="profile__social" href={socials?.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            )}
            {socials && socials?.reddit && (
              <a className="profile__social" href={socials?.reddit} target="_blank" rel="noopener noreferrer">
                <FaReddit />
              </a>
            )}
            {socials && socials?.github && (
              <a className="profile__social" href={socials?.github} target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      </section>
    );
  };
  
  return isLoading ? (
    <Spinner />
  ) : (<>
    <div className="blog container">
      <section className="blog__page">
        {profileData && profileData?.profile?.backgroundImage && (
          <div className="blog__image">
            <Image
              className={"blog__img"}
              src={profileData.profile.backgroundImage}
              alt="user avatar"
              layout="fill"
            />
          </div>
        )}
        <div className="blog__container">
          <div className="blog__header">
            <h2>User Profile</h2>
            <div className="blog__user-info">
              {profileData.user.avatarImage && (
                <div className="blog__image-avatar uncursor">
                  <Image
                    className={"blog__img"}
                    src={profileData.user.avatarImage}
                    alt="user avatar"
                    layout="fill"
                  />
                </div>
              )}
              <div className="blog__author">
                <span><em>{`${profileData?.user?.username}`}</em></span>
              </div>
            </div>
            <div className="blog__options">
              {auth.isAuthenticated && auth?.user?._id === profileData?.profile?.user && (
                <Link
                  passHref
                  href={`/profile`}
                >
                  <button className="btn btn-secondary">Edit</button>
                </Link>
              )}
            </div>
            <p>{profileData?.user.email}</p>
            <div className="header-bio">
              <p>{profileData?.profile.bio}</p>
            </div>
          </div>
          <div className="blog__content">
            {profileData?.profile?.social && (
              <ProfileSocials socials={profileData?.profile?.social}/>
            )}
          </div>
          <section className="comments">
            {profileData?.userPosts?.length < 1 ? (
              <div className="">No posts.</div>
            ) : (
              <div className="">
                {profileData?.userPosts?.map((post) => (
                  <div className="comment__card" key={post._id}>
                    <div className="comment__container">
                      <div className="comment__header profile">
                        <div className="comment__header-profile">
                          <div className="comment__header-info">
                            {post.avatarImage && (
                              <div className="comment__image-avatar avatar">
                                <Image
                                  className={"comment__img profile"}
                                  src={post.avatarImage}
                                  fill="layout"
                                  alt="user avatar"
                                  layout="fill"
                                />
                              </div>
                            )}
                            <div className="comment__username">
                              {post.username}
                            </div>
                          </div>
                          <div className="post__likes-sec">
                            <div className="post__thumb-sec">
                              <div className="post__count">
                                {post?.likes?.length || 0}
                              </div>
                              <div className="post__thumb">
                                <div className="up">
                                  <FaRegThumbsUp />
                                </div>
                              </div>
                            </div>
                            <div className="post__thumb-sec comments">
                              <div className="post__count">
                                {post?.comments?.length || 0}
                              </div>
                              <div className="post__thumb">
                                <div className="comments"></div>
                                <FaRegCommentDots />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="comment__username profile">
                          <Link
                            passHref
                            href={`/posts/${post?._id}`}
                          >
                            <h2 className="post-title">
                              {post.title}
                            </h2>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
      <div className="blog__aside">
        <div className="blog__author blog-block">
          <div className="blog__author-block">
            {profileData?.user?.avatarImage && (
              <div className="blog__image-avatar">
                <Link
                  passHref
                  href={`/profile`}
                >
                  <a className="blog__img-to-profile">
                    <Image
                      src={profileData?.user?.avatarImage}
                      fill="layout"
                      alt="user avatar"
                      layout="fill"
                    />
                  </a>
                </Link>
              </div>
            )}
            <Link
              passHref
              href={`/profile`}
            >
              <div className="author-name">
                {profileData.user.username}
              </div>
            </Link>
          </div>
          {auth?.user?._id === profileData?.user?._id ? (
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
          <div className="joined">Joined {profileData?.user?.createdAt?.slice(0, 10)}</div>
        </div>
        <TrendAside />
      </div>
    </div>
  </>);
};
export default PublicProfile;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.blog__token;
    const publicProfile = await getData(`/user/public-profile?user_id=${context.query.user_id}`, context.req ? { cookie: context.req.headers.cookie } : undefined);
    return {
      props: {
        publicProfile: publicProfile.data,
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