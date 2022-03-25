import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from "@/utils/api";
import { useAppContext } from 'context/Store';
import { FaCaretUp, FaCaretDown, FaRegThumbsUp, FaRegThumbsDown, FaRegWindowClose } from "react-icons/fa";
import ReplyItem from './reply/ReplyItem';
import { postComment } from "@/utils/formDataServices";

// const CommentItem = ({ comment }) => {
const CommentItem = ({ comment, replies }) => {
  // console.log("comment - begin of page")
  // console.log(comment)
  console.log("replies - begin of page")
  console.log(replies)
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  const [editForm, showEditForm] = useState(false);
  // const [replies, setReplies] = useState([]);
  const [showReplies, isShowReplies] = useState(false);
  const [replyForm, showReplyForm] = useState(false);
  const [setConfirmDelete, isSetConfirmDelete] = useState(false);
  // const [editFormData, setEditFormData] = useState({title: `${review.title}`, description: `${review.description}`});
  // const [editFormData, setEditFormData] = useState({text: `${post.post.comment.text}`});
  const [editFormData, setEditFormData] = useState({
    text: comment.text || ""
  });
  const [replyFormData, setReplyFormData] = useState({
    reply: ""
  });
  /*
    useEffect(() => {
    comments?.filter(totalComment => totalComment.parentCommentId === commentId)
    console.log("reloading replies")
    let replies = post.post.comments?.filter(reply => reply.parentCommentId === comment._id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return replies;
  */
  
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
    await api.delete(`/post/comment/${post.post._id}/delete/${comment._id}`);
    dispatch({type: "DELETE_COMMENT", payload: id})
  };

  const submitEditHandler = async (e) => {
    e.preventDefault();
    let text = editFormData.text;

    let res = await api.put(`/post/comment/${post.post._id}/update/${comment._id}`, {text});

    dispatch({type: "UPDATE_COMMENT", payload: res.data.data.comment})
    // setEditFormData({ text: '' });
    showEditForm(false);
  };

  const submitReplyHandler = async (e) => {
    e.preventDefault();
    let text = replyFormData.reply;

    let res = await api.post(`/post/comment/${post.post._id}/reply/${comment._id}`, {text});

    // dispatch({type: "UPDATE_COMMENT", payload: res.data.data.comment})
    dispatch({type: "CREATE_COMMENT", payload: res.data.data.comment[0]})
    setReplyFormData({ reply: '' });
    showReplyForm(false);
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
            {!editForm && !setConfirmDelete && auth.user._id === comment.user && (<>
              <button className="btn btn-secondary edit" onClick={() => editFormHandler(true)}>
                Edit
              </button>
              <button className="comment__delete del" onClick={() => isSetConfirmDelete(true)}>X</button>
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
                <div className="thumb">
                  <FaRegThumbsUp />
                </div>
                <div className="">0</div>
                <span className='spacer'>|</span>
                <div className="thumb">
                  <FaRegThumbsDown />
                </div>
                <div className="">0</div>
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

        /* {!setConfirmDelete && userInfo && userInfo.id === review.user_id && (
            <>
            <div className="comment__edit" onClick={() => editFormHandler()}>
              {!editForm ? (
                <>Edit Comment</>
              ) : (
                <>Cancel</>
              )}
            </div>
            <div className="">
              <button className="comment__delete" onClick={() => isSetConfirmDelete(true)}>X</button>
            </div>
            </>
          )} */
          // <button className="btn btn-secondary" onClick={() => editFormHandler()}>
          //   {!editForm ? (
          //     <>Edit</>
          //   ) : (
          //     <></>
          //   )}
          // </button>

/*
comment obj:
​
_id: "b09d12e1-66be-49ff-85b2-90f632724084"
​
avatarImage: "https://res.cloudinary.com/dhvryypso/image/upload/v1636353979/blog/Default-welcomer_fhdikf.png"
​
text: "10\nik"
​
user: "620fd9908f14a9af7c1eb7ca"
​
username: "red112"
​
<prototype>: Object { … }
CommentItem.js:7:10

*/