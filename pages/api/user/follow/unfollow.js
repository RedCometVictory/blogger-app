import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import Follow from '@/models/Follow';

export const config = {
  api: { bodyParser: true },
};

const handler = nc({onError, onNoMatch});

// unfollow user
// *** insomnia tested - passed
handler.use(verifAuth, authRole).put(async (req, res) => {
  const { id } = req.user;
  const { user_id } = req.query;

  await db.connectToDB();
  let follow = await Follow.find().lean();
  
  let followingUser = false;
  let followIndex;
  for (let i = 0; i < follow.length; i++) {
    if (follow[i].following_id === user_id && follow[i].follower_id === id) {
      followingUser = true;
      followIndex = follow[i]._id;
    };
  };
  
  if (!followingUser) {
    return res.status(401).json({ errors: [{ msg: "User not yet followed."}] });
  };

  await Follow.findOneAndRemove({following_id: user_id, follower_id: id}).lean();

  let followRemoved = follow.filter(follow => follow._id !== followIndex);
  follow = followRemoved;

  await db.disconnect();

  res.status(200).json({
    status: "User information found.",
    data: {
      followers: follow
    }
  })
});
export default handler;