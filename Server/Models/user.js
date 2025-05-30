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
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumStartDate: {
    type: Date
  },
  stripeCustomerId: {
    type: String
  },
  propertyCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
export default User; 