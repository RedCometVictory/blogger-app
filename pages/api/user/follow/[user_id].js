import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import Follow from '@/models/Follow';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});

// add to following user
// *** insomnia tested - passed
handler.use(verifAuth, authRole).post(async (req, res) => {
  const { id } = req.user;
  const { user_id } = req.query; // person to follow

  await db.connectToDB();

  let follow = Follow.find();
  let followingUser = false;

  for (let i = 0; i < follow.length; i++) {
    if (follow[i].following_id === user_id && follow[i].follower_id === id) {
      followingUser = true;
    };
  };

  if (followingUser) {
    return res.status(401).json({ errors: [{ msg: "User already followed."}] });
  };

  const followUser = await new Follow({
    following_id: user_id,
    follower_id: id
  });

  await followUser.save();
  await db.disconnect();

  res.status(200).json({
    status: "User information found.",
    data: {
      followUser
    }
  })
});
export default handler;