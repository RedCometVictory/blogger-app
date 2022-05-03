import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';
import Profile from '@/models/Profile';

const handler = nc({onError, onNoMatch});

// *** insomnia tested - passed
handler.use(verifAuth, authRole).get(async (req, res) => {
  const { id } = req.user;
  const { user_id } = req.query;

  await db.connectToDB();

  const user = await User.findById(user_id).select('_id username email avatarImage createdAt');

  if (!user) {
    return res.status(401).json({ errors: [{ msg: "User unauthenticated."}] });
  }

  let profile = await Profile.findOne({user: user_id});
  if (profile) {
    if (profile.themes.length === 0 || !profile.themes) profile.themes = "";
    if (profile.themes.length > 1 && Array.isArray(profile.themes)) {
      profile.themes = profile.themes.join(', ');
    }
  }

  if (!profile) profile = {};

  let userPosts = await Post.find({user: user_id});
  if (!userPosts) userPosts = {};

  await db.disconnect();

  res.status(200).json({
    status: "User information found.",
    data: {
      user,
      profile,
      userPosts
    }
  })
});
export default handler;