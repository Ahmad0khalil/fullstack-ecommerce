import { prisma } from '../config/db.js';
import { serialize } from '../utils/serialize.js';

function formatOrder(order) {
  return serialize({
    order_id: order.order_id,
    user_id: order.user_id,
    username: order.user.username,
    total_amount: order.total_amount,
    status: order.status,
    order_date: order.order_date,
    items: order.items.map((item) => ({
      product_id: item.product_id,
      name: item.product.name,
      price: item.price_at_purchase,
      quantity: item.quantity,
    })),
  });
}

export const orderService = {
  findAll: async () => {
    const orders = await prisma.order.findMany({
      orderBy: { order_date: 'desc' },
      include: {
        user: { select: { username: true } },
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    });
    return orders.map(formatOrder);
  },

  findAllForUser: async (userId) => {
    const orders = await prisma.order.findMany({
      where: { user_id: BigInt(userId) },
      orderBy: { order_date: 'desc' },
      include: {
        user: { select: { username: true } },
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    });
    return orders.map(formatOrder);
  },

  findById: async (id) => {
    const order = await prisma.order.findUnique({
      where: { order_id: BigInt(id) },
    });
    return order ? serialize(order) : null;
  },

  updateStatus: async (id, status) => {
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${allowed.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    try {
      const order = await prisma.order.update({
        where: { order_id: BigInt(id) },
        data: { status },
      });
      return serialize(order);
    } catch {
      return null;
    }
  },

  createOrder: async (userId, items, totalAmount) => {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          user_id: BigInt(userId),
          total_amount: totalAmount,
          status: 'pending',
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { product_id: BigInt(item.product_id) },
          select: { stock_quantity: true, name: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found.`);
        }
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }

        await tx.orderItem.create({
          data: {
            order_id: order.order_id,
            product_id: BigInt(item.product_id),
            quantity: item.quantity,
            price_at_purchase: item.price,
          },
        });

        await tx.product.update({
          where: { product_id: BigInt(item.product_id) },
          data: { stock_quantity: { decrement: item.quantity } },
        });
      }

      return order.order_id.toString();
    });
  },
};
