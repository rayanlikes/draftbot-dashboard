import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  discriminator: String,
  avatar: String,
  accessToken: String,
  refreshToken: String,
  guilds: [{
    id: String,
    name: String,
    icon: String,
    owner: Boolean,
    permissions: Number
  }],
  profile: {
    banner: String,
    info: String,
    customization: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;