import { useEffect, useState, useContext } from 'react';
import { useRouter } from "next/router";
import { useAppContext } from 'context/Store';
import Link from 'next/link';
import api from '@/utils/api';
import PostItem from "./UI/Card/PostItem";

const Feed = ({feedBtn}) => {
  console.log("feedBtn - FEED comp")
  console.log(feedBtn)
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { auth, profile, post } = state;
  const [feedPosts, setFeedPosts] = useState(post.posts || []);
  // const [currentPage, setCurrentPage] = useState(1)
  // total count of posts
  const [pageNumber, setPageNumber] = useState(1);
  // const [hasMounted, setHasMounted] = useState(false);
  // let [currentPage, setCurrentPage] = useState(page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addingPosts, setAddingPosts] = useState(false);
  // const [allPosts, setAllPosts] = useState(allPosts = feedBtn || false);
  // const [allPosts, setAllPosts] = useState(allPosts = feedBtn || false);
  const [allPosts, setAllPosts] = useState(false);
  console.log("^^^^^^ Feed Comp - vbegging  page number ^^^^^^")
  console.log(pageNumber)
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
  // dispatch({type: "GET_ALL_POSTS", payload: {posts: initGeneral.posts, trends: initTrend}});
  //   // if (!feedPosts) setFeedPosts(post.posts); 
  }, [category]);
  

const getAdditionalPosts = async () => {
  setAddingPosts(true);
  console.log("+++++ pageNumber - start +++++")
  console.log(pageNumber)
  setPageNumber(pageNumber = pageNumber + 1);
  // dispatch({type: "INCREMENT_POST_PAGE", payload: {page: }});
  // let res = api.get(`/posts?keyword=${keyword}&category=${category ? category : ''}&tag=${keyword}&pageNumber=${currentPage}&offsetItems=${itemsPerPage}`);
  let res = await api.get(`/posts?pageNumber=${pageNumber}`);
  // router.push({
    //     pathname: '/',
    //     query: {
      //       // category: category
      //       page: pageNumber
      //     }
      // })
      console.log("res")
      // console.log(res.data.data.posts)
  if (res.data.data.posts.length > 0) {
    console.log("+++++ pageNumber - added +++++")
    console.log(pageNumber)
    console.log("more posts found, appending to client state")
    // console.log("searching for posts")
    setAddingPosts(false);
    dispatch({type: "ADD_ADDITIONAL_POSTS", payload: {posts: res.data.data.posts}});
  };
  
  if (res.data.data.posts.length === 0) {
    console.log("no posts found")
    setAddingPosts(false);
    setAllPosts(true);
    setPageNumber(pageNumber = 1);
    console.log("+++++ pageNumber - reset +++++")
    console.log(pageNumber)
  };
};

  
  // useEffect(() => {
    //   if (Object.keys(post.posts).length === 0) {
    //     dispatch({type: "GET_ALL_POSTS", payload: initGeneral})
    //   }

    // if (router.query.keyword) {
    //   console.log("router.query in useeffect");
    //   console.log(router.query);
    //   let {keyword} = router.query;
    //   console.log("keyword")
    //   console.log(keyword)
    //   ;
    //   
      // await api.get(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&pageNumber=${currentPage}&offsetItems=${itemsPerPage}`);
      // await api.get('/posts?keyword=&category=&tag=&pageNumber=1&offsetItems=12',
      // {headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      // );
      // dispatch({type: "GET_ALL_POSTS", payload: {posts: post.posts, trends: post.trends}});
    // };
  // }, [feedPosts]);
  // }, [feedPosts, post.posts]);
  // }, [post.posts]);
  // }, [keyword]);
  // console.log("**********feedPosts***********")
  // console.log(feedPosts)
  // console.log("**********state posts***********")
  // console.log(post.posts)

  
  const categoryChange = (e) => {
    setIsLoading(true);
    setCurrentPage(1);
    setCategory(e.target.value); // 12 or 20, dropdown
  };

  const itemCountChange = (e) => {
    setIsLoading(true);
    if (e.target.value > itemsPerPage) {
      setCurrentPage(currentPage = currentPage - 1);
    }
    setItemsPerPage(Number(e.target.value)); // 12 or 20, dropdown
  };

  const pageChange = (chosenPage) => {
    setCurrentPage(chosenPage);
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  const changeCategoryHandler = (e) => {
    console.log("changing category")
    console.log(e.target.value)

    setCategory(category = e.target.value);
    console.log(" state - category")
    console.log(category)
  };

  /*
    const dispatch = useDispatch();
  const { keyword } = useParams();
  const allProducts = useSelector(state => state.product);
  const { loading, categories, products, page, pages } = allProducts;
  
  
  useEffect(() => {
    setIsLoading(true);
    dispatch(listAllCategories());
    dispatch(listAllProducts(keyword, category !== 'All' ? category : '', currentPage, itemsPerPage));
  }, [dispatch, keyword, category, currentPage, itemsPerPage]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  */
 console.log("allPosts")
 console.log(allPosts)

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