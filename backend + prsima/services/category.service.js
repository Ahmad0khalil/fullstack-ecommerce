import { prisma } from '../config/db.js';
import { serialize } from '../utils/serialize.js';

export const categoryService = {
  findAll: async () => {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return serialize(categories);
  },

  findById: async (id) => {
    const category = await prisma.category.findUnique({
      where: { category_id: BigInt(id) },
    });
    return category ? serialize(category) : null;
  },

  create: async (name) => {
    const category = await prisma.category.create({ data: { name } });
    return serialize(category);
  },

  update: async (id, name) => {
    try {
      const category = await prisma.category.update({
        where: { category_id: BigInt(id) },
        data: { name },
      });
      return serialize(category);
    } catch {
      return null;
    }
  },

  remove: async (id) => {
    try {
      const category = await prisma.category.delete({
        where: { category_id: BigInt(id) },
      });
      return serialize(category);
    } catch {
      return null;
    }
  },
};
