import mongoose from 'mongoose';
import { v4 as uuidv4} from "uuid";
const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: {
    type: String,
    required: true
  },
  avatarImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  coverImageFilename: {
    type: String
  },
  title: {
    type: String, 
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  tags: {
    type: [String]
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId
      },
    }
  ],
  comments: [
    {
      _id: {
        type: String,
        default: () => uuidv4(),
        required: true
      },
      user: {
        type: mongoose.Schema.Types.ObjectId
      },
      text: {
        type: String,
        required: true
      },
      username: {
        type: String
      },
      avatarImage: {
        type: String
      },
      parentCommentId: {
        type: String,
        default: null
      },
      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId
          },
        }
      ],
      createdAt: {
        type: String, 
        default: Date().mow
      }
    }
  ],
}, {timestamps: true});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;