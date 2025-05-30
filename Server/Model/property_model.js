import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceString: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  contactName: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  listingType: {
    type: String,
    enum: ['buy', 'rent'],
    required: true
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'],
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Property', propertySchema); 