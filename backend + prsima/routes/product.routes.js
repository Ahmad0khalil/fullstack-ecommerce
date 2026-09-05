import { getProducts, addNewproduct, getProductById, editProduct, deleteProduct } from '../controllers/product.controller.js';
import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', getProducts);
router.post('/', authenticateToken, authorizeRoles("admin"), addNewproduct);
router.get('/:id', getProductById);
router.put('/:id', authenticateToken, authorizeRoles("admin"), editProduct );
router.delete('/:id', authenticateToken, authorizeRoles("admin"), deleteProduct );

export default router;