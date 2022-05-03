import nc from 'next-connect';
import cookie from 'cookie';
import { v2 as cloudinary } from 'cloudinary';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Follow from '@/models/Follow';
import Post from '@/models/Post';
import Profile from '@/models/Profile';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);

// *** insomnia tested - passed
// *** delete profile, posts + all user data
handler.delete(async(req, res) => {
  const { id } = req.user;
  await db.connectToDB();

  const user = await User.findById({_id: id});
  const profile = await Profile.findOne({user: id});

  if (user.avatarImageFilename) {
    await cloudinary.uploader.destroy(user.avatarImageFilename);
  }

  if (profile.backgroundImageFilename) {
    await cloudinary.uploader.destroy(profile.backgroundImageFilename);
  }

  let postImages = await Post.find({user: id}).select('coverImageFilename -_id');

  if (postImages.length > 0) {
    for (let i = 0; i < postImages.length; i++) {
      if (postImages[i].coverImageFilename !== '') {
        await cloudinary.uploader.destroy(postImages[i].coverImageFilename);
      }
    }
  };

  // delete remaining user data
  await Promise.all([
    Post.deleteMany({ user: id }),
    Follow.deleteMany({$or:[{"following_id": id},{"follower_id": id}]}),
    Profile.findOneAndRemove({ user: id }),
    User.findOneAndRemove({ _id: id })
  ]);
  await db.disconnect();

  // const { token } = req.cookies;
  // if (!token) {
  //   return res.status(403).json({ errors: [{ msg: "Unauthorized. Nothing found!" }] });
  // }
  // if (token) {
  // res.setHeader(
  //   "Set-Cookie",
  //   cookie.serialize("token", '', { expires: new Date(1), path: '/' })
  // );
  // };

  res.setHeader(
    "Set-Cookie",
    // cookie.serialize("blog__token", null, { expires: new Date(1), maxAge: 0, path: '/', httpOnly: false })
    cookie.serialize("blog__token", '', {
      // sameSite: "strict",
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1,
      path: '/',
      // httpOnly: true,
      expires: new Date(0)
    })
  );

  res.status(200).json({
    status: "All user profile and data deleted."
  });
});
export default handler;