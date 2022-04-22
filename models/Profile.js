import mongoose from 'mongoose';
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String
  },
  location: {
    type: String
  },
  backgroundImage: {
    type: String
  },
  backgroundImageFilename: {
    type: String
  },
  themes: {
    type: [String]
  },
  social: {
    website: {
      type: String
    },
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    },
    reddit: {
      type: String
    },
    github: {
      type: String
    }
  },
}, {timestamps: true});

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export default Profile;