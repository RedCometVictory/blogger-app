import { useState } from 'react';
import { useAppContext } from 'context/Store';
import { FaUpload } from 'react-icons/fa';
import { toast } from "react-toastify";
import api from "@/utils/api";
import { updateUserForm } from '@/utils/formDataServices';
import { ControlGroup, ControlGroupFileUpload } from '../UI/FormControlGroup';

const ProfileUserForm = ({setUserForm}) => {
  const { state, dispatch } = useAppContext();
  const { auth } = state;
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [userData, setUserData] = useState({
    firstName: auth.user.firstName || "",
    lastName: auth.user.lastName || "",
    username: auth.user.username || "",
    email: auth.user.email || "",
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showImageData, isShowImageData] = useState(false);

  const { firstName, lastName, username, email } = userData;

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);

    setUserData({
      ...userData,
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

  const submitUserUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let servicedData = await updateUserForm(userData);
      let res = await api.put("/user/edit", servicedData);
      dispatch({ type: "UPDATE_USER_INFO", payload: res.data.data.updateUserInfo });
      setUploading(false);
      setUserForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit profile update.");
      setUserForm(false);
      setUploading(false);
    }
  };

  return (
    <section className="profile__form-wrapper">
      <div className="">
        <p className="profile__form-text">Edit user information. Avatar image can be added / changed here.</p>
        <form className="profile__form" onSubmit={submitUserUpdate}>
          <div className="profile__set 01">
            <ControlGroup
              name={"firstName"}
              type={"text"}
              placeholder={"First Name"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChange}
              value={firstName}
              required={false}
            />
            <ControlGroup
              name={"lastName"}
              type={"text"}
              placeholder={"Last Name"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChange}
              value={lastName}
              required={false}
            />
            <ControlGroup
              name={"email"}
              type={"text"}
              placeholder={"myemail@email.com"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChange}
              value={email}
              required={false}
            />
            <ControlGroup
              name={"username"}
              type={"text"}
              placeholder={"username"}
              id={"login-name"}
              className={"fui-user"}
              onChange={onChange}
              value={username}
              required={false}
            />
          </div>
          <div className="profile__set 02">
            <h4>Avatar: </h4>
            <ControlGroupFileUpload
              action={handleAvatarChange}
              icon={<FaUpload size={"25"} />}
            />
          </div>
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
          <div className="confirmForm__section">
            {fileTypeError || fileSizeError ? (
              <div className="confirmForm__error">
                File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
              </div>
            ) : uploading ? (
              <div className="confirmForm__submit-update">
                <input className="btn-full-width admForm__submit" value="Submitting Info..." readOnly/>
              </div>
            ) : (
              <div className="confirmForm__submit-update">
                <input type="submit" className="btn btn-primary btn-full-width" value="Submit" />
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
export default ProfileUserForm;
              