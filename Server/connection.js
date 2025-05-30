import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/propertyDB', {
      serverSelectionTimeoutMS: 5000
    });
    
    await mongoose.connection.db.admin().ping();
    // console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
  return true;
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

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
  propertyCount: {
    type: Number, default: 0
  },
  premiumStartDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  priceString: { type: String, required: true },
  details: { type: String, required: true },
  images: { type: [String], required: true },
  location: { type: String, required: true },
  size: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  description: { type: String, required: true },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  listingType: { type: String, enum: ["buy", "rent"], required: true },
  propertyType: { type: String, enum: ["Apartment", "Villa", "Plot"], default: "Apartment" },
  userEmail: { type: String, required: true },
  status: { type: String, enum: ["active", "disabled"], default: "active" },
  soldOut: { type: Boolean, default: false },
  soldOutDate: { type: Date, default: null }
}, { timestamps: true });

propertySchema.statics.convertPriceToNumber = function(priceString) {
  const numStr = priceString.replace(/[₹,]/g, '');
  if (numStr.endsWith('Cr')) {
    return parseFloat(numStr.replace('Cr', '')) * 100;
  } else if (numStr.endsWith('L')) {
    return parseFloat(numStr.replace('L', ''));
  }
  return parseFloat(numStr);
};

propertySchema.statics.convertNumberToPrice = function(priceInLakhs) {
  if (priceInLakhs >= 100) {
    return `₹${(priceInLakhs/100).toFixed(2)}Cr`;
  }
  return `₹${priceInLakhs}L`;
};

const User = mongoose.model('User', userSchema);
const Property = mongoose.model("Property", propertySchema);

export { User, Property, connectDB };
