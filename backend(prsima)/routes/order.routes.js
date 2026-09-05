import { getOrders, getOrderById, placeOrder, updateOrderStatus } from '../controllers/order.controller.js';
import express from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/', authenticateToken, placeOrder);
router.put('/:id', authenticateToken, authorizeRoles("admin"), updateOrderStatus);

export default router;