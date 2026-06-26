import express from 'express';
import { getComments, addComment, deleteComment, updateComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:postId').get(getComments).post(protect, addComment);
router.route('/:id').delete(protect, deleteComment).put(protect, updateComment);

export default router;
