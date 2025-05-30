import express from 'express';
import { 
  initiatePremiumPurchase, 
  completePremiumPurchase, 
  checkPremiumStatus,
  activatePremium 
} from '../Controller/premium_controller.js';

const router = express.Router();

router.post('/purchase/initiate', initiatePremiumPurchase);
router.post('/purchase/complete', completePremiumPurchase);
router.get('/status/:userEmail', checkPremiumStatus);
router.post('/activate', activatePremium);

export default router; 