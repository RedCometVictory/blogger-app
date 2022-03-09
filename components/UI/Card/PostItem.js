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
          <div className="post__title">
            <h2>
              <Link
                passHref
                // href={`/posts/update/${post?._id}`}
                href={`/posts/${post?._id}`}
              >
                <div className="">{post.title}</div>
              </Link>
            </h2>
          </div>
        </div>
        <div className="post__info_section">
          {/* save css used for image */}
          {/* {post.coverImage.length > 0 && (
            <div className="post__image">
              <Image
                className="post__img"
                src={post.coverImage}
                alt="post"
                placeholder={blur}
                // width={800}
                // height={400}
                // layout="intrinsic"
                // layout="fixed"
                // layout="responsive"
                layout="fill"
                // objectFit="cover"
                // unoptimized={true}
              />
            </div>
          )} */}
          <div className="post__information">
            <div className="post__user-sec">
              <div className="post__user-avatar">
                {post.avatarImage.length > 0 && (
                  <Image
                    className="post__img-avatar"
                    src={post.avatarImage}
                    alt="avatar"
                    placeholder={blur}
                    layout="fill"
                  />
                )}
              </div>
              <div className="post__user-name">
                <h5>{post.username}</h5>
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
              <div className="post__thumb-sec">
                {/* <div className="post__count">
                  {post?.likes?.length || 0}
                </div> */}
                <div className="post__thumb">
                  <div className="down">
                    <FaRegThumbsDown />
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