import Cookies from "js-cookie";
export const postInitialState = {
  post: {},
  posts: [],
  trends: typeof window === "undefined" ? [] : localStorage.getItem("blog__trends") ? JSON.parse(localStorage.getItem("blog__trends")) : [],
  loading: true,
  error: {}
};

export const PostReducer = (state = postInitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "GET_ALL_POSTS": // main feed
      return {
        ...state,
        post: {
          posts: payload.posts,
          trends: payload.trends,
          loading: false
        },
      };
    case "GET_POST_BY_ID":
      return {
        ...state,
        post: {
          post: payload,
          posts: [...state.post.posts],
          trends: [...state.post.trends],
          loading: false
        },
      };
    case "CREATE_POST":
      return {
        ...state,
        posts: [payload, ...state.posts], // reversing places, the latest post on top in the UI
        loading: false
      };
    case "UPDATE_POST":
      return {
        ...state,
        post: {
          // ...state.post,
          postData: payload,
          postComments: [...state.post.postComments],
          postLikes: [...state.post.postLikes],
          loading: false
        },
      };
    case "CLEAR_POST":
      return {
        ...state,
        post: null,
        loading: false
      };

    case "CLEAR_FEED_POSTS":
      return {
        ...state,
        posts: null
      }
    case "LIKE_POST": 
      return {
        ...state,
        post: {
          ...state.post,
          post: {
            ...state.post.post,
            likes: payload
          },
          loading: false
        },
      };
    case "UNLIKE_POST": 
      return {
        ...state,
        post: {
          ...state.post,
          post: {
            ...state.post.post,
            likes: payload
          },
          loading: false
        },
      };
    // case "LIKE_COMMENT":
    //   let commentId = payload.commentId;
    //   let updatedCommentLikes;
    //   updatedCommentLikes = state.post.post.comments.map((comment, i) => {
    //     if (comment._id === commentId) {
    //       // updatedCommentLikes = state.post.post.comments[i].likes.unshift({ user: req.user.id });
    //       //*** updatedCommentLikes = state.post.post.comments[i].likes = payload.commentLikes;
    //       state.post.post.comments[i].likes.unshift({ user: payload.commentLikes });
    //     };
    //   });
    //   return {
    //     ...state,
    //     post: {
    //       post: {
    //         ...state.post.post,
    //         comments: [...state.post.post.comments, updatedCommentLikes]
    //         // comments: updatedCommentLikes -
    //         // comments: [payload] -
    //         // update obj in arr
    //       }
    //     },
    //     loading: false
    //   };
    case "LIKE_COMMENT":
      let commentId = payload.commentId;
      let updatedCommentLikes;
      state.post.post.comments.map((comment, i) => {
        if (comment._id === commentId) {
          // updatedCommentLikes = state.post.post.comments[i].likes.unshift({ user: payload.commentLikes });
          state.post.post.comments[i].likes.unshift(payload.commentLikes);
        };
      });

      return {
        ...state,
        post: {
          ...state.post,
          loading: false
        },
      };
      // const index = state.post.post.comments.findIndex(comment => comment._id === payload.commentId);
      // state.post.post.comments[index].likes.unshift({ user: payload.commentLikes });
      // return {
      //   ...state,
      //   loading: false
      // };
    case "UNLIKE_COMMENT":
      const index = state.post.post.comments.findIndex(comment => comment._id === payload.commentId);
      const likeRemoved = state.post.post.comments[index].likes.filter(
        like => like.user !== payload.userId
      );
      state.post.post.comments[index].likes = likeRemoved;
      return {
        ...state,
        post: {
          ...state.post,
          loading: false
        },
      };
    case "CREATE_COMMENT": 
      return {
        ...state,
        post: {
          ...state.post,
          post: {
            ...state.post.post,
            comments: [payload, ...state.post.post.comments],
            loading: false
          }
        },
      };
    case "UPDATE_COMMENT":
      // state.post.post.comments.map(comment => comment._id === payload.comment._id ? comment = payload.updatedPostComment : comment);
      // state.post.post.comments.map(comment => comment._id === payload._id ? comment = payload : comment);
      let postComments = state.post.post.comments.map(comment => comment._id === payload._id ? comment = payload : comment);
      return {
        ...state,
        post: {
          ...state.post,
          post: {
            ...state.post.post,
            comments: postComments
          },
          loading: false
        },
      };

    case "DELETE_COMMENT":
      // const commentRemoved = state.post.post.comments.filter(comment => comment.id !== payload.commentId);
      const commentRemoved = state.post.post.comments.filter(comment => comment._id !== payload);
      // state.post.post.comments = commentRemoved;
      return {
       ...state,
       post: {
         ...state.post,
         post: {
           ...state.post.post,
           comments: commentRemoved
         },
          loading: false
       },
      };
    case "DELETE_FEED_POST":
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== payload),
        loading: false
      };
    case "DELETE_POST":
      return {
        ...state,
        loading: false
      };
    case "POST_ERROR":
      return {
        ...state,
        error: payload,
        loading: false
      };
    case "LIKE_ERROR":
      return {
        ...state,
        error: payload,
        loading: false
      };
    case "COMMENT_ERROR":
      return {
        ...state,
        error: payload,
        loading: false
      };
    default: 
      return state;
  }
};


/*
let userId = 1;
let currId = 3;
let arr1 = {
  comments: [
    {
      id: "c1",
      userId: "u1",
      likes: [
        {
          id: "c1",
          user: "u1"
        },
        {
          id: "c1",
          user: "u2"
        }
      ]
    },
    {
      id: "c2",
      userId: "u1",
      likes: [
        {
          id: "c2",
          user: "u1"
        },
        {
          id: "c2",
          user: "u2"
        }
      ]
    }
  ]
}
*/