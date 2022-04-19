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

// /api/post/comment/[post_id].js
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);
// /api/post/comment/[post_id]/update/[comment_id]
// update Post
// *** insomnia tested - passed
handler.put(async (req, res) => {
  console.log("###req.query###")
  console.log(req.query)
  const { id } = req.user;
  const { post_id, comment_id } = req.query;
  console.log("req.user")
  console.log(req.user)
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

  console.log("**** BACKEND COMMENT UPDATE ****")
  console.log("postExists")
  console.log(postExists)

  postExists.comments.map(comment => comment._id === comment_id ? comment.text = text : comment);
  let updatedComment;
  for(let i = 0; i < postExists.comments.length; i++) {
    if(comment_id === postExists.comments[i]._id && postExists.comments[i].user.toString() === id) {
      updatedComment = postExists.comments[i];
    }
  }
  console.log("updatedComment")
  console.log(updatedComment)
  
  
  const updatePost = await Post.findOneAndUpdate(
    // {user: req.user.id},
    {_id: post_id},
    // {$set: postFields},
    {$set: postExists},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await db.disconnect();

  console.log("------ updated post -------")
  console.log(updatePost)
  console.log("------ updated post -------")

  res.status(201).json({
    status: "Post updated.",
    data: {
      // comment: updatePost.comments
      comment: updatedComment
    }
  });
});
export default handler;



    // pass comment id, search for comment byh id, from post that exists, filter comments, find match, change the text of the matching comment
  
    // console.log("++++++++++ after comment update ++++++++++++")
    // console.log("postExists.comments")
    // console.log(postExists.comments)
  
    // ready postFields wwith new information / image
    // let postFields = {
    // postFields = {
    //   // user: mongoose.Types.ObjectId(req.user._id),
    //   username: user.username,
    //   avatarImage: user.avatarImage,
    //   // coverImage: imageUrl,
    //   // coverImageFilename: imageFilename,
    //   comments: postExists.comments
    //   // title: title,
    //   // text: text,
    //   // category,
    //   // tags: tagsToArr    
    // };