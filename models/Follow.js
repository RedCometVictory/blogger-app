import mongoose from 'mongoose';
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