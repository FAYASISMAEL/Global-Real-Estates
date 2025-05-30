import express from 'express';
import { 
  getAnalytics, 
  getAllUsers, 
  getAllProperties, 
  getAllCategories, 
  getReportedListings,
  updatePropertyStatus,
  updateUserStatus,
  addCategory,
  removeCategory,
  deleteProperty,
  getDashboardStats
} from '../Controller/admin_controller.js';

const router = express.Router();

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.headers;
  
  if (username === 'admin' && password === '123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Properties
router.get('/properties', getAllProperties);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

// Categories
router.get('/categories', getAllCategories);
router.post('/categories', addCategory);
router.delete('/categories/:id', removeCategory);

// Reported Listings
router.get('/reported-listings', getReportedListings);

// Dashboard statistics
router.get('/stats', getDashboardStats);

export default router; 