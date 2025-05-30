import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  propertyCount: {
    type: Number,
    default: 0
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date
  },
  lastActivityAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema); 