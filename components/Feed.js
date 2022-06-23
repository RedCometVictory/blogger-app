import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useAppContext } from 'context/Store';
import Link from 'next/link';
import api from '@/utils/api';
import PostItem from "./UI/Card/PostItem";

const Feed = ({feedBtn}) => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const [feedPosts, setFeedPosts] = useState(post.posts || []);
  // current Page
  const [pageNumber, setPageNumber] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(12);
  const [category, setCategory] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [addingPosts, setAddingPosts] = useState(false);
  const [allPosts, setAllPosts] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated && auth.user.role !== 'user') return router.push("/");
    setAllPosts(false);
  }, [state.post]);

  useEffect(() => {
    if (!feedPosts) setFeedPosts(post.posts); 
  }, []);

  useEffect(() => {
    router.push({
      pathname: '/',
      query: {
        category: category
      }
    }) 
  }, [category]);

  const getAdditionalPosts = async () => {
    setAddingPosts(true);
    setPageNumber(pageNumber = pageNumber + 1);
    let res = await api.get(`/posts?pageNumber=${pageNumber}`);

    if (res.data.data.posts.length > 0) {
      setAddingPosts(false);
      dispatch({type: "ADD_ADDITIONAL_POSTS", payload: {posts: res.data.data.posts}});
    };
    
    if (res.data.data.posts.length === 0) {
      setAddingPosts(false);
      setAllPosts(true);
      setPageNumber(pageNumber = 1);
    };
  };

  const changeCategoryHandler = (e) => {
    setCategory(category = e.target.value);
  };

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
              <select name="category" className="feed__category-select" onChange={(e) => changeCategoryHandler(e)}>
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
        {post.posts && post.posts.length > 0 ? (
          <div className="feed__wrapper">
            <div className="feed__wrapper-inner-">
            </div>
            <div className="feed__posts">
              {post.posts.map((post, i) => <PostItem post={post} key={i} />)}
            </div>
            <div className="feed__load-posts">
              {feedBtn || allPosts ? (
                <></>
              ) : !addingPosts && !allPosts ? (
                <button className="feed__load-btn btn btn-secondary" onClick={(e) => getAdditionalPosts(e)}>Load More</button>
              ) : (
                <button className="feed__load-btn btn btn-secondary">Loading...</button>
              )}
            </div>
          </div>
        ) : (
          <div className="feed__wrapper">
            <div className="feed__posts">
              <div>
                No posts found. Try clearing all search constraints and queries.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
};
export default Feed;