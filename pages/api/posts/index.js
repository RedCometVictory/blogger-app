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
  let limit = Number(offsetItems) || 12;
  let offset = (page - 1) * limit;
  let count;
  let totalBlogs;
  // let blogs;
  let blogsFlatten = [];
  let blogs = [];
  let blogConcat;
  await db.connectToDB();
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  // TODO --- check if category, tag are empty stings?
  if (keyword) {
    let keywordTrim = keyword.trim().split(/[, ]+/);
    // let keywordRGX = rgx(keywordTrim);
    let keywordRGX;
    let categoryTrim = category.trim();
    let categoryRGX = rgx(categoryTrim);
    // let tagTrim = tag.trim();
    // let tagRGX = rgx(tagTrim);
    console.log("----BEGIN RGX---")
    console.log(keyword)
    console.log(category)

    // console.log(tag)
    console.log("----TRIM+ARRAY---")
    console.log(keywordTrim)
    console.log(keywordTrim.length)
    console.log(categoryTrim)
    // console.log(tagRGX)
    
    let keywordFilter;
    let categoryFilter;
    let tagFilter;
    categoryFilter = categoryRGX && categoryRGX !== 'null' ? {
      category: { $regex: categoryRGX, $options: "i" }
    } : {};



    /*
    // $and: [
    // $or: [
    keywordFilter = keywordRGX && keywordRGX !== 'null' ? {
      $and: [
        {title: { $regex: keywordRGX, $options: "i" }},
        {username: { $regex: keywordRGX, $options: "i" }}
      ]
    } : {};
    //   // //   tags: {$in: tagRGX}
    tagFilter = keywordRGX && keywordRGX !== 'null' ? {
      tags: {$all: keywordRGX}
    } : {};

    let blogResults = await Post.aggregate([
      {
        $match: {
          ...keywordFilter,
          // ...categoryFilter,
          ...tagFilter,
        } 
      }
    ]);
    console.log("UUUUUUUUUUUUUUUUUUUUUUUUUU")
    console.log("blogResults")
    console.log(blogResults)
    */

    // let blogKeyword = await Post.find(
    //   {
    //     ...keywordFilter,
    //     // ...categoryFilter,
    //     // ...tagFilter,
    //   }
    // )
    // //.skip(offset).limit(limit).sort({createdAt: -1}).lean();
    // let blogTags = await Post.find(
    //   {
    //     // ...keywordFilter,
    //     // ...categoryFilter,
    //     ...tagFilter,
    //   }
    // )



    for (let i = 0; i < keywordTrim.length; i++) {
      console.log("----RGX LOOP---")
      keywordRGX = rgx(keywordTrim[i]);
      console.log(keywordRGX)
      console.log(categoryRGX)

      keywordFilter = keywordRGX && keywordRGX !== 'null' ? {
        $or: [
          {title: { $regex: keywordRGX, $options: "i" }},
          {username: { $regex: keywordRGX, $options: "i" }}
        ]
      } : {};

      // //   tags: {$in: tagRGX}
      tagFilter = keywordRGX && keywordRGX !== 'null' ? {
        tags: {$all: keywordRGX}
      } : {};

      let blogKeyword = await Post.find(
        {
          ...keywordFilter,
          // ...categoryFilter,
          // ...tagFilter,
        }
      ).sort({createdAt: -1}).lean();
      // //.skip(offset).limit(limit).sort({createdAt: -1}).lean();
      let blogTags = await Post.find(
        {
          // ...keywordFilter,
          // ...categoryFilter,
          ...tagFilter,
        }
      ).sort({createdAt: -1}).lean();
        
      // console.log("blogKeyword")
      // console.log(blogKeyword)
      // console.log("blogTags")
      // console.log(blogTags)
      // *** Concat arrs and remove duplicate objs by id
      // blogs = blogKeyword.concat(blogsTag);
      // blogs = blogKeyword.concat(blogTags.filter(({_id}) => !blogKeyword.find(f => f._id == _id)));
      console.log("88888888888888888")
      // console.log("blogConcat")
      // blogConcat = blogKeyword.concat(blogTags.filter(({_id}) => !blogKeyword.find(f => f._id == _id)));
      blogConcat = blogKeyword.concat(blogTags);
      // console.log(blogConcat)
      blogsFlatten = [...blogsFlatten, ...blogConcat];
      // blogs = [...blogs, ...blogConcat];
      
      // console.log("blogs - concatenated & filtered")
      // console.log(blogs)
      // *** search all posts, return those where title or username match keyword\
  
    };
    console.log("=================-----")
    // console.log("blogsFlatten")
    // console.log(blogsFlatten)
    console.log("blogsFlatten length")
    console.log(blogsFlatten.length)
    
    for (let i = 0; i < blogsFlatten.length; i++) {
      console.log("blogsFlatten - iterate: " + i);
      console.log(blogsFlatten[i]._id);
      console.log(blogsFlatten[i]._id.toString());
    };

    // ++++++++++++++++++++++++++++++++++++++++++
    // let arr = [{name: "john"}, {name: "jane"}, {name: "imelda"}, {name: "john"}];
    // const uniqueArray = arr.filter((v,i,a)=>a.findIndex(t=>(t.name===v.name))===i)
    let uniqueArray = blogsFlatten.filter((v, i, a) => a.findIndex(t => t._id.toString() === v._id.toString()) === i);
    console.log("uniqueArray");
    console.log(uniqueArray);
    console.log("uniqueArray length");
    console.log(uniqueArray.length);
    
    // ++++++++++++++++++++++++++++++++++++++++++
    // function getUniqItems(arr) {
    //   // const uniqueHash = arr.reduce((acc,o)=>{
    //   arr.reduce((acc,o)=>{
    //       if (!acc[o.id.toString()]) {
    //           acc[o.id.toString()] = [];
    //       }
    //       acc[o.id.toString()].push(o);
    //       return acc;
    //   }
    //   , {});
    //   // return Object.values(uniqueHash).reduce((acc,list)=>{
    //   //     list.sort((a,b)=>new Date(b.pubDate) - new Date(a.pubDate));
    //   //     acc.push(list[0]);
    //   //     return acc;
    //   // }
    //   // , []);
    // }

    // console.log(getUniqItems(blogsFlatten));
    // ++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++
    // let indivItems = blogsFlatten.filter((elem, index, array) => array.findindex(item => item._id.toString() == elem._id.toString()) == index);

    // console.log("indivItems")
    // console.log(indivItems)
    // listOfTags.filter((tag, index, array) => array.findIndex(t => t.color == tag.color && t.label == tag.label) == index);

    // let isFound = false;
    // for (let i = 0; i < blogs.length; i++) {
    // for (let i = 0; i < blogsFlatten.length; i++) {
    //   console.log("outer loop iter: " + i);
    //   let isFound = false;
    //   console.log(`current length of blogs: ${blogs.length}`)
      
    //   if (blogs.length === 0) {
    //     console.log("adding first item to blogs")
    //     blogs.push(blogsFlatten[i]);
    //     // blogs = [...blogsFlatten[i]];
    //     // continue;
    //   };

    //   if (blogs.length > 0) {
    //     for (let j = 0; j < blogsFlatten.length; j++) {
    //     // for (let j = 0; j < blogs.length; j++) {
    //       if (blogs[i]._id.toString() === blogsFlatten[j]._id.toString()) {
    //         isFound = true;
    //         console.log("isFound")
    //         console.log(isFound)

    //       };
    //       if (!isFound) {
    //         console.log("isFound - adding to blogs arr")
    //         // blogs.push(blogsFlatten[i]);
    //         blogs = [...blogs, ...blogsFlatten[i]];
    //       }
    //     };
    //   };
    // };
        // for (let j = 0; i < blogs.length; j++) {
        //   console.log("inner loop iter: " + j);
        //   console.log(`blogs length (innerLoop): ${blogs.length}`)
        //   console.log(`${blogs[j]}`)
        //   if (blogs[j]._id.toString() === blogsFlatten[i]._id.toString()) {
        //     console.log("comparison")
        //     console.log("blogs iter: " + j)
        //     console.log(blogs[j]._id.toString())
        //     console.log("flatten iter: " + i)
        //     console.log(blogsFlatten[j]._id.toString())
        //     isFound = true;
        //     console.log("isFound")
        //     console.log(isFound)
        //   };
        //   if (!isFound) {
        //     console.log("isFound - adding to blogs arr")
        //     // blogs.push(blogsFlatten[i]);
        //     blogs = [...blogs, ...blogsFlatten[i]];
        //   }
        // };
    //   }
    // };
    // const uniqueId = blogsFlatten.filter(elem => {
    //   let isDuplicate = blogs.includes(elem._id);
    //   console.log("isDuplicate")
    //   console.log(isDuplicate)
    //   if (!isDuplicate) {
    //     // blogs.push(elem._id)
    //     blogs.push(elem)
    //     return true;
    //   }
    //   return false;
    // });
    // console.log("uniqueId")
    // console.log(uniqueId)
    /*    
    const uniqueIds = [];

    const unique = arr.filter(element => {
      const isDuplicate = uniqueIds.includes(element.id);

      if (!isDuplicate) {
        uniqueIds.push(element.id);

        return true;
      }

      return false;
    });

    // 👇️ [{id: 1, name: 'Tom'}, {id: 2, name: 'Nick'}]
    console.log(unique);
    */
    console.log("=================-----")

    // let filterDuplicates = (blogsFlatten, key) => {
    //   let check = {};
    //   let res = [];
    //   // for (let i = 0; i < blogsFlatten.length; i++) {
    //   //   if (!check[blogsFlatten[i][key]]) {
    //   //     console.log("blogsFlatten[i][key]");
    //   //     console.log(blogsFlatten[i][key]);
    //   //   }
    //   // };
    //   return blogsFlatten.filter((obj, index, self) =>
    //     index === self.findIndex((el) => (
    //         el[key] === obj[key]
    //     ))
    //   )
    // };

    // console.log("000000  filterDuplicates  000000")
    // console.log(filterDuplicates(blogsFlatten))



    // blogs = [...new Set(blogsFlatten)];
    blogs = [...uniqueArray]; // ---
    // blogs = [...blogsFlatten]; // ---
    console.log("blogs - concatenated & filtered")
    console.log(blogs)
    totalBlogs = blogs.length;
    // todo: filter out duplivate objs from arr

    // let arrSet = new Set(blogs);
    // let filteredArray = Array.from(arrSet);
    // blogs = filteredArray.sort();
//     var arr = [1, 2, 3, 4, 5, 5, 6, 6, 6, 7]
// var mySet = new Set(arr)
// var filteredArray = Array.from(mySet)
// console.log(filteredArray.sort()) // [1,2,3,4,5,6,7]


    //.skip(offset).limit(limit).sort({createdAt: -1}).lean();
    /*
    for (let i = 0; i < keywordTrim.length; i++) {
      console.log("----RGX LOOP---")
      console.log(keywordRGX)
      console.log(categoryRGX)
      keywordRGX = rgx(keywordTrim[i]);

      keywordFilter = keywordRGX && keywordRGX !== 'null' ? {
        $or: [
          {title: { $regex: keywordRGX, $options: "i" }},
          {username: { $regex: keywordRGX, $options: "i" }}
        ]
      } : {};
      
      
        // const tagFilter = tagRGX && tagRGX !== 'null' ? {
        //   tags: {$in: tagRGX}
        // } : {};
      tagFilter = keywordRGX && keywordRGX !== 'null' ? {
        tags: {$all: keywordRGX}
      } : {};
    };
    let blogKeyword = await Post.find(
      {
        ...keywordFilter,
        // ...categoryFilter,
        // ...tagFilter,
      }
    )
    //.skip(offset).limit(limit).sort({createdAt: -1}).lean();
    let blogTags = await Post.find(
      {
        // ...keywordFilter,
        // ...categoryFilter,
        ...tagFilter,
      }
    )
    */
    /*
    let map = new Map();
    let origArr = [
      {name: 'Trump', isRunning: true},
      {name: 'Cruz', isRunning: true},
      {name: 'Kasich', isRunning: true}
    ];
    let updatingArr = [
      {name: 'Cruz', isRunning: false},
      {name: 'Kasich', isRunning: false}
    ];

    // Concating arrays with duplicates
    let NEWArr = origArr.concat(updatingArr);

    // Removing duplicates items
    NEWArr.forEach(item => {
      if(!map.has(item.name)){
        map.set(item.name, item);
      }
    });

    Array.from(map.values());
    */

    // blogs = [...blogKeyword, ...blogTags];
    
    console.log("----RGX END---")

    /*
    var arr1 = [ {a: 1}, {a: 2}, {a: 3} ];
    var arr2 = [ {a: 1}, {a: 2}, {a: 4} ];

    var arr3 = arr1.concat(arr2.filter( ({a}) => !arr1.find(f => f.a == a) ));

    // [ {a: 1}, {a: 2}, {a: 3}, {a: 4} ]

    */
    // blogs.forEach(item => {
    //   if (!map.has(item._id)) {
    //     map.set(item.name, item);
    //   }
    // });

    // console.log("blogs - duplicates removed")
    // console.log(blogs)
    // Array.from(map.values())
    // console.log("blogs - single arr formed")
    // console.log(blogs)
    
  } else {
    totalBlogs = await Post.countDocuments({
      // ...keywordFilter,
      // ...categoryFilter,
      // ...tagFilter,
    });
    // init post fetch
    blogs = await Post.find(
      // {
      //   ...keywordFilter,
      //   ...categoryFilter,
      //   ...tagFilter,
      // }
     ).skip(offset).limit(limit).sort({createdAt: -1}).lean();
  };
    
  await db.disconnect();
  count = totalBlogs;

  console.log("blogs - BE  FINAL RES")
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
/* ORIGINAL VERSION-MONGO
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
  let limit = Number(offsetItems) || 12;
  let offset = (page - 1) * limit;
  let count;
  let totalBlogs;
  let blogs;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  // TODO --- check if category, tag are empty stings?
  let keywordTrim = keyword.trim();
  let keywordRGX = rgx(keywordTrim);
  let categoryTrim = category.trim();
  let categoryRGX = rgx(categoryTrim);
  let tagTrim = tag.trim();
  let tagRGX = rgx(tagTrim);

  console.log("----BEGIN RGX---")
  console.log(keyword)
  console.log(category)
  console.log(tag)
  console.log("----RGX---")
  console.log(keywordRGX)
  console.log(categoryRGX)
  console.log(tagRGX)
  console.log("----RGX END---")

  const keywordFilter = keywordRGX && keywordRGX !== 'null' ? {
    $or: [
      {title: { $regex: keywordRGX, $options: "i" }},
      {username: { $regex: keywordRGX, $options: "i" }}
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

  console.log("blogs")
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
*/


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