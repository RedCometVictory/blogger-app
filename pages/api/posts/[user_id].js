import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import db from '@/utils/database';
import Post from '@/models/Post';

// *** get posts for user blog homepage, get all blog posts matching query
// /api/posts/[user_id] <- BE
const handler = nc({onError, onNoMatch});

handler.get(async (req, res) => {
  const {
    user_id,
    // username, // used with id, user page
    category,
    tag,
    keyword,
    pageNumber,
    offsetItems
  } = req.query;
  let page = Number(pageNumber);
  if (page < 1) page = 1;
  let limit = Number(offsetItems) || 12;
  let offset = (page - 1) * limit;
  let count;
  let totalBlogs;
  let blogs;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  let keywordTrim = keyword.trim();
  let keywordRGX = rgx(keywordTrim);
  let categoryTrim = category.trim();
  let categoryRGX = rgx(categoryTrim);
  let tagTrim = tag.trim();
  let tagRGX = rgx(tagTrim);

  const keywordFilter = keywordRGX && keywordRGX !== 'null' ? {
    $and: [
      {user: user_id},
      {title: { $regex: keywordRGX, $options: "i" }}
    ]
  } : {};

  const categoryFilter = categoryRGX && categoryRGX !== 'null' ? {
    category: { $regex: categoryRGX, $options: "i" }
  } : {};

  const tagFilter = tagRGX && tagRGX !== 'null' ? {
    tags: {$in: tagRGX}
  } : {};
   
  // *** search all posts, return those where title or username match keyword
  await db.connectToDB();

  totalBlogs = await Post.countDocuments({
    ...keywordFilter,
    ...categoryFilter,
    ...tagFilter,
  });

  blogs = await Post.find(
    {
      ...keywordFilter,
      ...categoryFilter,
      ...tagFilter,
    }
  ).skip(offset).limit(limit).sort({createdAt: -1}).lean();

  await db.disconnect();
  count = totalBlogs;
  return res.status(200).json({
      status: "Product data retrieved.",
      data: {
        posts: blogs,
        page: page,
        pages: count // total count of posts
      }
  });
});

export default handler;