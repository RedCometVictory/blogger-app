// import nc from 'next-connect';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { onError, onNoMatch } from '@/utils/ncOptions';
// import { verifAuth, authRole } from '@/utils/verifAuth';
// import db from '@/utils/database';
// import { storage, removeOnErr } from '@/utils/cloudinary';
// import User from '@/models/User';
// import Post from '@/models/Post';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const upload = multer({
//   storage,
//   limits: { fieldSize: 3 * 1024 * 1024 },
//   fileFilter(req,file, cb) {
//     if (!file.originalname.match(/\.(gif|jpe?g|png)$/i)) {
//       return cb(new Error("file must be an image"));
//     }
//     return cb(null, true);
//   }
// }); //3MB

// const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRole);

// // delete post
// // *** insomnia tested - passed
// handler.delete(async (req, res) => {
//   const { post_id } = req.query;
//   await db.connectToDB();
//   const post = await Post.findById(post_id);

//   if (!post) {
//     if (req.file) {
//       await removeOnErr(req.file.filename);
//     }
//     return res.status(403).json({ errors: [{ msg: "Unable to find post."}] });
//   }

//   if (post.user.toString() !== req.user.id) {
//     if (req.file) {
//       await removeOnErr(req.file.filename);
//     }
//     return res.status(401).json({ errors: [{ msg: "User not authorized." }] });
//   }

//   // access the cloudinary api, destroy image currently saved
//   if (post.coverImageFilename) {
//     await cloudinary.uploader.destroy(post.coverImageFilename);
//   }

//   await post.remove();
//   await db.disconnect();
//   res.status(201).json({
//     status: "Post deleted.",
//   });
// });
// export default handler;