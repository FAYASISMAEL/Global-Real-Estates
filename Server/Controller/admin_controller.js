import Property from '../Model/property_model.js';
import User from '../Model/user_model.js';
import Category from '../Model/category_model.js';
import ReportedListing from '../Model/reported_listing_model.js';

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalCategories = await Category.countDocuments();
    const reportedListings = await ReportedListing.countDocuments();

    // Get recent activity (last 5 activities)
    const recentActivity = await Promise.all([
      Property.find().sort({ createdAt: -1 }).limit(2),
      User.find().sort({ createdAt: -1 }).limit(2),
      ReportedListing.find().sort({ createdAt: -1 }).limit(1)
    ]);

    const formattedActivity = [
      ...recentActivity[0].map(prop => ({
        id: prop._id,
        action: 'New Property Listed',
        date: prop.createdAt
      })),
      ...recentActivity[1].map(user => ({
        id: user._id,
        action: 'User Registration',
        date: user.createdAt
      })),
      ...recentActivity[2].map(report => ({
        id: report._id,
        action: 'Property Reported',
        date: report.createdAt
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    res.json({
      totalUsers,
      totalProperties,
      totalCategories,
      reportedListings,
      recentActivity: formattedActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reported listings
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

// Update property status
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

// Update user status (active/suspended)
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

// Add new category
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

// Remove category
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

// Delete property
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

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });

    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalProperties,
        activeProperties,
        totalUsers,
        premiumUsers
      },
      recentProperties,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
}; 