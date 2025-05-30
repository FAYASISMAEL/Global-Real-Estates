import { Property, User } from "../connection.js";
import Wishlist from '../Models/wishlist.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addProperty = async (req, res) => {
  try {
    const propertyData = JSON.parse(req.body.propertyData);
    const { userEmail } = propertyData;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isPremium && user.propertyCount >= 2) {
      return res.status(403).json({
        error: 'Property limit reached',
        message: 'You have reached the maximum number of free property listings (2). Please upgrade to premium to post more properties.',
        isPremium: false,
        propertyCount: user.propertyCount,
        maxFreeProperties: 2
      });
    }

    const images = [];
    if (req.files) {
      for (const file of req.files) {
        images.push(`/images/${file.filename}`);
      }
    }

    const property = new Property({
      ...propertyData,
      images
    });

    await property.save();

    user.propertyCount += 1;
    await user.save();

    res.status(201).json({
      property,
      propertyCount: user.propertyCount,
      isPremium: user.isPremium,
      maxFreeProperties: 2
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ error: 'Failed to add property' });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { listingType, location, propertyType, minPrice, maxPrice, includeSoldOut } = req.query;
    const query = {};

    if (!includeSoldOut || includeSoldOut === 'false') {
      query.status = "active";
    }

    if (location && location !== "All India") {
      query.location = location;
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (listingType) {
      query.listingType = listingType.toLowerCase();
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    console.log('Filter Query:', query);

    const properties = await Property.find(query).sort({ createdAt: -1 });
    
    const formattedProperties = properties.map(property => {
      const propertyObj = property.toObject();
      
      if (propertyObj.price && !propertyObj.priceString) {
        propertyObj.priceString = Property.convertNumberToPrice(propertyObj.price);
      }
      
      if (propertyObj.priceString && !propertyObj.price) {
        propertyObj.price = Property.convertPriceToNumber(propertyObj.priceString);
      }
      
      return propertyObj;
    });

    console.log('Found properties:', formattedProperties.length);
    if (formattedProperties.length > 0) {
      console.log('Sample property:', {
        id: formattedProperties[0]._id,
        price: formattedProperties[0].price,
        priceString: formattedProperties[0].priceString,
        soldOut: formattedProperties[0].soldOut,
        status: formattedProperties[0].status
      });
    }

    res.status(200).json(formattedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Error fetching property' });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.userEmail !== updates.userEmail) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markPropertyAsSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    if (property.soldOut) {
      return res.status(400).json({ error: 'Property is already marked as sold' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        soldOut: true,
        soldOutDate: new Date(),
        status: "disabled"
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Property marked as sold successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Error marking property as sold:', error);
    res.status(500).json({ error: 'Failed to mark property as sold' });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    const properties = await Property.find({ userEmail }).sort({ createdAt: -1 });
    
    const formattedProperties = properties.map(property => {
      const propertyObj = property.toObject();
      
      if (propertyObj.price && !propertyObj.priceString) {
        propertyObj.priceString = Property.convertNumberToPrice(propertyObj.price);
      }
      
      if (propertyObj.priceString && !propertyObj.price) {
        propertyObj.price = Property.convertPriceToNumber(propertyObj.priceString);
      }
      
      return propertyObj;
    });

    res.status(200).json(formattedProperties);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ error: 'Error fetching user properties' });
  }
};