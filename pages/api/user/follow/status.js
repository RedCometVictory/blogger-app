import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRole } from '@/utils/verifAuth';
import db from '@/utils/database';
import Follow from '@/models/Follow';

const handler = nc({onError, onNoMatch});

// *** insomnia tested - passed
handler.use(verifAuth, authRole).get(async (req, res) => {
  await db.connectToDB();
  const followers = await Follow.find().lean();

  if (!followers) {
    return res.status(401).json({ errors: [{ msg: "User unauthenticated."}] });
  }

  await db.disconnect();

  res.status(200).json({
    status: "User information found.",
    data: {
      followers
    }
  })
});
export default handler;