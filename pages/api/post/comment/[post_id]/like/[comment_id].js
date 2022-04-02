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

// like comment belonging to Post
// /api/post/comment/[post_id]/like/[comment_id].js
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
// *** insomnia tested - passed
handler.post(async (req, res) => {
  console.log("###req.query###")
  console.log(req.query)
  // const { id } = req.user;
  const { post_id, comment_id, parentCommentId = null } = req.query;
  console.log("req.params");
  console.log(req.params);
  console.log("req.user")
  console.log(req.user)

  await db.connectToDB();
  const post = await Post.findById(post_id);

  // console.log("post")
  // search through all post comments for matching comment id and check if comment is already lieked
  for(let i = 0; i < post.comments.length; i++) {
    if (post.comments[i]._id === comment_id) {
      if (post.comments[i].likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(403).json({ errors: [{ msg: "Post comment is already liked." }] });
      }
    }
  };
  
  let matchedCommentId;
  let matchedCommentLikes;
  // find matching comment and add like to it
  for(let i = 0; i < post.comments.length; i++) {
    if (post.comments[i]._id === comment_id) {
      // add the like
      matchedCommentId = post.comments[i]._id;
      // post.comments[i].likes.unshift({ user: req.user.id });
      //*** matchedCommentLikes = post.comments[i].likes.unshift({ user: req.user.id });
      post.comments[i].likes.unshift({ user: req.user.id });
      // matchedCommentLikes = post.comments[i].likes;
      matchedCommentLikes = post.comments[i].likes[0];
    }
  };


  await post.save();
  await db.disconnect();

  console.log("matched comment id")
  console.log(matchedCommentId)
  console.log("matched comment like")
  console.log(matchedCommentLikes)
  console.log("adding comment like")
  console.log(post.comments)

  res.status(201).json({
    status: "Post liked.",
    data: {
      commentId: matchedCommentId,
      commentLikes: matchedCommentLikes
      // likes: post.likes
    }
  });
});
export default handler;