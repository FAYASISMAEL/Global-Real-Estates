import express from 'express';
import { addProperty, getProperties, getPropertyById, updateProperty, markPropertyAsSold, getMyListings } from '../Controller/data_controller.js';
import { addToWishlist, getWishlist, removeFromWishlist, checkWishlistStatus } from '../Controller/wishlist_controller.js';
import upload from '../multer/multer.config.js';

const router = express.Router();

router.post('/properties',upload.array('file',5), addProperty);
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.put('/properties/:id', updateProperty);
router.put('/properties/:id/sold', markPropertyAsSold);
router.get('/mylistings/:userEmail', getMyListings);

router.post('/wishlist', addToWishlist);
router.get('/wishlist/:userEmail', getWishlist);
router.delete('/wishlist/:userEmail/:propertyId', removeFromWishlist);
router.get('/wishlist/:userEmail/:propertyId', checkWishlistStatus);

export default router;