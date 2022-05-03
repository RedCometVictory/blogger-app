import { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import api from "@/utils/api";
import Cookies from "js-cookie";
import { useAppContext } from 'context/Store';
import { toast } from "react-toastify";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegWindowClose } from "react-icons/fa";

const ReplyItem = ({reply}) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  const [replyForm, showReplyForm] = useState(false);
  const [setConfirmReplyDelete, isSetConfirmReplyDelete] = useState(false);
  const [replyEditFormData, setReplyEditFormData] = useState({
    text: reply.text || ""
  });

  const { text } = replyEditFormData;

  const onReplyEditChangeHandler = (e) => {
    setReplyEditFormData({ ...replyEditFormData, [e.target.name]: e.target.value });
  };

  const submitReplyEditHandler = async (e) => {
    e.preventDefault();
    try {
      let text = replyEditFormData.text;
      let res = await api.put(`/post/comment/${post.post._id}/update/${reply._id}`, {text});
  
      if (res) {
        dispatch({type: "UPDATE_COMMENT", payload: res.data.data.comment});
        showReplyForm(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit reply edit.");
    }
  };
  
  const replyFormHandler = (value) => {
    showReplyForm(value);
  };
  
  const deleteReplyHandler = async (id) => {
    try {
      await api.delete(`/post/comment/${post.post._id}/delete/${id}`);
      dispatch({type: "DELETE_COMMENT", payload: id});
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete reply.");
    }
  };
  
  const likeHandler = async (id) => {
    try {
      let parentCommentId = reply.parentCommentId;
      let res = await api.post(`/post/comment/${post.post._id}/like/${id}?parentCommentId=${parentCommentId}`);

      if (res) {
        dispatch({type: "LIKE_COMMENT", payload: {commentId: res.data.data.commentId, commentLikes: res.data.data.commentLikes}});
        toast.success("Post reply liked!");
      } else {
        toast.error("Failed to like reply.");
      }
    } catch (err) {
      toast.error("Failed to like post reply.")
      if (!Cookies.get("blog__isLoggedIn")) router.push("/");
    }
  };
  
  const unLikeHandler = async (id) => {
    try {
      let res = await api.put(`/post/comment/${post.post._id}/unlike/${id}`);
      if (res) {
        dispatch({type: "UNLIKE_COMMENT", payload: {commentId: res.data.data.commentId, commentLikes: res.data.data.commentLikes, userId: auth?.user?._id}});

        toast.success("Post reply unliked!");
      } else {
        toast.error("Failed to unlike reply.");  
      }
    } catch (err) {
      toast.error("Failed to unlike post reply.");
      if (!Cookies.get("blog__isLoggedIn")) router.push("/");
    }
  };

  let classes = "comments__form-collapse right-comp btn btn-secondary";
  let classesShow = replyForm ? classes += " active" : "";

  return (
    <div className="comment__reply-item">
      <div className="comment__reply-header">
        {reply.avatarImage && (
          <div className="comment__image-avatar avatar">
            <Image
              className={"comment__img"}
              src={reply.avatarImage}
              alt="user avatar"
              layout="fill"
              // image stretched, apply custom css to fix
            />
          </div>
        )}
      </div>
      <div className="comment__reply-content">
        <div className="comment__username username">
          <div className="">
            {reply.username}
          </div>
            <div className="comment__reply-delete">
              {setConfirmReplyDelete && (
                <div className="comment__delete-confirm">
                  <div>Are you sure?</div>
                  <div className="comment__delete-btns">
                    <button className="btns del-primary" onClick={e => deleteReplyHandler(reply._id)}>Yes</button>
                    <button className="btns del-secondary" onClick={() => isSetConfirmReplyDelete(false)}>No</button>
                  </div>
                </div>
              )}
              {!replyForm && !setConfirmReplyDelete && auth?.user?._id === reply.user && (<>
                <div className="comment__reply-options">
                  <button className="btn btn-secondary reply-edit" onClick={() => replyFormHandler(true)}>
                    Edit
                  </button>
                  <FaRegWindowClose className="reply-delete" onClick={() => isSetConfirmReplyDelete(true)} />
                </div>
              </>)}
          </div>
        </div>
        {replyForm ? (
          <form id='edit-reply-form' className="comment__form edit-reply-form" onSubmit={submitReplyEditHandler}>
            <div className="comment__form-options">
              <button className="btn btn-secondary" type="submit">Submit</button>
              <button className={classes} onClick={() => replyFormHandler(false)}>
                <div className="">Cancel</div>
              </button>
            </div>
            <div className="comment__form-group">
              <textarea
                className="form-textarea"
                name="text"
                placeholder="Edit reply here."
                onChange={e => onReplyEditChangeHandler(e)}
                value={text}
                cols="30" rows="5"
                maxLength={420}
                aria-required="true" 
                required={true}
              ></textarea>
            </div>
          </form>
        ) : (<>
          <div className="comment__reply" key={reply._id}>
            {reply.text}
          </div>
          <div className="comment__options">
            <div className="comment__thumbs">
              <div className="thumb" onClick={() => likeHandler(reply._id)}>
                <FaRegThumbsUp />
              </div>
              <div className="">{reply.likes?.length > 0 ? reply.likes.length : 0}</div>
              <span className='spacer'>|</span>
              <div className="thumb" onClick={() => unLikeHandler(reply._id)}>
                <FaRegThumbsDown />
              </div>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
};
export default ReplyItem;