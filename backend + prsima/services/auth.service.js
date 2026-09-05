import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { serialize } from '../utils/serialize.js';

export const authService = {
  createUser: async ({ name, username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password_hash: hashedPassword,
      },
      select: {
        user_id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    return serialize(user);
  },

  authenticateUser: async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    const { password_hash, ...safeUser } = user;
    const token = jwt.sign(
      {
        user_id: safeUser.user_id.toString(),
        email: safeUser.email,
        username: safeUser.username,
        name: safeUser.name,
        role: safeUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user: serialize(safeUser) };
  },
};
