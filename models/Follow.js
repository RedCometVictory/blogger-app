import mongoose from 'mongoose';
// TODO --- combine into user schema?
// *** not yet implemented into api
// following_id id of user you are following
// follower_id your user id

const FollowSchema = new mongoose.Schema({
  following_id: {
    type: String
  },
  follower_id: {
    type: String
  }
});

const Follow = mongoose.models.Follow || mongoose.model('Follow', FollowSchema);
export default Follow;
// module.exports = mongoose.model('Follow', FollowSchema);


/*
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
  ]
*/