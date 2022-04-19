import Cookies from "js-cookie";
export const followInitialState = {
  // following: [],
  followers: typeof window === "undefined" ? null : localStorage.getItem("blog__follows") ? JSON.parse(localStorage.getItem("blog__follows")) : null,
  loading: true
};
export const FollowReducer = (state = followInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_FOLLOW_STATUS":
      return {
        ...state,
        follow: {
          // following: payload.following,
          followers: payload
        }
      }
    case "FOLLOW_USER":
      return {
        ...state,
        follow: {
          // ...state.follow,
          followers: [...state.follow.followers, payload],
          // following: [...state.follow.following]
        },
        loading: false
      }
    case "UNFOLLOW_USER":
      return {
        ...state,
        follow: {
          followers: [payload]
        },
        loading: false
      }
    default:
      return state;
  }
};