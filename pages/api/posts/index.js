import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import db from '@/utils/database';
import User from '@/models/User';
import Post from '@/models/Post';

// *** General Post search. Located on homepage of the site, get all blog posts (via every user);
// *** interact with search bar from the navbar to narrow results, 
// *** sort via various url queries: username, tagname, etc.
// / <-FE
// /api/posts/index <- BE
const handler = nc({onError, onNoMatch});

handler.get(async (req, res) => {
  // console.log("BACKEND")
  // console.log("req.params");
  // console.log(req.params);
  console.log("BACKEND")
  console.log("req.qquery");
  console.log(req.query);
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

  console.log("BACKEND BEGIN")
  console.log("page")
  console.log(page)
  console.log("limit")
  console.log(limit)
  console.log("offset")
  console.log(offset)
  console.log("pageNumber")
  console.log(pageNumber)

  if (tag) {
    console.log("tag")
    console.log(tag)
    let tagTrim = tag.trim();
    let tagRGX = rgx(tagTrim);
    console.log("----BEGIN RGX---")
    console.log("tagRGX")
    console.log(tagRGX)
    // tags: {$in: tagRGX}
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
    console.log("BACKEND _ CATEGORY ALL SEARCH")
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
    console.log("category")
    console.log(category)
    let categoryTrim = category.trim();
    let categoryRGX = rgx(categoryTrim);
    console.log("----BEGIN RGX---")
    console.log("categoryRGX")
    console.log(categoryRGX)
    
    console.log("----TRIM+ARRAY---")
    // console.log(categoryTrim);
    
    let categoryFilter;
    categoryFilter = categoryRGX && categoryRGX !== 'null' ? {
      category: { $regex: categoryRGX, $options: "i" }
    } : {};

    // categoryFilter = categoryRGX && categoryRGX !== 'null' ? {
    //   category: { $regex: categoryRGX, $options: "i" }
    // } : {};
    let blogs;

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

  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&")
    console.log("category")
    console.log(category)
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&")
  if (keyword && !category) {
    let keywordTrim = keyword.trim().split(/[, ]+/);
    let keywordRGX;
    console.log("----BEGIN RGX---")
    console.log(keyword)

    console.log("----TRIM+ARRAY---")
    console.log(keywordTrim)
    console.log(keywordTrim.length)
    
    let keywordFilter;
    let tagFilter;

    for (let i = 0; i < keywordTrim.length; i++) {
      console.log("----RGX LOOP---")
      keywordRGX = rgx(keywordTrim[i]);
      console.log(keywordRGX)

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
      // .skip(offset).limit(limit).sort({createdAt: -1}).lean();
      let blogTags = await Post.find(
        {
          ...tagFilter,
        }
      )
      .sort({createdAt: -1}).lean();
      // .skip(offset).limit(limit).sort({createdAt: -1}).lean();
      
      // *** Concat arrs and remove duplicate objs by id
      // blogConcat = blogKeyword.concat(blogTags); // ---
      blogsFlatten = [...blogsFlatten, ...blogKeyword, ...blogTags];
      
      // console.log("blogs - concatenated & filtered")
      // console.log(blogs)
      // *** search all posts, return those where title or username match keyword\
  
    };
    console.log("=================-----")
    console.log("blogsFlatten")
    console.log(blogsFlatten)
    console.log("blogsFlatten length")
    console.log(blogsFlatten.length)
    
    // for (let i = 0; i < blogsFlatten.length; i++) {
    //   console.log("blogsFlatten - iterate: " + i);
    //   console.log(blogsFlatten[i]._id);
    //   console.log(blogsFlatten[i]._id.toString());
    // };

    let uniqueArray = blogsFlatten.filter((v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i);
    // let uniqueArray = blogsFlatten.filter((v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i); // ---
    console.log("uniqueArray");
    console.log(uniqueArray);
    console.log("uniqueArray length");
    console.log(uniqueArray.length);

    console.log("=================-----")

    blogs = [...uniqueArray]; // ---
    console.log("blogs - concatenated & filtered")
    console.log(blogs)
    totalBlogs = blogs.length;
    console.log("----RGX END---")
  } else {
    console.log("BACKEND _ GENERAL FEED SEARCH")
    totalBlogs = await Post.countDocuments({});
    // init post fetch
    blogs = await Post.find().skip(offset).limit(limit).sort({createdAt: -1}).lean();
  };
    
  await db.disconnect();
  count = totalBlogs;

  console.log("blogs - FINAL RES")
  console.log(blogs)
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


/*
  if (keyword.length > 0 && keyword !== 'null') {
    let keywordTrim = keyword.trim();
    let keywordRGX = rgx(keywordTrim);
    if (category === '' || category === 'null' || !category) {
      // *** total count of matching posts
      totalBlogs = await Pool.find({
        $or: [
          {title: { $regex: keywordRGX, $options: "i" }},
          {username: { $regex: keywordRGX, $options: "i" }}
        ]
      }).estimatedDocumentCount();

      // *** get info, matching posts
      blogs = await Pool.find({
        $or: [
          {title: { $regex: keywordRGX, $options: "i" }},
          {username: { $regex: keywordRGX, $options: "i" }}
        ]
      }).skip(offsetItems).limit(limit).sort({"timestamps": -1});
    }

    // *** if category is applied
    if (category && category.length > 0) {
      let keywordTrim = keyword.trim();
      let keywordRGX = rgx(keywordTrim);
      let categoryTrim = category.trim();
      let categoryRGX = rgx(categoryTrim);
      totalBlogs = await Pool.find({
        $and: [
          { category: { $regex: categoryRGX, $options: "i" } },
          {
            $or: [
              {title: { $regex: keywordRGX, $options: "i" }},
              {username: { $regex: keywordRGX, $options: "i" }},
            ]
          }
        ]
        
      }).estimatedDocumentCount();

      // *** get info, matching posts
      blogs = await Pool.find({
        $and: [
          { category: { $regex: categoryRGX, $options: "i"} },
          {
            $or: [
              {title: { $regex: keywordRGX, $options: "i" }},
              {username: { $regex: keywordRGX, $options: "i" }}
            ]
          }
        ]
      }).skip(offsetItems).limit(limit).sort({"timestamps": -1});
    }
  }
    
  const posts = await Post.find({
    user: user_id
  }).sort({ "timestamp": -1 });
  // }).sort({ createdAt: -1 });


#####################################################
original version of route
#####################################################
import nc from 'next-connect';
import { onError, onNoMatch } from '../../../utils/ncOptions';
import db from '../../../utils/database';
import User from '../../../models/User';
import Post from '../../../models/Post';

// *** get all blog posts of username, use in user blog hompage feed
// /[username]/blog/ <-FE
// /api/posts/[user_id] <- BE
const handler = nc({onError, onNoMatch});

handler.get(async (req, res) => {
  const {
    user_id,
    category,
    tag,
    username,
    limit,
    currentPage
  } = req.query;
  // TODO --- look into sending multiple queries (category, tag, username) to this route
  // TODO --- implement pagination
  // *** searching for all posts by username requires regex
  await db.connectToDB();
  // TODO --- move this search query to client side search bar
  // const user = await User.findOne({
  //   name: {
  //     $regex: username,
  //     $options: 'i',
  //   },
  // });
  // TODO --- move this search query to client side search bar
    
  const posts = await Post.find({
    user: user_id
  }).sort({ "timestamp": -1 });
  // }).sort({ createdAt: -1 });
  await db.disconnect();

  // TODO --- consider looping through posts to change timestamp date to ISOString
  res.status(200).json({
    status: "All posts for blog.",
    data: {
      // user,
      posts
    }
  })
});

export default handler;
#####################################################
#####################################################
*/

/*
let { keyword, category, pageNumber, offsetItems } = req.query;
  let page = Number(pageNumber) || 1;
  if (page < 1) page = 1;
  let totalProducts;
  let products;
  let limit = Number(offsetItems) || 12;
  let offset = (page - 1) * limit;
  let count;

  try {
    const queryPromise = (query, ...values) => {
      return new Promise((resolve, reject) => {
        pool.query(query, values, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    }

    if (keyword.length > 0 && keyword !== 'null') {
      let keywordTrimmed = keyword.trim();
      if (category === '' || category === 'null' || !category) {
        // console.log("using keyword, no category, querying products");
        totalProducts = await pool.query(
          'SELECT COUNT(id) FROM products WHERE name ILIKE $1;', ['%' + keywordTrimmed + '%']
        )
        products = await pool.query(
          'SELECT P.*, I.* FROM products AS P JOIN images AS I ON P.id = I.product_id WHERE P.name ILIKE $1 GROUP BY I.id, P.id LIMIT $2 OFFSET $3;', ['%' + keywordTrimmed + '%', limit, offset]
        );
      }
      
      if (category && category.length > 0) {
        // console.log("using keyword, with category, querying products");
        totalProducts = await pool.query(
          'SELECT COUNT(id) FROM products WHERE name ILIKE $1 AND category = $2;', ['%' + keywordTrimmed + '%', category]
        )
        products = await pool.query(
          'SELECT P.*, I.* FROM products AS P JOIN images AS I ON P.id = I.product_id WHERE P.name ILIKE $1 AND category = $2 GROUP BY I.id, P.id LIMIT $3 OFFSET $4;', ['%' + keywordTrimmed + '%', category, limit, offset]
        );
      };
    }

    if (keyword === '' || keyword.length === 0 || !keyword) {
      if (category === '' || category === 'null' || !category) {
        // console.log("querying products, no keyword, no category");
        totalProducts = await pool.query(
          'SELECT COUNT(id) FROM products;'
        )
        products = await pool.query(
          'SELECT P.*, I.* FROM products AS P JOIN images AS I ON P.id = I.product_id GROUP BY I.id, P.id LIMIT $1 OFFSET $2;', [limit, offset]
        );
      };
      
      if (category && category.length > 0) {
        // console.log("querying products, no keyword, with category");
        totalProducts = await pool.query(
          'SELECT COUNT(id) FROM products WHERE category = $1;', [category]
        )
        products = await pool.query(
          'SELECT P.*, I.* FROM products AS P JOIN images AS I ON P.id = I.product_id WHERE P.category = $1 GROUP BY I.id, P.id LIMIT $2 OFFSET $3;', [category, limit, offset]
        );
      };
    };

    count = totalProducts.rows[0].count;
    Number(count);

    if (products.rows.length > 0) {
      if (products.rowCount >= 1) {
        for (let i = 0; i < products.rows.length; i++) {
          let created_at = products.rows[i].created_at;
          let newCreatedAt = created_at.toISOString().slice(0, 10);
          products.rows[i].created_at = newCreatedAt;
        }
      };
      for (let i = 0; i < products.rows.length; i++) {
        const productReviewsQuery = 'SELECT TRUNC(AVG(rating), 2) AS review_avg, COUNT(rating) FROM reviews WHERE product_id = $1;';
        const productReviewsProm = await queryPromise(productReviewsQuery, products.rows[i].product_id);
        let productReviews = productReviewsProm.rows[0];
        products.rows[i] = { ...products.rows[i], ...productReviews };
      }
    }

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error...");
  }
*/