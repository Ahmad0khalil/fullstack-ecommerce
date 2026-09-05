import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import express from 'express';
const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/add', authenticateToken, addToCart);
router.put('/:id', authenticateToken, updateCartItem);
router.delete('/:id', authenticateToken, removeFromCart);


export default router;