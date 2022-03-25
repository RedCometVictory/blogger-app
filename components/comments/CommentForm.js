import { useEffect, useState } from 'react';
import Link from "next/link";
import { ControlGroup, ControlGroupTextField } from "../../components/UI/FormControlGroup";
import { useAppContext } from 'context/Store';
import api from "@/utils/api";
import { postComment } from "@/utils/formDataServices";

const initialState = { text: '' }

const CommentForm = ({prodId}) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const { isAuthenticated, user } = auth;
  // console.log("*** COMMENT FORM ***")
  // console.log(post.comments)
  
  // const productInfoReviews = useSelector(state => state.product);
  // const { productById } = productInfoReviews;
  const [commentForm, setCommentForm] = useState(false);
  const [commentFormData, setCommentFormData] = useState(initialState);

  const { text } = commentFormData;

  // let userId = userInfo ? userInfo.id : '';
  // const findUserComment = (id) => {
  //   let listedComments = productById.productReviews;
  //   let userComment = listedComments.filter(comment => comment.user === user._id);
  //   if (userComment.length > 0) {
  //     let comment = userComment[0].user_id;
  //     return comment;
  //   }
  //   return '';
  // };

  // let userCommentExists = findUserComment(user._id);
  const onChangeHandler = (e) => {
    setCommentFormData({ ...commentFormData, [e.target.name]: e.target.value });
  };
  
  const submitCommentHandler = async (e) => {
    e.preventDefault();
    // let text = {...commentFormData};
    // let text = commentFormData;
    // commentFormData = JSON.stringify(commentFormData);
    // let servicedData = await createUpdatePostComment(commentFormData);
    // text = JSON.stringify(text)
    // let servicedData = postComment(commentFormData);
    let text = commentFormData.text;
    // text = JSON.stringify(text);
    let servicedData = await postComment(commentFormData);
    // let servicedData = await postComment(text);
    // text = JSON.stringify(text)
    console.log("post._id")
    console.log(post.post._id)
    console.log("*** text ***")
    console.log(text)
    console.log("*** commentFormData ***")
    console.log(commentFormData)
    console.log("*** servicedData ***")
    console.log(servicedData)


    let res = await api.post(`/post/comment/${post.post._id}`, {text})
    // let res = await api.post(`/post/comment/${post.post._id}`, servicedData)
    // let res = await api.post(`/post/comment/${post.post._id}`, servicedData);
    // let res = await api.post(`/post/comment/${post.post._id}`, {commentFormData})
    // let res = await api.post(`/post/comment/${post.post._id}`, commentFormData)

    console.log("*** res ***")
    console.log(res.data.data)
    // dispatch(createProductReview(prodId, formData));
    dispatch({type: "CREATE_COMMENT", payload: res.data.data.comment[0]})
    setCommentFormData({ text: '' });
    setCommentForm(false);
  };

  let classes = "comments__form-collapse right-comp btn btn-secondary";
  let classesShow = commentForm ? classes += " active" : "";

  // ) : !commentForm && userId !== userCommentExist (
  // {/* : commentForm && userId !== userCommentExists ? (
  //   <div className="comment__form-collapse form-submit">
  //     <input type="submit" form="comment-form" value="Submit" />
  //   </div>
  // ) : (
  //   <div className="comment__form-collapse form-submit transparent">
  //     <></>
  //   </div>
  // ) */}
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
              // className="form-input"
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