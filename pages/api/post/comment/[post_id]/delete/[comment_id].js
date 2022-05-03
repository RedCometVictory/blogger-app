import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

export const config = {
  api: {
    bodyParser: true,
  },
};

// /api/post/comment/[post_id].js
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
// delete post
// *** insomnia tested - passed
handler.delete(async (req, res) => {
  const { post_id, comment_id } = req.query;

  await db.connectToDB();
  const post = await Post.findById(post_id);

  if (!post) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "Unable to find post."}] });
  }

  if (post.user.toString() !== req.user.id) {
    return res.status(401).json({ errors: [{ msg: "User not authorized." }] });
  }
  
  const commentRemoved = post.comments.filter(comment => comment._id !== comment_id);
  post.comments = commentRemoved;

  await post.save();
  await db.disconnect();
  res.status(201).json({
    status: "Post deleted.",
  });
});
export default handler;