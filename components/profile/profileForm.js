import { useEffect, useState } from 'react';
import { useAppContext } from 'context/Store';
import { FaUpload } from 'react-icons/fa';
import { toast } from "react-toastify";
import api from "@/utils/api";
import { createUpdateProfileForm } from '@/utils/formDataServices';
import { ControlGroup, ControlGroupFileUpload } from '../UI/FormControlGroup';

const ProfileForm = ({initProfile, setProfileForm}) => {
  const { state, dispatch } = useAppContext();
  const { auth, profile } = state;
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: profile?.profileData.bio || "",
    location: profile?.profileData.location || "",
    image_url: profile?.profileData.backgroundImage || "",
    theme: profile?.profileData.themes || "",
    website: profile?.profileData?.social?.website || "",
    youtube: profile?.profileData?.social?.youtube || "",
    twitter: profile?.profileData?.social?.twitter || "",
    facebook: profile?.profileData?.social?.facebook || "",
    linkedin: profile?.profileData?.social?.linkedin || "",
    instagram: profile?.profileData?.social?.instagram || "",
    reddit: profile?.profileData?.social?.reddit || "",
    github: profile?.profileData?.social?.github || ""
  });
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showImageData, isShowImageData] = useState(false);

  const { bio, location, theme, website, youtube, facebook, twitter, linkedin, instagram, reddit, github } = profileData;

  useEffect(() => {
    setProfileData({
      bio: profile?.profileData.bio || "",
      location: profile?.profileData.location || "",
      image_url: profile?.profileData.image_url || "",
      theme: profile?.profileData.themes || "",
      website: profile?.profileData?.social?.website || "",
      youtube: profile?.profileData?.social?.youtube || "",
      twitter: profile?.profileData?.social?.twitter || "",
      facebook: profile?.profileData?.social?.facebook || "",
      linkedin: profile?.profileData?.social?.linkedin || "",
      instagram: profile?.profileData?.social?.instagram || "",
      reddit: profile?.profileData?.social?.reddit || "",
      github: profile?.profileData?.social?.github || ""
    })
  }, [state]);

  const onChangeProfile = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);

    setProfileData({
      ...profileData,
      [e.target.name]: e.target.files[0],
    });
    // * set up image preview, if valid
    if (fileToUpload) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageData(reader.result)
        isShowImageData(true);
      });
      reader.readAsDataURL(fileToUpload);
    }
  };

  const checkFileType = (img) => {
    const types = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    if (types.every((type) => img.type !== type)) {
      return setFileTypeError(true);
    }
    return setFileTypeError(false);
  };

  const checkFileSize = (img) => {
    let size = 3 * 1024 * 1024; // size limit 3mb
    if (img.size > size) {
      return setFileSizeError(true);
    }
    return setFileSizeError(false);
  };

  const submitProfileInfo = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let servicedData = await createUpdateProfileForm(profileData);
      let res = await api.post("/user/profile-create", servicedData);
      dispatch({type: "CREATE_PROFILE", payload: res.data.data.profile});
      setUploading(false);
      setProfileForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Error ocurred. Could not submit data.")
      setProfileForm(false);
    }
  };
  
  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let servicedData = await createUpdateProfileForm(profileData);
      let res = await api.put(`/user/edit/${auth?.user._id}`, servicedData);
      dispatch({type: "UPDATE_PROFILE", payload: res.data.data.profile});
      setUploading(false);
      setProfileForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
      setProfileForm(false);
    }
  };

  return (
    <section className="profile__form-wrapper">
      <div className="">
        <p className="profile__form-text">Edit user profile and background image can be added here.</p>
        <form className="profile__form" onSubmit={Object.keys(profile?.profileData).length === 0 ? submitProfileInfo : submitProfileUpdate}>
          <div className="profile__set 01">
            <ControlGroup
              name={"bio"}
              type={"text"}
              placeholder={"Bio"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={bio}
              required={false}
            />
            <ControlGroup
              name={"location"}
              type={"text"}
              placeholder={"Location"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={location}
              required={false}
            />
            <h4>Background Profile Image: </h4>
            <ControlGroupFileUpload
              action={handleImageChange}
              icon={<FaUpload size={"25"} />}
            />
            {imageData && (
              <div className="profile__image-show">
                <div className="btn btn-secondary" onClick={() => isShowImageData(true)}>Show Preview</div>
                <div className="btn btn-secondary" onClick={() => isShowImageData(false)}>Hide Preview</div>
              </div>
            )}
            {imageData && showImageData && (
              <div className="profile__upload-image">
                <img
                  className="profile__upload-img"
                  src={imageData}
                  alt="uploaded avatar or background"
                  // layout="responsive"
                />
            </div>
            )}
          </div>
          <div className="profile__set 02">
            <h3>Socials: </h3>
            <ControlGroup
              name={"website"}
              type={"text"}
              placeholder={"mywebsite.com"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={website}
              required={false}
            />
            <ControlGroup
              name={"youtube"}
              type={"text"}
              placeholder={"youtube.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={youtube}
              required={false}
            />
            <ControlGroup
              name={"facebook"}
              type={"text"}
              placeholder={"facebook.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={facebook}
              required={false}
            />
            <ControlGroup
              name={"twitter"}
              type={"text"}
              placeholder={"twitter.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={twitter}
              required={false}
            />
            <ControlGroup
              name={"linkedin"}
              type={"text"}
              placeholder={"linkedin.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={linkedin}
              required={false}
            />
            <ControlGroup
              name={"instagram"}
              type={"text"}
              placeholder={"instagram.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={instagram}
              required={false}
            />
            <ControlGroup
              name={"reddit"}
              type={"text"}
              placeholder={"reddit.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={reddit}
              required={false}
            />
            <ControlGroup
              name={"github"}
              type={"text"}
              placeholder={"github.com/me"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChangeProfile}
              value={github}
              required={false}
            />
          </div>
          <div className="confirmForm__section">
            {fileTypeError || fileSizeError ? (
              <div className="confirmForm__error">
                File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
              </div>
            ) : uploading ? (
              <div className="confirmForm__submit-update">
                <button className="btn btn-secondary btn-full-width admForm__submit">
                  Submitting Info...
                </button>
              </div>
            ) : (
              <div className="confirmForm__submit-update">
                <input type="submit" className="btn btn-secondary btn-full-width" value="Submit" />
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
export default ProfileForm;