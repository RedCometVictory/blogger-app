import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import User from '@/models/User';
import Profile from '@/models/Profile';

const handler = nc({onError, onNoMatch});

// *** insomnia tested - passed
handler.use(verifAuth, authRole).get(async (req, res) => {
  const { id } = req.user;

  await db.connectToDB();

  const user = await User.findById(id).select('username email avatarImage');

  if (!user) {
    return res.status(401).json({ errors: [{ msg: "User unauthenticated."}] });
  }

  let profile = await Profile.findOne({user: id});

  if (profile) {
    if (profile.themes.length === 0 || !profile.themes) profile.themes = "";
    if (profile.themes.length > 1 && Array.isArray(profile.themes)) {
      profile.themes = profile.themes.join(', ');
    }
  }

  if (!profile) profile = {};

  await db.disconnect();

  res.status(200).json({
    status: "User information found.",
    data: {
      profile
    }
  })
});
export default handler;