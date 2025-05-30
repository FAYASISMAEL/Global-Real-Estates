import User from '../Model/user_model.js';
import PremiumTransaction from '../Models/premium.js';
import crypto from 'crypto';

const simulatePayment = async (amount, paymentMethod) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return Math.random() < 0.9;
};

export const activatePremium = async (req, res) => {
  try {
    const { userEmail, name } = req.body;

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = new User({
        email: userEmail,
        name: name || userEmail.split('@')[0],
        isPremium: false,
        propertyCount: 0
      });
    }

    user.isPremium = true;
    user.premiumStartDate = new Date();
    await user.save();

    res.status(200).json({ message: 'Premium activated successfully' });
  } catch (error) {
    console.error('Error activating premium:', error);
    res.status(500).json({ error: 'Failed to activate premium' });
  }
};

export const initiatePremiumPurchase = async (req, res) => {
  try {
    const { userEmail, paymentMethod } = req.body;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isPremium) {
      return res.status(400).json({ error: 'User is already a premium member' });
    }

    const transaction = new PremiumTransaction({
      userEmail,
      paymentMethod,
      transactionId: crypto.randomBytes(16).toString('hex')
    });

    await transaction.save();

    res.status(200).json({
      message: 'Premium purchase initiated',
      transactionId: transaction.transactionId,
      amount: transaction.amount
    });
  } catch (error) {
    console.error('Error initiating premium purchase:', error);
    res.status(500).json({ error: 'Failed to initiate premium purchase' });
  }
};

export const completePremiumPurchase = async (req, res) => {
  try {
    const { transactionId, paymentDetails } = req.body;

    const transaction = await PremiumTransaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status === 'completed') {
      return res.status(400).json({ error: 'Transaction already completed' });
    }

    const paymentSuccess = await simulatePayment(transaction.amount, transaction.paymentMethod);

    if (!paymentSuccess) {
      transaction.status = 'failed';
      await transaction.save();
      return res.status(400).json({ error: 'Payment failed' });
    }

    transaction.status = 'completed';
    await transaction.save();

    const user = await User.findOne({ email: transaction.userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isPremium = true;
    user.premiumStartDate = new Date();
    await user.save();

    res.status(200).json({
      message: 'Premium purchase completed successfully',
      premiumStatus: {
        isPremium: true,
        startDate: user.premiumStartDate
      }
    });
  } catch (error) {
    console.error('Error completing premium purchase:', error);
    res.status(500).json({ error: 'Failed to complete premium purchase' });
  }
};

export const checkPremiumStatus = async (req, res) => {
  try {
    const { userEmail } = req.params;

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = new User({
        email: userEmail,
        name: userEmail.split('@')[0],
        isPremium: false,
        propertyCount: 0
      });
      await user.save();
    }

    res.status(200).json({
      isPremium: user.isPremium,
      propertyCount: user.propertyCount,
      premiumStartDate: user.premiumStartDate
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    res.status(500).json({ error: 'Failed to check premium status' });
  }
}; 