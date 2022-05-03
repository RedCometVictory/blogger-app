import nc from 'next-connect';
import multer from 'multer';
import slug from 'slug';
import { v2 as cloudinary } from 'cloudinary';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import { storage, removeOnErr } from '@/utils/cloudinary';
import db from '@/utils/database';
import User from '@/models/User';

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

// *** user info update, avatar image update
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);

handler.use(upload.single('image_url')).put(async(req, res) => {
  const { id } = req.user;
  let { firstName, lastName, email, username } = req.body;
  let imageUrl = '';
  let imageFilename = '';
  let userFields;

  await db.connectToDB();
  const user = await User.findById(id).select("-password");

  if (!user) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "User not found. Sign in."}] });
  };
  
  if (firstName && typeof firstName !== 'string') {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: 'Invalid credentials.' }] });
  };
  if (lastName && typeof lastName !== 'string') {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: 'Invalid credentials.' }] });
  };
  if (username && typeof username !== 'string') {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: 'Invalid credentials.' }] });
  };

  // ***slug should be optional?, purpose is to remove emojis, perhaps apply to first or last names?
  // ***lower: false, means caps are not turned lowercase, all but numbers and letters are replaced via ' '
  firstName = slug(firstName, {replacement: ' ', lower: false});
  lastName = slug(lastName, {replacement: ' ', lower: false});

  if (!email || !email.includes('@')) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).send({ errors: [{ msg: "Invalid credentials." }] });
  }

  if (!username) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: 'Invalid credentials.' }] });
  };

  if (req.file && req.file.path) {
    imageUrl = req.file.path;
    imageFilename = req.file.filename;
  }
  if (imageUrl.startsWith('public\\')) {
    let editImgUrl = imageUrl.slice(6);
    imageUrl = editImgUrl;
  }

  if (imageUrl !== '') {
    if (imageFilename !== '') {
      let currentBgImgFilename = await user.avatarImageFilename;

      if (currentBgImgFilename) {
        await cloudinary.uploader.destroy(currentBgImgFilename);
      }

      userFields = {
        firstName,
        lastName,
        email,
        username,
        avatarImage: imageUrl,
        avatarImageFilename: imageFilename
      }
    }
  }

  // *** no new image to update
  if (imageUrl === '') {
    userFields = {
      firstName, lastName, email, username
    }
  }

  const updateUserInfo = await User.findOneAndUpdate(
    {_id: id}, // key matches key in model
    {$set: userFields},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await db.disconnect();

  res.status(201).json({
    status: "User information updated.",
    data: {
      updateUserInfo
    }
  })
});
export default handler;