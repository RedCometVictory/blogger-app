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
// /api/post/comment/[post_id]/update/[comment_id]
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
// update Post
// *** insomnia tested - passed
handler.put(async (req, res) => {
  const { id } = req.user;
  const { post_id, comment_id } = req.query;
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ errors: [{ msg: 'Text is required.' }] });
  }

  await db.connectToDB();
  const user = await User.findById(id).select('_id username avatarImage');

  if (!user) {
    return res.status(403).json({ errors: [{ msg: "No user was found. Please sign in." }] });
  }

  const postExists = await Post.findById(post_id);
  if (!postExists) {
    return res.status(403).json({ errors: [{ msg: "No post found. "}] });
  }

  postExists.comments.map(comment => comment._id === comment_id ? comment.text = text : comment);
  let updatedComment;
  for(let i = 0; i < postExists.comments.length; i++) {
    if(comment_id === postExists.comments[i]._id && postExists.comments[i].user.toString() === id) {
      updatedComment = postExists.comments[i];
    }
  }

  const updatePost = await Post.findOneAndUpdate(
    {_id: post_id},
    {$set: postExists},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await db.disconnect();

  res.status(201).json({
    status: "Post updated.",
    data: {
      comment: updatedComment
    }
  });
});
export default handler;