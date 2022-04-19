import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useAppContext } from 'context/Store';
import { toast } from "react-toastify";
import { ControlGroup, ControlGroupFileUpload } from "../../../components/UI/FormControlGroup";
import { createUpdatePostForm } from "@/utils/formDataServices";
import Editor from "../../../components/editor/Editor";
import Spinner from "../../../components/Spinner";
import api from "@/utils/api";
import { FaUpload } from 'react-icons/fa';

/*
postData: {
    _id: '61998119ba44de7f62ede84e',
    user: '61994fe0ba44de7f62ede832',
    username: 'wolftwengu1',
    avatarImage: 'https://res.cloudinary.com/dhvryypso/image/upload/v1637437410/
blog/wfwtclu5bom2i6mqahe1.gif',
    coverImage: '',
    coverImageFilename: '',
    title: 'Title of example post 03',
    text: 'Text of example post 03',
    category: 'art',
    tags: [ 'digital paint, scrap booking, watercolour' ],
    likes: [],
    comments: [],
    createdAt: '2021-11-20T23:13:29.361Z',
    updatedAt: '2021-11-20T23:13:29.361Z',
    __v: 0
  }
*/
const BlogForm = ({ blogData, token }) => {
  console.log("blogData")
  console.log(blogData)
  console.log("front end token")
  console.log(token)
  if (blogData) {
    console.log("parsed - blogData.text")
    let parsed = JSON.parse(blogData.text)
    console.log(parsed)
  }
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageData, setImageData] = useState(null);
  const [showImageData, isShowImageData] = useState(false);
  const [formData, setFormData] = useState({
    // username: ,
    // avatarImage: ,
    image_url: "",
    title: blogData.title || "",
    text: blogData.text || "",
    category: blogData.category || "",
    tags: blogData.tags || []
  });
  let [editorInstance, setEditorInstance] = useState({});

  const {title, text, category, tags} = formData;

  useEffect(() => {
    if (!token) {
      console.log("useeffect, logging out")
      dispatch({type: "LOGOUT"});
      Cookies.remove("blog__isLoggedIn");
      Cookies.remove("blog__userInfo");
      return router.push("/");
    }
    setIsLoading(false);
    // if (!auth.isAuthenticated || auth.user.role !== 'user') return router.push("/");
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formData")
    console.log(formData)
  };

  const handleImageChange = (e) => {
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);

    setFormData({
      ...formData,
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

  const handleInstance = (instance) => {
    setEditorInstance(instance)
  }

  const submitBlogHandler = async (e) => {
    e.preventDefault();
    let formText = await editorInstance.save();
    formData.text = JSON.stringify(formText);
    setIsLoading(true);
    if (formData.text?.blocks?.length === 0 || Object.keys(formData.text).length === 0) {
      let textObj = Object.keys(formData.text).length;
      console.log("textObj")
      console.log(textObj)
      console.log("formData - submission")
      console.log("editorinstance failed to be saved")
      console.log(formData);
      setIsLoading(false);
      return;
    };
    if (blogData) {
      try {
        console.log("update")
        console.log(formData);
        let servicedData = await createUpdatePostForm(formData);
        console.log("servicedData - user update")
        console.log(servicedData)
        let res = await api.put(`/post/${blogData._id}`, servicedData);
        // dispatch({ type: "UPDATE_USER_INFO", payload: res.data.data.updateUserInfo });
        if (res) toast.success("Submission successful.")
        // setIsLoading(false);
        router.push("/");
      } catch (err) {
        console.log("errors")
        console.log(err)
        toast.error("Error: Auth token expired.")
        setIsLoading(false);
      }
    } else {
      console.log("create")
      console.log(formData);
      try {
        let servicedData = await createUpdatePostForm(formData);
        let res = await api.post("/post/create", servicedData);
        // setIsLoading(false);
        router.push("/");
      } catch (err) {
        const errors = err.response.data.errors;
        // if (errors) {
        //   errors.forEach(error => toast.error(error.msg));
        // }
        toast.error("Error: Auth token expired.")
        setIsLoading(false);
      }
    };
  };

  const onSaveHandler = (textValue) => {
    console.log("saving info")
    console.log(textValue);
    // formData.text = textValue;
    setIsLoading(true);
    // setFormData({...formData, text: textValue})
    console.log("updTE/CREATE - pafe = formData")
    console.log(formData)
    if (formData.text) submitBlogHandler(e)
  };
  const deleteModalHandler = () => {
    console.log("opening delete modal")
  };
  const onDeleteHandler = () => {
    console.log("deleting blog... please wait...")
  };

  return isLoading ? (
    <Spinner />
  ) : (<>
    <div className="blog">
      <section className="blogForm__section">
        <div className="blogForm__form-header">
          <h2>{blogData ? 'Update' : 'Create'} Blog Post</h2>
        </div>



        {blogData && blogData.coverImage && (
          <div className="blog__image">
            <Image
              className={"blog__img"}
              src={blogData.coverImage}
              fill="layout"
              alt="user avatar"
              // width={500}
              // height={250}
              layout="fill"
            />
          </div>
        )}

        {/* {blogData && blogData.coverImage && (
          <Image
            src={blogData.coverImage}
            fill="layout"
            alt="user avatar"
            width={500}
            height={250}
            // layout="fill"
          />
        )} */}
        <div className="blogForm__content">
          <p>Submit form to create blog post.</p>
          <div className="blogForm__form-container">
            <form className="blogForm__form" onSubmit={submitBlogHandler}>
              <ControlGroupFileUpload
                action={handleImageChange}
                icon={<FaUpload size={"25"} />}
              />
              <ControlGroup
                name={"title"}
                type={"text"}
                placeholder={"Title of Blog"}
                id={"login-name"}
                className={"fui-user"}
                onChange={onChange}
                value={title}
                required={false}
              />
              {/* <ControlGroupTextField
                name={"text"}
                type={"text"}
                placeholder={"Write here."}
                id={"login-name"}
                className={"fui-user"}
                onChange={onChange}
                value={text}
                required={false}
              /> */}
              <select name="category" className="feed__category-select" value={category} onChange={e => onChange(e)} required>
                <option value="">Select Category</option>
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
              <div className="">
                <p>Apply relevant tags to your blog to help users find it.</p>
              </div>
              <ControlGroup
                name={"tags"}
                type={"text"}
                placeholder={"Seperate tags, by comma"}
                id={"login-name"}
                className={"fui-user"}
                onChange={onChange}
                value={tags}
                required={false}
              />
              {/* <button className="feed__submit" type="submit">
                Submit
              </button> */}
            {/* </form> */}
              {Editor && (
                <Editor
                  data={text}
                  handleInstance={handleInstance}
                  updateValue={blogData ? true : false}
                  // currentValue={text}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onSave={(blogText) => onSaveHandler(blogText)}
                  // value={text}
                  // onDelete={() => onDeleteHandler()}
                  onDelete={deleteModalHandler}
                />
              )}
              <div className="editor__btns-container">
                <div className="save">
                  {fileTypeError || fileSizeError ? (
                    <div className="form__error">
                      File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
                    </div>
                  ) : (
                    <button className="btn btn-secondary" type="submit">
                      {isLoading ? "Submitted" : blogData ? 'Update' : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  </>);
};
export default BlogForm;
export const getServerSideProps = async (context) => {
  try {
    let post_id;
    let initPostInfo = '';
    let token = context.req.cookies.blog__token;

    if (context.query.slug[0] !== 'create') {
      post_id = context.query.slug[1];

      initPostInfo = await api.get(`/post/${post_id}`,
      { headers: context.req ? { cookie: context.req.headers.cookie } : undefined}
      );
    }
    return {
      props: {
        blogData: initPostInfo ? initPostInfo.data.data.postData : '',
        token: token
      }
    }
  } catch (err) {
    return {
      props: {
        blogData: '',
        token: ''
      }
    }
  }
};