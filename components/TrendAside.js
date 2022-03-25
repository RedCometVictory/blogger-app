import { useState } from 'react';
import Link from "next/link";
import { useAppContext } from "context/Store";
import { FaRegThumbsUp, FaRegComments } from "react-icons/fa";

export const TrendAside = () => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;

  return (
    <aside className="trending">
      {post && post?.trends.map((topics, index) => (
        <div className="trending__card" key={index}>
          <h3 className="trending__name">
            {topics.name.startsWith("#") ? topics.name : `#${topics.name}`}
          </h3>
          <h6 className="trending__intro"><em>{topics.intro}</em></h6>
          <div className="trending__list">
            {topics.list.map((topic, index) => (
              <div className="trending__item" key={index}>
                <Link
                  passHref
                  href={`/posts/${topic?._id}`}
                >
                  <div className="trending__title">
                    {topic.title}
                  </div>
                </Link>
                <div className="trending__stat">
                  <div className="trending__count first">
                    <div className="trending__icon">
                      <FaRegThumbsUp />
                    </div>
                    {topic.comments.length}
                  </div>
                  <div className="trending__count">
                    <div className="trending__icon">
                      <FaRegComments />
                    </div>
                    {topic.likes.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};
export default TrendAside;