import { useEffect, useState } from "react";
import { useAppContext } from 'context/Store';
import CommentItem from "./CommentItem";

const Comment = ({comments}) => {
  const { state, dispatch } = useAppContext();
  const { auth, post } = state;
  // console.log("comments")
  // console.log(comments)
  // let [totalComments, setTotalComments] = useState([comments]);
  // const [hasMounted, setHasMounted] = useState(false);

  const rootComments = comments?.filter(comment => comment.parentCommentId == null);
  // const rootComments = totalComments.filter(totalComment => totalComment.parentCommentId === null)
  // useEffect(() => {
    // setTotalComments(comments);
    // setHasMounted(true);
  // }, []);

  const getReplies = (commentId) => {
    // totalComments.filter(totalComment => totalComment.parentCommentId === commentId)
    // console.log(commentId)
    // comments?.filter(totalComment => totalComment.parentCommentId === commentId)
    let replies = comments?.filter(reply => reply.parentCommentId === commentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return replies;
  };

  // useEffect(() => {
  //   getReplies()
  // }, [post.post.comments]);

  // if (!hasMounted) {
    // return null;
  // }
  // sort out replies here, into usestate, filter by parent comment id and send as props
  
  return (
    <section className="comments">
      {comments?.length < 1 ? (
        <div className="">No comments.</div>
      ) : (
        <div className="">
          {rootComments?.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={getReplies(comment._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
export default Comment;
// {comments?.filter(comment => comment.parentCommentId == null).map((comment) => (
//   <CommentItem key={comment._id} comment={comment} />
// ))}