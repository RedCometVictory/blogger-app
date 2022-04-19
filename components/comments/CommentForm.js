import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { useAppContext } from 'context/Store';
import api from "@/utils/api";

const initialState = { text: '' }

const CommentForm = ({prodId}) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  const { isAuthenticated, user } = auth;
  const [commentForm, setCommentForm] = useState(false);
  const [commentFormData, setCommentFormData] = useState(initialState);

  const { text } = commentFormData;

  const onChangeHandler = (e) => {
    setCommentFormData({ ...commentFormData, [e.target.name]: e.target.value });
  };
  
  const submitCommentHandler = async (e) => {
    e.preventDefault();
    try {
      let text = commentFormData.text;
      
      let res = await api.post(`/post/comment/${post.post._id}`, {text});
      if (res) {
        dispatch({type: "CREATE_COMMENT", payload: res.data.data.comment[0]})

        setCommentFormData({ text: '' });
        setCommentForm(false);
      } else {
        console.log("new post comment failure")
        router.push("/")
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create comment.")
      if (!Cookies.get("blog__isLoggedIn")) router.push("/")
    }
  };

  let classes = "comments__form-collapse right-comp btn btn-secondary";
  let classesShow = commentForm ? classes += " active" : "";

  return (
    <section className="comment__section">
      <div className="comment__header section-title">
        <h2>Comments</h2>
        <div className="comment__left-comp">
          {!isAuthenticated ? (
            <div className="comment__form-collapse" onClick={() => setCommentForm(true)}>
              <Link className="" href={"/login"}>Sign In to Comment</Link>
            </div>
          ) : !commentForm ? (
            <div className="comment__form-collapse" onClick={() => setCommentForm(true)}>
              <div className="">Add Comment</div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {commentForm && (
        <form id='comment-form' className="comment__form" onSubmit={submitCommentHandler}>
          <div className="comment__form-options">
            <button className="btn btn-secondary" type="submit">Submit</button>
            <button className={classes} onClick={() => setCommentForm(false)}>
              <div className="">Cancel</div>
            </button>
          </div>
          <div className="comment__form-group">
            <textarea
              className="form-textarea"
              name="text"
              placeholder="Comment here."
              onChange={e => onChangeHandler(e)}
              value={text}
              cols="30" rows="5"
              maxLength={420}
              aria-required="true" 
              required="true"
            ></textarea>
          </div>
        </form>
      )}
      <hr />
    </section>
  )
};
export default CommentForm;