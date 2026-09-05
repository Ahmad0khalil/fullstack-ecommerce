import { prisma } from '../config/db.js';
import { serialize } from '../utils/serialize.js';

function buildProductWhere({ categories, maxprice }) {
  const where = {};
  if (categories) {
    where.category_id = BigInt(categories);
  }
  if (maxprice) {
    where.price = { lte: parseFloat(maxprice) };
  }
  return where;
}

function buildProductOrderBy(sort) {
  if (sort === 'price-asc') return { price: 'asc' };
  if (sort === 'price-desc') return { price: 'desc' };
  return { created_at: 'desc' };
}

function formatProduct(product) {
  return serialize({
    ...product,
    category_name: product.category?.name ?? null,
    category: undefined,
  });
}

export const productService = {
  findAll: async ({ page = 1, limit = 10, categories, sort, maxprice }) => {
    const offset = (page - 1) * limit;
    const where = buildProductWhere({ categories, maxprice });
    const orderBy = buildProductOrderBy(sort);

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: offset,
        take: parseInt(limit, 10),
        include: { category: { select: { name: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items: items.map(formatProduct),
      total,
    };
  },

  findById: async (id) => {
    const product = await prisma.product.findUnique({
      where: { product_id: BigInt(id) },
      include: { category: { select: { name: true } } },
    });
    return product ? formatProduct(product) : null;
  },

  create: async (productData) => {
    const { name, description, price, stock_quantity, image_url, category_id, sku } = productData;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock_quantity: stock_quantity ?? 0,
        image_url,
        category_id: category_id ? BigInt(category_id) : null,
        sku,
      },
    });
    return serialize(product);
  },

  update: async (id, fields) => {
    const data = { ...fields };
    if (data.category_id !== undefined) {
      data.category_id = data.category_id ? BigInt(data.category_id) : null;
    }

    try {
      const product = await prisma.product.update({
        where: { product_id: BigInt(id) },
        data,
      });
      return serialize(product);
    } catch {
      return null;
    }
  },

  remove: async (id) => {
    try {
      const product = await prisma.product.delete({
        where: { product_id: BigInt(id) },
      });
      return serialize(product);
    } catch {
      return null;
    }
  },
};
