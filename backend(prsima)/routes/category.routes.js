import { getCategories, getCategoryById, postCategory, editCategory, deleteCategory } from '../controllers/category.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import express from 'express';
const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateToken, authorizeRoles("admin"), postCategory)
router.put('/:id', authenticateToken, authorizeRoles("admin"), editCategory)
router.delete('/:id', authenticateToken, authorizeRoles("admin"), deleteCategory)

export default router;