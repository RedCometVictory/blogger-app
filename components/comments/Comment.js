import CommentItem from "./CommentItem";

const Comment = ({comments}) => {
  const rootComments = comments?.filter(comment => comment.parentCommentId == null);

  const getReplies = (commentId) => {
    let replies = comments?.filter(reply => reply.parentCommentId === commentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return replies;
  };

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