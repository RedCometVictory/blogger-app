import nc from 'next-connect';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import { storage, removeOnErr } from '@/utils/cloudinary';
import User from '@/models/User';
import Post from '@/models/Post';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage,
  limits: { fieldSize: 3 * 1024 * 1024 },
  fileFilter(req,file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
      return cb(new Error("file must be an image"));
    }
    return cb(null, true);
  }
}); //3MB

// /api/[username]/blog/post/[post_id].js
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);

// get individual post info, for visiting single post or for retrieving information to update post
handler.get(async (req, res) => {
  // *** convert arrays to strings to make readable client side
  const { post_id } = req.query;
  await db.connectToDB();
  const postData = await Post.findById(post_id);
  await db.disconnect();

  if(!postData) {
    return res.status(403).json({ errors: [{ msg: "Failed to find post."}] });
  }

  res.status(200).json({
    status: "Post retrieved.",
    data: {
      postData
    }
  });
});

// update Post
// *** insomnia tested - passed
handler.use(upload.single('image_url')).put(async (req, res) => {
  const { post_id } = req.query;
  const { id } = req.user;
  const { title, text, category, tags } = req.body;
  let imageUrl = '';
  let imageFilename = '';
  let tagsToArr;
  let postDataCheck;
  let postFields;
  
  if (!title) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).json({ errors: [{ msg: 'Title is required.' }] });
  }
  if (!text) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).json({ errors: [{ msg: 'Text is required.' }] });
  }

  await db.connectToDB();
  const user = await User.findById(req.user.id).select('-password');
  const ownedPost = await Post.findById(post_id, 'user');

  ownedPost.user = ownedPost.user.toString();
  let postId = ownedPost.user.toString();
  if (id !== postId) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "You are not the author of this post." }] });
  }
  if (!user) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "No user was found. Please sign in." }] });
  }

  const postExists = await Post.findById(post_id);
  if (!postExists) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "No post found. "}] });
  }

  postDataCheck = { tags };

  for (const [key, value] of Object.entries(postDataCheck)) {
    if (!value) {
      postDataCheck[key] = ''; // console.log(value);
    }
  }

  let postChecked = Object.values(postDataCheck);
  let [tagsChk] = postChecked;

  if (typeof tagsChk === "string") {
    tagsToArr = tagsChk.split(',').map(tag => '' + tag.trim());
  };

  if (req.file && req.file.path) {
    imageUrl = req.file.path;
    imageFilename = req.file.filename;
  }

  // if storing with diskstorage setup for multer
  if (imageUrl.startsWith('public\\')) {
    let editImgUrl = coverImage.slice(6);
    coverImage = editImgUrl;
  }

  // updating along with a new cover image
  if (imageUrl !== '') {
    if (imageFilename !== '') {
      // find post coverImageFilename from existing post, ffind by post id.
      let currentPostImageFilename = await Post.findById(post_id);

      // access the cloudinary api, destroy image currently saved
      if (currentPostImageFilename.coverImageFilename) {
        await cloudinary.uploader.destroy(currentPostImageFilename.coverImageFilename);
      }

      // ready postFields with new information / image
      postFields = {
        username: user.username,
        avatarImage: user.avatarImage,
        coverImage: imageUrl,
        coverImageFilename: imageFilename,
        title: title,
        text: text,
        category,
        tags: tagsToArr    
      };
    }
  }

  // updating post, no new image
  if (imageUrl === '') {
    postFields = {
      username: user.username,
      avatarImage: user.avatarImage,
      title: title,
      text: text,
      category,
      tags: tagsToArr    
    };
  }
  
  const updatePost = await Post.findOneAndUpdate(
    {_id: post_id},
    {$set: postFields},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await db.disconnect();

  res.status(201).json({
    status: "Post updated.",
    data: {
      updatePost
    }
  });
});

// delete post
// *** insomnia tested - passed
handler.delete(async (req, res) => {
  const { post_id } = req.query;
  await db.connectToDB();
  const post = await Post.findById(post_id);

  if (!post) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "Unable to find post."}] });
  }

  if (post.user.toString() !== req.user.id) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(401).json({ errors: [{ msg: "User not authorized." }] });
  }

  // access the cloudinary api, destroy image currently saved
  if (post.coverImageFilename) {
    await cloudinary.uploader.destroy(post.coverImageFilename);
  }

  await post.remove();
  await db.disconnect();
  res.status(201).json({
    status: "Post deleted.",
  });
});
export default handler;