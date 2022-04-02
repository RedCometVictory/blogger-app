import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from "@/utils/api";
import { useRouter } from "next/router";
import { useAppContext } from 'context/Store';
import { toast } from "react-toastify";
import { FaCaretUp, FaCaretDown, FaRegThumbsUp, FaRegThumbsDown, FaRegWindowClose } from "react-icons/fa";
import ReplyItem from './reply/ReplyItem';
import { postComment } from "@/utils/formDataServices";
import Cookies from 'js-cookie';

const CommentItem = ({ comment, replies }) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const router = useRouter();
  const [editForm, showEditForm] = useState(false);
  const [showReplies, isShowReplies] = useState(false);
  const [replyForm, showReplyForm] = useState(false);
  const [setConfirmDelete, isSetConfirmDelete] = useState(false);

  const [editFormData, setEditFormData] = useState({
    text: comment.text || ""
  });
  const [replyFormData, setReplyFormData] = useState({
    reply: ""
  });
  
  useEffect(() => {
    if (!Cookies.get("blog__userInfo") || !Cookies.get("blog_isLoggedIn")) {
      router.push("/")
    }
  }, []);
  
  const { text } = editFormData;
  const { reply } = replyFormData;

  const onChangeHandler = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  const onReplyChangeHandler = (e) => {
    setReplyFormData({ ...replyFormData, [e.target.name]: e.target.value });
  };

  const editFormHandler = (value) => {
    showEditForm(value);
  };
  
  const replyFormHandler = (value) => {
    if (!value) setReplyFormData({ reply: '' });
    showReplyForm(value);
  };

  const deleteCommentHandler = async (id) => {
    try {
      await api.delete(`/post/comment/${post.post._id}/delete/${comment._id}`);
      dispatch({type: "DELETE_COMMENT", payload: id})
    } catch (err) {
      console.error(err);
      if (!Cookies.get("blog__isLoggedIn")) router.push("/")
      toast.error("Failed to delete comment.");
    }
  };

  const submitEditHandler = async (e) => {
    e.preventDefault();
    try {
      let text = editFormData.text;
  
      let res = await api.put(`/post/comment/${post.post._id}/update/${comment._id}`, {text});
  
      dispatch({type: "UPDATE_COMMENT", payload: res.data.data.comment})
      // setEditFormData({ text: '' });
      showEditForm(false);
    } catch (err) {
      console.log(err);
      toast.error("Failure to submit reply edit.")
      if (!Cookies.get("blog__isLoggedIn")) router.push("/")
    }
  };

  const submitReplyHandler = async (e) => {
    e.preventDefault();
    try {
      let text = replyFormData.reply;
  
      let res = await api.post(`/post/comment/${post.post._id}/reply/${comment._id}`, {text});
  
      dispatch({type: "CREATE_COMMENT", payload: res.data.data.comment[0]})
      setReplyFormData({ reply: '' });
      showReplyForm(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit reply.")
      if (!Cookies.get("blog__isLoggedIn")) router.push("/")
    }
  };

  const likeHandler = async (id) => {
    try {  
      let res = await api.post(`/post/comment/${post.post._id}/like/${id}`);
      dispatch({type: "LIKE_COMMENT", payload: {commentId: res.data.data.commentId, commentLikes: res.data.data.commentLikes}});
      
      toast.success("Post liked!")
    } catch (err) {
      console.error(err)
      toast.error("Unable to like post.")
      if (!Cookies.get("blog__isLoggedIn")) router.push("/");
      // const errors = err.response.data.errors;
      // if (errors) {
        //   errors.forEach(error => toast.error(error.msg));
        // }
      }
    };
    
    const unLikeHandler = async (id) => {
      try {
        let res = await api.put(`/post/comment/${post.post._id}/unlike/${id}`);
        dispatch({type: "UNLIKE_COMMENT", payload: {commentId: res.data.data.commentId, commentLikes: res.data.data.commentLikes, userId: auth.user._id}});
        toast.success("Post unliked!")
      } catch (err) {
        toast.error("Unable to unlike post.")
        if (!Cookies.get("blog__isLoggedIn")) router.push("/");
      // const errors = err.response.data.errors;
      // if (errors) {
      //   errors.forEach(error => toast.error(error.msg));
      // }
    }
  };
  
  let classes = "comments__form-collapse right-comp btn btn-secondary";
  let classesShow = editForm ? classes += " active" : "";

  return (
    <div className="comment__card">
      <div className="comment__container">
        <div className="comment__header">
          <div className="comment__header-info">
            {comment.avatarImage && (
              <div className="comment__image-avatar avatar">
                <Image
                  className={"comment__img"}
                  src={comment.avatarImage}
                  fill="layout"
                  alt="user avatar"
                  // width={500}
                  // height={250}
                  layout="fill"
                  // image is stretched, apply custom css to fix
                />
              </div>
            )}
            <div className="comment__username">
              {comment.username}
            </div>
          </div>
          <div className="comment__buttons">
            <div className="comment__btns">
              {setConfirmDelete && (
                <div className="comment__delete-confirm">
                  <div>Are you sure?</div>
                  <div className="comment__delete-btns">
                    <button className="btns del-primary" onClick={e => deleteCommentHandler(comment._id)}>Yes</button>
                    <button className="btns del-secondary" onClick={() => isSetConfirmDelete(false)}>No</button>
                  </div>
                </div>
              )}
            </div>
            {!editForm && !setConfirmDelete && auth?.user?._id === comment.user && (<>
              <button className="btn btn-secondary edit" onClick={() => editFormHandler(true)}>
                Edit
              </button>
              <FaRegWindowClose className="reply-delete" onClick={() => isSetConfirmDelete(true)} />
            </>)}
          </div>
        </div>
        {editForm ? (
          <form id='edit-review-form' className="comment__form" onSubmit={submitEditHandler}>
            <div className="comment__form-options">
              <button className="btn btn-secondary" type="submit">Submit</button>
              <button className={classes} onClick={() => editFormHandler(false)}>
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
        ) : (
          <div className="comment__content">
            <div className="comment__text">
              {comment.text}
            </div>
            {replies.length > 0 && (
              <div
                className="comment__reply-btn list" 
                onClick={() => isShowReplies(!showReplies)}>
                {/* onClick={() => showRepliesHandler(true)}> */}
                {showReplies ? 'Hide' : 'Show'} Replies ({replies?.length ? replies.length : 0})
                {" "}
                {showReplies ? (
                  <FaCaretUp />
                ) : (
                  <FaCaretDown />
                )}
              </div>
            )}
            {replies.length > 0 && showReplies && (
              <div className="comment__reply-section">
                {replies.map(reply => (<>
                  <ReplyItem reply={reply}/>
                </>))}
              </div>
            )}
            {replyForm && (
              <form id='edit-review-form' className="comment__form" onSubmit={submitReplyHandler}>
                <div className="comment__form-options">
                  <button className="btn btn-secondary" type="submit">Submit</button>
                  <button className={classes} onClick={() => replyFormHandler(false)}>
                    <div className="">Cancel</div>
                  </button>
                </div>
                <div className="comment__form-group">
                  <textarea
                    // className="form-input"
                    className="form-textarea"
                    name="reply"
                    placeholder="Reply here."
                    onChange={e => onReplyChangeHandler(e)}
                    value={reply}
                    cols="30" rows="5"
                    maxLength={420}
                    aria-required="true" 
                    required="true"
                  ></textarea>
                </div>
              </form>
            )}
            <div className="comment__options">
              <div className="comment__reply-btn">
                <span className="" onClick={() => replyFormHandler(true)}>Reply</span>
              </div>
              <div className="comment__thumbs">
                <div className="thumb" onClick={() => likeHandler(comment._id)}>
                  <FaRegThumbsUp />
                </div>
                <div className="">{comment?.likes?.length > 0 ? comment.likes.length : 0}</div>
                <span className='spacer'>|</span>
                <div className="thumb" onClick={() => unLikeHandler(comment._id)}>
                  <FaRegThumbsDown />
                </div>
                {/* <div className="">0</div> */}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="comment__created-date">
        {comment.created_at}
      </div>
    </div>
  )
}
export default CommentItem;