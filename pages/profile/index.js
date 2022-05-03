import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppContext, logoutUser } from "context/Store";
import api from "@/utils/api";
import Cookies from "js-cookie";
import ProfileField from "components/profile/profileField";
import Image from "next/image";
import { toast } from "react-toastify";
import ProfileHeader from "components/profile/profileHeader";
import ProfileUserFrom from "components/profile/profileUserForm";
import ProfileForm from "components/profile/profileForm"
import Spinner from "components/Spinner";

const Profile = ({initProfile, token}) => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const { auth, profile } = state;
  const [userForm, setUserForm] = useState(false);
  const [profileForm, setProfileForm] = useState(false);
  const [setConfirmDelete, isSetConfirmDelete] = useState(false);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !Cookies.get("blog__isLoggedIn")) {
      dispatch({type: "LOGOUT"});
      logoutUser();
      return router.push("/");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    dispatch({type: "GET_PROFILE", payload: initProfile})
  }, []);
  
  const updateUserHandler = () => {
    if (profileForm) setProfileForm(false);
    setUserForm(true);
  };
  
  const profileHandler = () => {
    if (userForm) setUserForm(false);
    setProfileForm(true);
  };

  const cancelHandler = () => {
    setProfileForm(false);
    setUserForm(false);
  };

  const onDeleteHandler = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/user/delete-account/${auth?.user?._id}`);
      toast.success("Deleted account!");
      dispatch({type: "LOGOUT"});
      logoutUser();
      return router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
      setIsLoading(false);
    }
  };

  const DeleteModal = () => {
    return (
      <div className="blog__delete-modal">
        <div className="comment__btns">
          <div className="comment__delete-confirm">
            <div>Delete post? Are you sure?</div>
            <div className="comment__delete-btns">
              <button className="btns del-primary" onClick={e => onDeleteHandler(auth?.user?._id)}>Yes</button>
              <button className="btns del-secondary" onClick={() => isSetConfirmDelete(false)}>No</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return isLoading ? (
    <Spinner />
  ) : (<>
    {setConfirmDelete && (
      <DeleteModal />
    )}
    <div className="profile">
      <div className="profile__center">
        <div className="profile__container">
          <div className="profile__container-bg"></div>
          <div className="profile__center-content">
            <div className="profile__user-avatar">
              {auth?.user?.avatarImage && (
                <Image
                  className="profile__avatar-img"
                  src={auth?.user?.avatarImage}
                  alt="user avatar"
                  layout="fill"
                />
              )}
            </div>
            <ProfileHeader />
            <div className="profile__option-btns">
              {userForm ? (
                <button className="btn btn-secondary profile__editProfileContent" onClick={cancelHandler}>Cancel</button>
              ) : (
                <button className="btn btn-secondary profile__editProfileContent" onClick={updateUserHandler}>Update User</button>
              )}
              {profileForm ? (
                <button className="btn btn-secondary profile__editProfileContent" onClick={cancelHandler}>Cancel</button>
              ) : Object.keys(state.profile.profileData).length === 0 && Object.keys(initProfile).length === 0 ? (
                <button className="btn btn-secondary profile__editProfileContent" onClick={profileHandler}>Create Profile</button>
              ) : (
                <button className="btn btn-secondary profile__editProfileContent" onClick={profileHandler}>Update Profile</button>
              )}
            </div>
            {!profileForm && !userForm && (<>
              <ProfileField label={"Username"} value={auth?.user?.username} />
              <ProfileField
                label={"Location"}
                value={profile?.profileData.location || "Optional"}
              />
              <ProfileField
                label={"Bio"}
                value={profile?.profileData.bio || "No bio available."}
              />
            </>)}
            {auth?.isAuthenticated && auth?.user?._id === profile?.profileData?.user && (
              <div className="profile__delete">
                <button className="btn btn-secondary" onClick={() => isSetConfirmDelete(true)}>Delete Account</button>
              </div>
            )}
            {userForm && (
              <ProfileUserFrom setUserForm={setUserForm} />
            )}
            {profileForm && (
              <ProfileForm initProfile={initProfile} setProfileForm={setProfileForm} />
            )}
          </div>
        </div>
      </div>
    </div>
  </>);
};
export default Profile;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.blog__token;

    const initProfileData = await api.get('/user/my-profile',
    { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
    );
    return {
      props: {
        initProfile: initProfileData.data.data.profile,
        token: token
      }
    }
  } catch (err) {
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
      props: {},
    };
    // return {
    //   props: { initProfile: [], token: "" }
    // }
  }
};