import { prisma } from '../config/db.js';
import { serialize } from '../utils/serialize.js';

export const cartService = {
  getOrCreateCart: async (userId) => {
    const cart = await prisma.cart.upsert({
      where: { user_id: BigInt(userId) },
      update: {},
      create: { user_id: BigInt(userId) },
      select: { cart_id: true },
    });
    return cart.cart_id;
  },

  getCartContents: async (userId) => {
    const cart = await prisma.cart.findUnique({
      where: { user_id: BigInt(userId) },
      include: {
        items: {
          orderBy: { cart_item_id: 'asc' },
          include: {
            product: {
              select: {
                product_id: true,
                name: true,
                price: true,
                image_url: true,
                stock_quantity: true,
              },
            },
          },
        },
      },
    });

    const items = (cart?.items ?? []).map((item) =>
      serialize({
        cart_item_id: item.cart_item_id,
        product_id: item.product_id,
        name: item.product.name,
        price: item.product.price,
        image_url: item.product.image_url,
        stock_quantity: item.product.stock_quantity,
        quantity: item.quantity,
        item_total: Number(item.product.price) * item.quantity,
      })
    );

    const cartTotal = items.reduce((sum, item) => sum + parseFloat(item.item_total), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, cartTotal, totalItems };
  },

  addItem: async (userId, productId, quantity) => {
    const cartId = await cartService.getOrCreateCart(userId);

    const product = await prisma.product.findUnique({
      where: { product_id: BigInt(productId) },
      select: { product_id: true, name: true },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cartId,
          product_id: BigInt(productId),
        },
      },
    });

    const cartItem = existing
      ? await prisma.cartItem.update({
          where: { cart_item_id: existing.cart_item_id },
          data: { quantity: existing.quantity + quantity },
        })
      : await prisma.cartItem.create({
          data: {
            cart_id: cartId,
            product_id: BigInt(productId),
            quantity,
          },
        });

    return serialize(cartItem);
  },

  updateItemQuantity: async (userId, productId, quantity) => {
    if (quantity <= 0) {
      return cartService.removeItem(userId, productId);
    }

    const cart = await prisma.cart.findUnique({
      where: { user_id: BigInt(userId) },
      select: { cart_id: true },
    });
    if (!cart) return null;

    try {
      const cartItem = await prisma.cartItem.update({
        where: {
          cart_id_product_id: {
            cart_id: cart.cart_id,
            product_id: BigInt(productId),
          },
        },
        data: { quantity },
      });
      return serialize(cartItem);
    } catch {
      return null;
    }
  },

  removeItem: async (userId, productId) => {
    const cart = await prisma.cart.findUnique({
      where: { user_id: BigInt(userId) },
      select: { cart_id: true },
    });
    if (!cart) return null;

    try {
      const cartItem = await prisma.cartItem.delete({
        where: {
          cart_id_product_id: {
            cart_id: cart.cart_id,
            product_id: BigInt(productId),
          },
        },
        select: { cart_item_id: true },
      });
      return serialize(cartItem);
    } catch {
      return null;
    }
  },

  clearCart: async (userId) => {
    const cart = await prisma.cart.findUnique({
      where: { user_id: BigInt(userId) },
      select: { cart_id: true },
    });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cart_id: cart.cart_id } });
    }
    return true;
  },
};
