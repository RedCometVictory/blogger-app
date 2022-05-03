import nc from 'next-connect';
import { onError, onNoMatch } from "@/utils/ncOptions";
import { verifAuth, authRole } from "@/utils/verifAuth";
import db from "@/utils/database";
import Post from "@/models/Post";

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRole);

handler.get(async (req, res) => {
  // search posts by tags for matching default trends, return the five latest posts found for each post
  let defaultTrends = [
    {
      name: 'discuss',
      intro: 'General discussions. Hopefully something interesting!',
      list: []
    },
    {
      name: 'collab',
      intro: 'Join others in collaborative efforts. Finish your projects together!',
      list: []
    },
    {
      name: 'help',
      intro: 'Need help? Want to help others?',
      list: []
    },
    {
      name: 'watercooler',
      intro: 'Talk about random topics.',
      list: []
    }
  ];

  await db.connectToDB();
  const trendData = [];

  for(let i = 0; i < defaultTrends.length; i++) {
    let topicName = defaultTrends[i].name;
    let topic = await Post.find({tags: {$in: topicName}}).select('_id username title likes comments').limit(5).sort({createdAt: -1});
    trendData[i] = topic;
    defaultTrends[i].list = trendData[i];
  };
  await db.disconnect();

  res.status(200).json({
    status: "Trending topics found.",
    data: {
      defaultTrends
    }
  });
});
export default handler;