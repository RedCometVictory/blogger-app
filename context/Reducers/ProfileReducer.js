export const profileInitialState = {
  profileData: {},
  profileStats: null, // individual profile
  profilePosts: null,
  profiles: [],
  followingList: null,  // []
  followersList: null, // []
  loading: true,
  error: {}
};

export const ProfileReducer = (state = profileInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_PROFILES": // not used yet
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case "GET_PROFILE": 
      return {
        ...state,
        profile: {
          profileData: payload,
          loading: false
        }
      };
    case "CREATE_PROFILE":
      return {
        ...state,
        profile: {
          profileData: payload,
          loading: false
        }
      }
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: {
          profileData: payload, // data.myUserData
          profileStats: {
            profileDetails: { ...state.profile.myProfileInfo }, // data.myProfileInfo
            profileSocials: { ...state.profile.mySocialsInfo }, // data.mySocialsInfo
            followers: { ...state.profile.profileFollowers },
            following: { ...state.profile.profileFollowing }
          },
          profilePosts: { ...state.profile.profilePosts },
          followingList: null,
          followersList: null,
          loading: false
        }
      }
    case "FOLLOW_PROFILE": // not used yet
      return {
        ...state,
        profileStats: {
          profileDetails: {...state.profileStats.profileDetails},
          profileSocials: {...state.profileStats.profileSocials},
          followers: [...state.profileStats.followers, ...payload.followUser],
          following: [...state.profileStats.following]
        },
        loading: false
      }
    case "UNFOLLOW_PROFILE": // not yet used
      return {
        ...state,
        profileStats: {
          profileDetails: {...state.profileStats.profileDetails},
          profileSocials: {...state.profileStats.profileSocials},
          followers: [...state.profileStats.followers.filter(follow => follow.follower_id !== payload.followUser)],
          following: [...state.profileStats.following]
        },
        loading: false
      }
    case "CLEAR_PROFILE": // not yet used
      return {
        ...state,
        profileData: null,
        profileStats: null,
        profilePosts: null,
      };
    case "ACCOUNT_DELETED":
      return {
        ...state,
        profileData: null,
        profileStats: null,
        profilePosts: null,
        loading: false
      }
    case "FOLLOWERS_PROFILE_LIST": // not used yet
      return {
        ...state,
        followersList: payload.followers,
        loading: false
      };
    case "PROFILE_ERROR":
      return {
        ...state,
        error: payload,
        loading: false
      };
    default: return state;
  }
};