import Property from '../Model/property_model.js';
import User from '../Model/user_model.js';
import Category from '../Model/category_model.js';
import ReportedListing from '../Model/reported_listing_model.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const users = await User.find();
    const totalUsers = users.length;
    const premiumUsers = users.filter(user => user.isPremium).length;

    const properties = await Property.find().populate('propertyType');
    const totalProperties = properties.length;

    const propertyStats = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const propertyTypeStats = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    const listingTypeStats = await Property.aggregate([
      {
        $group: {
          _id: '$listingType',
          count: { $sum: 1 }
        }
      }
    ]);

    const reportedListings = await ReportedListing.countDocuments({ status: 'pending' });

    const [recentProperties, recentUsers, recentReports] = await Promise.all([
      Property.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('propertyType')
        .select('title createdAt price location propertyType listingType'),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt isPremium'),
      ReportedListing.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('propertyId')
        .populate('reportedBy', 'name email')
    ]);

    const categories = await Category.find();
    const totalCategories = categories.length;

    const activity = [
      ...recentProperties.map(p => ({
        type: 'property',
        action: 'New Property Listed',
        title: p.title,
        details: {
          price: p.price,
          location: p.location,
          type: p.propertyType?.name || 'Unknown',
          listingType: p.listingType
        },
        date: p.createdAt
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        action: 'New User Registered',
        name: u.name,
        details: {
          email: u.email,
          isPremium: u.isPremium
        },
        date: u.createdAt
      })),
      ...recentReports.map(r => ({
        type: 'report',
        action: 'Property Reported',
        title: r.propertyId?.title || 'Unknown Property',
        details: {
          reportedBy: r.reportedBy?.name || 'Anonymous',
          reason: r.reason,
          status: r.status
        },
        date: r.createdAt
      }))
    ].sort((a, b) => b.date - a.date);

    const locationStats = await Property.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      users: {
        total: totalUsers,
        premium: premiumUsers,
        regular: totalUsers - premiumUsers
      },
      properties: {
        total: totalProperties,
        byStatus: propertyStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byType: propertyTypeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byListingType: listingTypeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byLocation: locationStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      },
      categories: {
        total: totalCategories,
        list: categories
      },
      reportedListings,
      recentActivity: activity
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Error fetching dashboard analytics' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('propertyType')
      .sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportedListings = async (req, res) => {
  try {
    const reportedListings = await ReportedListing.find()
      .populate('propertyId')
      .populate('reportedBy', '-password');
    res.json(reportedListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const property = await Property.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ error: 'Error updating property status' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Error deleting property' });
  }
}; 