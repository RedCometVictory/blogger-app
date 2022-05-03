import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { logoutUser, useAppContext } from 'context/Store';
import { toast } from "react-toastify";
import { ControlGroup, ControlGroupFileUpload } from "../../../components/UI/FormControlGroup";
import { createUpdatePostForm } from "@/utils/formDataServices";
import Editor from "../../../components/editor/Editor";
import Spinner from "../../../components/Spinner";
import api from "@/utils/api";
import { FaUpload } from 'react-icons/fa';

const BlogForm = ({ blogData, token }) => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageData, setImageData] = useState(null);
  const [showImageData, isShowImageData] = useState(false);
  const [formData, setFormData] = useState({
    image_url: "",
    title: blogData.title || "",
    text: blogData.text || "",
    category: blogData.category || "",
    tags: blogData.tags || []
  });
  let [editorInstance, setEditorInstance] = useState({});

  const {title, text, category, tags} = formData;

  useEffect(() => {
    if (!token || !Cookies.get("blog__isLoggedIn")) {
      dispatch({type: "LOGOUT"});
      logoutUser();
      return router.push("/");
    }
    setIsLoading(false);
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setIsLoading(false);
      return;
    };
    if (blogData) {
      try {
        let servicedData = await createUpdatePostForm(formData);
        let res = await api.put(`/post/${blogData._id}`, servicedData);
        if (res) toast.success("Submission successful.");
        router.push("/");
      } catch (err) {
        console.error(err);
        toast.error("Error: Could not update post.");
        setIsLoading(false);
      }
    } else {
      try {
        let servicedData = await createUpdatePostForm(formData);
        await api.post("/post/create", servicedData);
        router.push("/");
      } catch (err) {
        console.error(err);
        toast.error("Error: Could not create post.");
        setIsLoading(false);
      }
    };
  };

  const onSaveHandler = (textValue) => {
    setIsLoading(true);
    if (formData.text) submitBlogHandler(e)
  };
  const deleteModalHandler = () => {
    console.log("opening delete modal"); // keep for editor
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
              alt="user avatar"
              layout="fill"
            />
          </div>
        )}
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
              {Editor && (
                <Editor
                  data={text}
                  handleInstance={handleInstance}
                  updateValue={blogData ? true : false}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onSave={(blogText) => onSaveHandler(blogText)}
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

    token ? token : null;
    if (!token) {
      return {
        redirect: {
          destination: `/404`,
          permanent: false,
        },
        props: {},
      };
    };
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
    };
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
      props: {},
    };
  }
};