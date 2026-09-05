import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'admin';

async function seed() {
  try {
    // Admin user
    const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await prisma.user.create({
        data: {
          name: 'Store Admin',
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          password_hash: hashed,
          role: 'admin',
        },
      });
      console.log(`✅ Admin created -> ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Categories
    const categories = ['Electronics', 'Clothing', 'Accessories', 'Home & Living'];
    const categoryMap = {};
    for (const name of categories) {
      const cat = await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      categoryMap[name] = cat.category_id;
    }
    console.log('✅ Categories ready');

    // Products
    const products = [
      { name: 'Wireless Headphones', description: 'Over-ear Bluetooth headphones with noise cancellation.', price: 89.99, stock_quantity: 40, category: 'Electronics', sku: 'ELEC-HP-001', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
      { name: 'Smart Watch', description: 'Fitness tracking smart watch with heart-rate monitor.', price: 129.99, stock_quantity: 25, category: 'Electronics', sku: 'ELEC-SW-002', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
      { name: 'Classic T-Shirt', description: '100% cotton crew neck t-shirt.', price: 19.99, stock_quantity: 100, category: 'Clothing', sku: 'CLO-TS-001', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
      { name: 'Denim Jacket', description: 'Classic fit denim jacket.', price: 59.99, stock_quantity: 30, category: 'Clothing', sku: 'CLO-DJ-002', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600' },
      { name: 'Leather Wallet', description: 'Genuine leather bifold wallet.', price: 34.99, stock_quantity: 60, category: 'Accessories', sku: 'ACC-WL-001', image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600' },
      { name: 'Sunglasses', description: 'UV-protection polarized sunglasses.', price: 24.99, stock_quantity: 50, category: 'Accessories', sku: 'ACC-SG-002', image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600' },
      { name: 'Ceramic Vase', description: 'Handmade ceramic decorative vase.', price: 44.99, stock_quantity: 20, category: 'Home & Living', sku: 'HOME-VZ-001', image_url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600' },
      { name: 'Scented Candle Set', description: 'Set of 3 soy wax scented candles.', price: 29.99, stock_quantity: 45, category: 'Home & Living', sku: 'HOME-CD-002', image_url: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600' },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {},
        create: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock_quantity: p.stock_quantity,
          image_url: p.image_url,
          sku: p.sku,
          category_id: categoryMap[p.category],
        },
      });
    }
    console.log('✅ Products ready');
    console.log('🎉 Seed complete');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();