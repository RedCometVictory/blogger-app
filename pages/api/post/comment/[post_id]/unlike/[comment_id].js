import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

export const config = {
  api: {
    // bodyParser: false,
    bodyParser: true,
  },
};

// /api/post/comment/[post_id]/unlike/[comment_id].js
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
// *** insomnia tested - passed
handler.put(async (req, res) => {
  const { post_id, comment_id } = req.query;
  await db.connectToDB();
  const post = await Post.findById(post_id);
  // search through all post comments for matching comment id and check if comment is already lieked
  for(let i = 0; i < post.comments.length; i++) {
    if (post.comments[i]._id === comment_id) {
      if (!post.comments[i].likes.some((like) => like.user.toString() == req.user.id)) {
        return res.status(403).json({ errors: [{ msg: "Post comment is not yet been liked." }] });
      }
    };
  };

  let matchedCommentId;
  let matchedCommentLikes;
  for(let i = 0; i < post.comments.length; i++) {
    // remove the like
    if (post.comments[i]._id === comment_id) {
      matchedCommentId = post.comments[i]._id;
      post.comments[i].likes = post.comments[i].likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
      matchedCommentLikes = post.comments[i].likes;
    };
  };
  await post.save();
  await db.disconnect();

  res.status(201).json({
    status: "Post unliked.",
    data: {
      commentId: matchedCommentId,
      commentLikes: matchedCommentLikes
    }
  });
});
export default handler;