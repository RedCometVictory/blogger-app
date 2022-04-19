import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

export const config = {
  api: {
    bodyParser: false,
    // bodyParser: true,
  },
};

// /api/post/comment/[post_id].js
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
// /api/post/unlike/[post_id]
// update Post
// *** insomnia tested - passed
handler.post(async (req, res) => {
  // console.log("###req.query###")
  // console.log(req.query)
  // const { id } = req.user;
  const { post_id } = req.query;
  // console.log("req.user")
  // console.log(req.user)

  await db.connectToDB();
  const post = await Post.findById(post_id);

  // console.log("post")
  // console.log(post)
  
  if (post.likes.some((like) => like.user.toString() === req.user.id)) {
    return res.status(403).json({ errors: [{ msg: "Post is already liked." }] });
  }

  // add the like
  post.likes.unshift({ user: req.user.id });

  await post.save();
  await db.disconnect();

  // console.log("likes")
  // console.log(post.likes)

  res.status(201).json({
    status: "Post liked.",
    data: {
      likes: post.likes
    }
  });
});
export default handler;