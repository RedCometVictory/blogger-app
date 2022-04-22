import { useEffect, useState, useContext } from 'react';
import { useRouter } from "next/router";
import { useAppContext } from 'context/Store';
import { FaPen, FaPencilAlt, FaUpload, FaSearch } from 'react-icons/fa';
import { MdOutlineClose } from 'react-icons/md';
import Link from 'next/link';
import api from '@/utils/api';
import axios from 'axios';
import PostItem from "./UI/Card/PostItem";
// import AsideNav from './UI/Aside';

// const Feed = ({initGeneral}) => {
const Feed = ({feedPost}) => {
  const { state, dispatch } = useAppContext();
  const { auth, profile, post } = state;
  const [feedPosts, setFeedPosts] = useState(post.posts || []);
  const [currentPage, setCurrentPage] = useState(1)
  // total count of posts
  const [pageNumber, setPageNumber] = useState(12);

  useEffect(() => {
    if (!auth.isAuthenticated && auth.user.role !== 'user') return router.push("/");
  }, [state.post]);

  // useEffect(() => {
  //   if (Object.keys(post.posts).length === 0) {
  //     dispatch({type: "GET_ALL_POSTS", payload: initGeneral})
  //   }
  // }, []);

  useEffect(() => {
    if (!feedPosts) setFeedPosts(post.posts); 
  }, []);
  // console.log("**********feedPosts***********")
  // console.log(feedPosts)
  // console.log("**********state posts***********")
  // console.log(post.posts)

  // <div className='feed profileCenter'>
  return (
    <section className="feed__container">
      <div className="feed__header">
        <div className="feed__feed-list">
          <div className="feed__set-feed one">
            <div className="feed__set-text">General</div>
          </div>
          <div className="feed__set-feed two">
            <div className="feed__set-text">Personal</div>
          </div>
          <div className="feed__set-feed three">
            <div className="feed__set-text">Liked</div>
          </div>
        </div>
        <div className="feed__selection">
          <div className="feed__sub-selection one">
            <div className="feed__group">
              {/* <label htmlFor="tag">Tags: </label>
              <input 
                name="tag"
                type="text"
                placeholder="seperate, tags,by,comma"
                onChange={(e) => setTag(e.target.value)}
              /> */}
            </div>
            <div className="feed__group">
              {/* <label htmlFor="tag">Category: </label> */}
              {/* <input 
                name="tag"
                type="text"
                placeholder="seperate, tags,by,comma"
                onChange={(e) => setTag(e.target.value)}
              /> */}
              {/* <select name="category" value={category} onChange={e => categoryChange(e)}>
                {categories.map((category, index) => (
                  <option value={category.category} key={index}>{category.category}</option>
                ))}
              </select> */}
              <select name="category" className="feed__category-select">
                <option value="All">Category</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
                <option value="Video Games">Video Games</option>
                <option value="Web Development">Web Development</option>
                <option value="Technology">Technology</option>
                <option value="Crypto">Bitcoin / Crypto</option>
                <option value="Science">Science</option>
                <option value="Environment">Environment</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>
          <div className="feed__sub-selection two">
            <div className="feed__group">
              <Link
                passHref
                href={{
                  pathname: '/posts/f/[slug]',
                  query: { slug: 'create' },
                }}>
                <div className="text btn btn-secondary">Create</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <form onSubmit={formSubmit}> */}
          {/* <button type="submit">Search</button> */}
        {/* </form> */}
        {/* <PostItem /> */}
        {/* {feedPosts && feedPosts.length > 0 ? ( */}
        {post.posts && post.posts.length > 0 ? (
          <div className="feed__wrapper">
            <div className="feed__wrapper-inner-">
              {/* <p>Create new post. Must be logged in.</p> */}
            </div>
            <div className="feed__posts">
              {post.posts.map((post, i) => <PostItem post={post} key={i} />)}
            </div>
          </div>
        ) : (
          <div className="feed__wrapper">
            <div className="feed__wrapper-inner">
              <p>Please <Link href="/login"><a>login</a></Link>.</p>
            </div>
            <div className="feed__posts">
              <div>
                No posts found. Follow profiles in order to start seeing posts in your personal feed or visit <Link href="/"><a>general feed</a></Link>. Or clear all search constraints.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
};
// </div>
export default Feed;