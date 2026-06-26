import express from 'express';
import { getUserById, updateUserProfile, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', getUserById);

export default router;
