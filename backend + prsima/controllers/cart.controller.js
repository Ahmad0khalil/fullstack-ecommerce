import { cartService } from '../services/cart.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const cartData = await cartService.getCartContents(userId);
    
    return res.status(200).json(
      new ApiResponse(200, cartData, "Cart retrieved successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  console.log("------ data ------", req.body)
  try {
    const userId = req.user.user_id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json(new ApiResponse(400, null, "Product ID is required"));
    }

    const addedItem = await cartService.addItem(userId, product_id, parseInt(quantity));
    
    return res.status(200).json(
      new ApiResponse(200, addedItem, "Item added to cart successfully")
    );
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json(new ApiResponse(404, null, err.message));
    }
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
      return res.status(400).json(new ApiResponse(400, null, "Product ID and quantity are required"));
    }

    const updatedItem = await cartService.updateItemQuantity(userId, product_id, parseInt(quantity));
    
    if (!updatedItem) {
      return res.status(404).json(new ApiResponse(404, null, "Item not found in cart"));
    }

    return res.status(200).json(
      new ApiResponse(200, updatedItem, "Cart updated successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { product_id } = req.params;

    const removed = await cartService.removeItem(userId, product_id);
    
    if (!removed) {
      return res.status(404).json(new ApiResponse(404, null, "Item not found in cart"));
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Item removed from cart successfully")
    );
  } catch (err) {
    next(err);
  }
};