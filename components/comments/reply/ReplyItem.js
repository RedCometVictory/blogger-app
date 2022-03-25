import { useState } from 'react';
import Image from "next/image";
import api from "@/utils/api";
import { useAppContext } from 'context/Store';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegWindowClose } from "react-icons/fa";

const ReplyItem = ({reply}) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
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
    let text = replyEditFormData.text;

    let res = await api.put(`/post/comment/${post.post._id}/update/${reply._id}`, {text});

    dispatch({type: "UPDATE_COMMENT", payload: res.data.data.comment})
    // setEditFormData({ text: '' });
    showReplyForm(false);
  };

  const replyFormHandler = (value) => {
    showReplyForm(value);
  };

  const deleteReplyHandler = async (id) => {
    await api.delete(`/post/comment/${post.post._id}/delete/${id}`);
    dispatch({type: "DELETE_COMMENT", payload: id})
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
              fill="layout"
              alt="user avatar"
              // width={500}
              // height={250}
              layout="fill"
              // image is stretched, apply custom css to fix
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
              {!replyForm && !setConfirmReplyDelete && auth.user._id === reply.user && (<>
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
                // className="form-input"
                className="form-textarea"
                name="text"
                placeholder="Edit reply here."
                onChange={e => onReplyEditChangeHandler(e)}
                value={text}
                cols="30" rows="5"
                maxLength={420}
                aria-required="true" 
                required="true"
              ></textarea>
            </div>
          </form>
        ) : (<>
          <div className="comment__reply" key={reply._id}>
            {reply.text}
          </div>
          <div className="comment__options">
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
        </>)}
      </div>
    </div>
  );
};
export default ReplyItem;