import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

// General Post search. Homepage of the site, get all blog posts (via every user);
// use search bar to narrow results, 
// sort via various url queries: username, tagname, etc.
// / <-FE
// /api/posts/index <- BE
const handler = nc({onError, onNoMatch});

handler.get(async (req, res) => {
  const {
    // user_id,
    // username, // used with id, user page
    keyword, // used to find post by title or usename
    category,
    tag,
    pageNumber,
    offsetItems
  } = req.query;
  let page = Number(pageNumber);
  if (page < 1) page = 1;
  // let limit = Number(offsetItems) || 6;
  let limit = Number(offsetItems) || 12;
  let offset = (page - 1) * limit;
  let count;
  let totalBlogs;
  let blogsFlatten = [];
  let blogs = [];

  await db.connectToDB();
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

  if (tag) {
    let tagTrim = tag.trim();
    let tagRGX = rgx(tagTrim);
    let tagFilter = tagRGX && tagRGX !== 'null' ? {
      tags: {$all: tagRGX}
    } : {};

    let blogs = await Post.find(
      {
        ...tagFilter
      }
    ).sort({createdAt: -1}).lean();
    //.skip(offset).limit(limit).sort({createdAt: -1}).lean();
    
    await db.disconnect();
    count = blogs.length;

    return res.status(200).json({
      status: "Product data retrieved.",
      data: {
        posts: blogs,
        page: page,
        pages: count // total count of posts
      }
    });
  };
  
  // if (!category && !keyword) {
  if (category === "All" || category === "all") {
    totalBlogs = await Post.countDocuments({});
    // init post fetch
    blogs = await Post.find().skip(offset).limit(limit).sort({createdAt: -1}).lean();
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
  }
  
  if (category) {
    let categoryTrim = category.trim();
    let categoryRGX = rgx(categoryTrim);
    let blogs;
    let categoryFilter;
    
    categoryFilter = categoryRGX && categoryRGX !== 'null' ? {
      category: { $regex: categoryRGX, $options: "i" }
    } : {};

    if (category === 'All') {
      blogs = await Post.find().sort({createdAt: -1}).lean();
    } else {
      blogs = await Post.find(
        {
          ...categoryFilter
        }
      ).sort({createdAt: -1}).lean();
      //.skip(offset).limit(limit).sort({createdAt: -1}).lean();
    };
    
    await db.disconnect();
    count = blogs.length;

    return res.status(200).json({
      status: "Product data retrieved.",
      data: {
        posts: blogs,
        page: page,
        pages: count // total count of posts
      }
    });
  };

  if (keyword && !category) {
    let keywordTrim = keyword.trim().split(/[, ]+/);
    let keywordRGX;
    
    let keywordFilter;
    let tagFilter;

    for (let i = 0; i < keywordTrim.length; i++) {
      keywordRGX = rgx(keywordTrim[i]);
      keywordFilter = keywordRGX && keywordRGX !== 'null' ? {
        $or: [
          {title: { $regex: keywordRGX, $options: "i" }},
          {username: { $regex: keywordRGX, $options: "i" }}
        ]
      } : {};

      tagFilter = keywordRGX && keywordRGX !== 'null' ? {
        tags: {$all: keywordRGX}
      } : {};

      let blogKeyword = await Post.find(
        {
          ...keywordFilter
        }
      )
      .sort({createdAt: -1}).lean();

      let blogTags = await Post.find(
        {
          ...tagFilter,
        }
      )
      .sort({createdAt: -1}).lean();
      // .skip(offset).limit(limit).sort({createdAt: -1}).lean();
      
      // Concat arrs and remove duplicate objs by id
      blogsFlatten = [...blogsFlatten, ...blogKeyword, ...blogTags];
    };

    let uniqueArray = blogsFlatten.filter((v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i);

    blogs = [...uniqueArray]; // ---
    totalBlogs = blogs.length;
  } else {
    // init post fetch
    totalBlogs = await Post.countDocuments({});
    blogs = await Post.find().skip(offset).limit(limit).sort({createdAt: -1}).lean();
  };
    
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