import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';

// Import Middleware & Config
import { errorHandler } from './middlewares/errorHandler.js';
import { prisma } from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json()); // Built-in alternative to body-parser
app.use(express.urlencoded({ extended: true }));

// 2. Database Connection Check
prisma.$queryRaw`SELECT NOW() as now`
  .then((rows) => {
    console.log('✅ Database connected successfully at:', rows[0].now);
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);

// 4. Global Error Handler (MUST be after routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});