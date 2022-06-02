import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import slug from 'slug';
import multer from 'multer';
import { onError, onNoMatch } from '@/utils/ncOptions';
import db from '@/utils/database';
import { storage, removeOnErr } from '@/utils/cloudinary';
import { accessTokenGenerator, accessTokenCookieOptions } from '@/utils/jwtGenerator';
import User from '@/models/User';

// needed to decrypt req.body (set to true), unless using serviced data then leave value as false
export const config = {
  api: { bodyParser: false },
};

const upload = multer({
  storage,
  limits: { fieldSize: 3 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
      return cb(new Error("file must be an image"));
    }
    return cb(null, true);
  }
}); //3MB

const handler = nc({onError, onNoMatch});

// *** Insomnia tested - passed
handler.use(upload.single('image_url')).post(async (req, res) => {
  // req.file produced by multer after uploading to cloudinary. path = secure_url / filename = public_id
  let { firstName, lastName, username, email, password, password2 } = req.body;

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

  // *** slug should be optional?, purpose is to remove emojis, perhaps apply to first or last names?
  // *** lower: false, means caps are not turned lowercase, all but numbers and letters are replaced via ' '
  firstName = slug(firstName, {replacement: ' ', lower: false});
  lastName = slug(lastName, {replacement: ' ', lower: false});

  if (password !== password2) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(400).send([{ errors: [{ msg: "Passwords do not match." }] }]);
  };

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

  let defaultAvatar = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1636353979/blog/Default-welcomer_fhdikf.png`;
  let avatarImage = defaultAvatar;
  let avatarImageFilename = '';
  // *** role changes to admin when profile is created then blogs can be made
  // let roles = ['super-admin', 'admin', 'user', 'banned']
  let role = 'user';
  await db.connectToDB();
  const findUserByEmail = await User.findOne({ email });

  if (findUserByEmail) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "User email already exists!"}] });
  };
  
  const findUserByUsername = await User.findOne({ username });
  
  if (findUserByUsername) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "Username already exists!"}] });
  };

  if (req.file && req.file.path) {
    avatarImage = req.file.path;
    avatarImageFilename = req.file.filename;
  }
  // if storing with diskstorage setup for multer
  if (avatarImage.startsWith('public\\')) {
    let editImgUrl = avatarImage.slice(6);
    avatarImage = editImgUrl;
  }
  
  let salt = await bcrypt.genSalt(11);
  let encryptedPassword = await bcrypt.hash(password, salt);

  let user = await new User({ firstName, lastName, username, email, avatarImage, avatarImageFilename, password: encryptedPassword, role });

  let jwtAccessToken = accessTokenGenerator(user._id, user.role);

  let cookieOptions = accessTokenCookieOptions();

  res.setHeader(
    "Set-Cookie", [
      cookie.serialize("blog__token", jwtAccessToken, cookieOptions),
      cookie.serialize("blog__isLoggedIn", true, {path: "/"})
    ]
  );
  await user.save();
  await db.disconnect();

  if (user.password) {
    user.password = undefined;
  }

  return res.status(201).json({
    status: "User registered!",
    data: { user }
  });
});
export default handler;