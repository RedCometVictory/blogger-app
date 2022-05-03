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

handler.post(async (req, res) => {
  // *** convert arrays to strings to make readable client side
  const { id } = req.user;
  const { post_id } = req.query;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ errors: [{ msg: 'Text is required.' }] });
  }
  await db.connectToDB();
  const postData = await Post.findById(post_id);
  
  if(!postData) {
    return res.status(403).json({ errors: [{ msg: "Failed to find post."}] });
  }

  const user = await User.findById(id).select('_id username avatarImage');  // .select('-password');

  const newComment = {
    user: id,
    text: text,
    username: user.username,
    avatarImage: user.avatarImage 
  };

  postData.comments.unshift(newComment);
  await postData.save();
  await db.disconnect();

  res.status(200).json({
    status: "Post retrieved.",
    data: {
      comment: postData.comments
    }
  });
});
export default handler;