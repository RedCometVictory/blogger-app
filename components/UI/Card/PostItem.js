import React from 'react';
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCommentDots } from "react-icons/fa";

const PostItem = ({post}) => {
  let router = useRouter();
  const searchTagHandler = (value) => {
    if (value.startsWith("#")) {
      value = value.substring(1);
    }
    router.push({
      pathname: '/',
      query: {
        tag: value
      }
    })
  };
  return (
    <article className="post post__card">
      <div className="post__content">
        <div className="post__header">
          <div className="">
            <h2>
              <div className="post__title-container">
                <Link
                  passHref
                  href={`/posts/${post?._id}`}
                >
                  {post.title}
                </Link>
              </div>
            </h2>
          </div>
        </div>
        <div className="post__info_section">
          <div className="post__information">
            <div className="post__user-sec">
              <div className="post__user-avatar">
                {post.avatarImage.length > 0 && (
                  <Link
                    passHref
                    href={`/profile/${post?.user}`}
                  >
                    <Image
                      className="post__img-avatar"
                      src={post.avatarImage}
                      alt="avatar"
                      placeholder={blur}
                      layout="fill"
                    />
                  </Link>
                )}
              </div>
              <div className="post__user-name">
                <Link
                  passHref
                  href={`/profile/${post?.user}`}
                >
                  <h5>
                    {post.username}
                  </h5>
                </Link>
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
          <div className="post__tags">
            {post?.tags.map((tag, index) => (
              <div className="post__tag-item" key={index} onClick={(e) => searchTagHandler(tag)}>
                {tag.startsWith("#") ? tag : `#${tag}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
export default PostItem;