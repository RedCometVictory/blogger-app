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

  /*
  blogs = await Post.find(
    {
      ...keywordFilter,
      ...categoryFilter,
      ...tagFilter,
    }
  ).skip(offset).limit(limit).sort({createdAt: -1}).lean();
    for (let i = 0; i < cartItemProdIds.length; i++) {
      const productFromCart = 'SELECT id, price, name, count_in_stock FROM products WHERE id = $1;';

      const productConfirm = await queryPromise(productFromCart, cartItemProdIds[i]);
      prodItems = productConfirm.rows[0];
      serverProdPayItems[i] = {...serverProdPayItems[i], ...prodItems};
    };
  */

  await db.connectToDB();
  const trendData = [];
  // const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

  // let tagTrim = tag.trim();
  // let tagRGX = rgx(tagTrim);

  //   const tagFilter = tagRGX && tagRGX !== 'null' ? {
  //   tags: {$in: tagRGX}
  // } : {};
  for(let i = 0; i < defaultTrends.length; i++) {
    let topicName = defaultTrends[i].name;
    let topic = await Post.find({tags: {$in: topicName}}).select('_id username title likes comments').limit(5).sort({createdAt: -1});
    // .lean();
    // trendData[i] = {...trendData[i], ...topic};
    // trendData[i] = {...trendData[i], ...topic};
    trendData[i] = topic;
    // trendData[i] = {...trendData[i], ...topic};
    defaultTrends[i].list = trendData[i];
    // defaultTrends[i].list = [...defaultTrends[i].list, ...trendData[i]]
    // defaultTrends[i].list = trendData;
  };
  await db.disconnect();

  res.status(200).json({
    status: "Trending topics found.",
    data: {
      // trendData,
      defaultTrends
    }
  });
});
export default handler;