import nc from 'next-connect';
import multer from 'multer';
import normalize from 'normalize-url';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import { storage, removeOnErr } from '@/utils/cloudinary';
import db from '@/utils/database';
import User from '@/models/User';
import Profile from '@/models/Profile';

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

// *** create user profile, update, & delete account
const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);

// *** insomnia tested - passed
handler.use(upload.single('image_url')).post(async(req, res) => {
  const { id } = req.user;
  let { bio, location, themes, website, youtube, facebook, twitter, linkedin, instagram, reddit, github } = req.body;
  let imageUrl = '';
  let imageFilename = '';
  let themesToArr;

  await db.connectToDB();
  const user = await User.findById(id).select("-password");

  const profileExists = await Profile.findOne({user: id}).select("_id");

  if (!user) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "User not found. Sign in."}] });
  };
  
  if (profileExists) {
    if (req.file) {
      await removeOnErr(req.file.filename);
    }
    return res.status(403).json({ errors: [{ msg: "User profile already exists."}] });
  }

  if (req.file && req.file.path) {
    imageUrl = req.file.path;
    imageFilename = req.file.filename;
  }
  if (imageUrl.startsWith('public\\')) {
    let editImgUrl = imageUrl.slice(6);
    imageUrl = editImgUrl;
  }

  if (typeof themes === "string") {
    themesToArr = themes.split(',').map(theme => '' + theme.trim());
  };

  // ensure only two or less themes exist:
  let savedThemes = [];
  if (themesToArr && themesToArr.length > 2) {
    for (let i = 0; i < 2; i++) {
      let theme = themesToArr[i];
      savedThemes.push(theme);
    };
  } else {
    savedThemes = themesToArr;
  };

  const socialFields = {
    website, youtube, facebook, twitter, linkedin, instagram, reddit, github
  }

  // *** normalize urls
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalize(value, { forceHttps: true });
  }

  const newProfile = await new Profile({
    user: id,
    bio,
    location,
    themes: savedThemes,
    backgroundImage: imageUrl,
    backgroundImageFilename: imageFilename,
    social: socialFields
  });

  const profile = await newProfile.save();
  await db.disconnect();

  res.status(201).json({
    status: "Profile created.",
    data: {
      profile
    }
  })
});
export default handler;