import Wishlist from '../Models/wishlist.js';
import mongoose from 'mongoose';

export const addToWishlist = async (req, res) => {
  try {
    const { userEmail, propertyId } = req.body;

    const wishlistCount = await Wishlist.countDocuments({ userEmail });
    if (wishlistCount >= 3) {
      return res.status(400).json({ error: 'Wishlist limit reached (maximum 3 properties allowed)' });
    }

    const existingItem = await Wishlist.findOne({ userEmail, propertyId });
    if (existingItem) {
      return res.status(400).json({ error: 'Property already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      userEmail,
      propertyId: new mongoose.Types.ObjectId(propertyId),
    });

    await wishlistItem.save();
    res.status(201).json({ message: 'Property added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userEmail, propertyId } = req.params;
    
    const result = await Wishlist.findOneAndDelete({ userEmail, propertyId });
    if (!result) {
      return res.status(404).json({ error: 'Property not found in wishlist' });
    }

    res.json({ message: 'Property removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    const wishlist = await Wishlist.aggregate([
      { $match: { userEmail } },
      {
        $lookup: {
          from: 'properties',
          localField: 'propertyId',
          foreignField: '_id',
          as: 'property'
        }
      },
      { $unwind: '$property' },
      {
        $project: {
          _id: 1,
          addedAt: 1,
          property: 1
        }
      },
      { $sort: { addedAt: -1 } }
    ]);

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkWishlistStatus = async (req, res) => {
  try {
    const { userEmail, propertyId } = req.params;
    
    const item = await Wishlist.findOne({ userEmail, propertyId });
    res.json({ isInWishlist: !!item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 