import mongoose from 'mongoose';

const premiumTransactionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 299
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'googlepay'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model('PremiumTransaction', premiumTransactionSchema); 