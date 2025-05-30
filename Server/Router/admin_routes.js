import express from 'express';
import {
  getDashboardAnalytics,
  getAllUsers,
  getAllProperties,
  getAllCategories,
  getReportedListings,
  updatePropertyStatus,
  updateUserStatus,
  addCategory,
  removeCategory,
  deleteProperty
} from '../Controller/admin_controller.js';

const router = express.Router();

router.get('/analytics', getDashboardAnalytics);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

router.get('/properties', getAllProperties);
router.patch('/properties/:id/status', updatePropertyStatus);
router.delete('/properties/:id', deleteProperty);

router.get('/categories', getAllCategories);
router.post('/categories', addCategory);
router.delete('/categories/:id', removeCategory);

router.get('/reported-listings', getReportedListings);

export default router; 