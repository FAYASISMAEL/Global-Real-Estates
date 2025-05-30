import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

wishlistSchema.index({ userEmail: 1, propertyId: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema); 