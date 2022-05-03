import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

export const config = {
  api: {
    bodyParser: false,
  },
};

// /api/post/like/[post_id]
// *** insomnia tested - passed
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
handler.post(async (req, res) => {
  const { post_id } = req.query;

  await db.connectToDB();
  const post = await Post.findById(post_id);
  
  if (post.likes.some((like) => like.user.toString() === req.user.id)) {
    return res.status(403).json({ errors: [{ msg: "Post is already liked." }] });
  }
  // add the like
  post.likes.unshift({ user: req.user.id });

  await post.save();
  await db.disconnect();

  res.status(201).json({
    status: "Post liked.",
    data: {
      likes: post.likes
    }
  });
});
export default handler;