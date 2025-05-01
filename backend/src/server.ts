import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import config from './config/config'; // This already loads dotenv

const app: Express = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(config.mongodbUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    console.log('Server will continue running without database connection.');
  });

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statuses = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    status: 'ok',
    database: statuses[dbStatus] || 'unknown',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;
