import nc from 'next-connect';
import multer from 'multer';
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

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);

// create new post in blog
// *** insomnia tested - passed
handler.use(upload.single('image_url')).post(async (req, res) => {
  const { id } = req.user;
  let { title, text, category, tags } = req.body;
  let imageUrl = '';
  let imageFilename = '';
  let tagsToArr;
  let postDataCheck;

  if (!title) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).json({ errors: [{ msg: "Title is required."}] });
  }
  if (!text) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).json({ errors: [{ msg: 'Text is required.' }] });
  }
  if (!category) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).json({ errors: [{ msg: 'Category is required.' }] });
  }

  await db.connectToDB();  
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "No user was found. Please sign in. "}] });
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
  if (imageUrl.startsWith('public\\')) {
    let editImgUrl = imageUrl.slice(6);
    imageUrl = editImgUrl;
  }
  const post = await new Post({
    user: user._id, // req.user.id
    username: user.username,
    avatarImage: user.avatarImage,
    coverImage: imageUrl,
    coverImageFilename: imageFilename,
    title: title,
    text: text,
    category,
    tags: tagsToArr,
    // themes: themesToArr
  })

  await post.save();
  await db.disconnect();

  res.status(201).json({
    status: "Post created.",
    data: {
      post
    }
  });
});
export default handler;