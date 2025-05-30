import express from 'express';
import { handleUserLogin, handleUserLogout, updateUserActivity } from '../Controller/user_controller.js';

const router = express.Router();

router.post('/login', handleUserLogin);
router.post('/logout/:email', handleUserLogout);
router.post('/activity/:email', updateUserActivity);

export default router; 