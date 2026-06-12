import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
 dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import proRoutes from './routes/pro.routes';
import reviewRoutes from './routes/review.routes';
import cityRoutes from './routes/city.routes';
import categoryRoutes from './routes/category.routes';
import messageRoutes from './routes/message.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pros', proRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api', categoryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`🚀 Services Pro Cameroon API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
