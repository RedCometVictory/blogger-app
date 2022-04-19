import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCommentDots } from "react-icons/fa";
import Blog1 from "../../../img/blog1.jpg";

// const {avatarImage, category, comments[], ccoverImage, coverImageFilename, createdAt, likes[], tags["video", "file", "film"], text, title, updatedAt, user, username } = post

export const PostItem = ({post}) => {
  return (
    <article className="post post__card">
      <div className="post__content">
        <div className="post__header">
          <div className="">
            <h2>
              <div className="post__title-container">
                <Link
                  passHref
                  // className="post__title"
                  // href={`/posts/update/${post?._id}`}
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
              <div className="post__tag-item" key={index}>
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