import { orderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getOrders = async (req, res, next) => {
  try {
    // Admins see every order; customers only ever see their own.
    const orders = req.user.role === 'admin'
      ? await orderService.findAll()
      : await orderService.findAllForUser(req.user.user_id);

    return res.status(200).json(
      new ApiResponse(200, orders, "Orders retrieved successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.findById(req.params.id);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }
    // Customers may only view their own orders.
    if (req.user.role !== 'admin' && String(order.user_id) !== String(req.user.user_id)) {
      return res.status(403).json(new ApiResponse(403, null, "Forbidden"));
    }
    return res.status(200).json(
      new ApiResponse(200, order, "Order retrieved successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(new ApiResponse(400, null, "Status is required"));
    }
    const updated = await orderService.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }
    return res.status(200).json(
      new ApiResponse(200, updated, "Order status updated successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const { items, total_amount } = req.body;
    // req.user.user_id comes from your verifyToken middleware
    const userId = req.user.user_id; 

    if (!items || items.length === 0) {
      return res.status(400).json(new ApiResponse(400, null, "No items in order"));
    }

    const orderId = await orderService.createOrder(userId, items, total_amount);

    return res.status(201).json(
      new ApiResponse(201, { orderId }, "Order placed successfully")
    );
  } catch (err) {
    // If it's a stock error, we want a 400 Bad Request
    if (err.message.includes('stock') || err.message.includes('not found')) {
      return res.status(400).json(new ApiResponse(400, null, err.message));
    }
    next(err);
  }
};