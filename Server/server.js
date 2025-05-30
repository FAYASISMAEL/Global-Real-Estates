import express from 'express';
import cors from 'cors';
import { connectDB } from './connection.js';
import propertyRoutes from './Router/data_routes.js';
import premiumRoutes from './Router/premium_routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const app = express();
const PORT = 5000;

const file_name = fileURLToPath(import.meta.url);
const __dirname = dirname(file_name);

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/images', express.static(imagesDir));

const initializeServer = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.log('Warning: Server starting without MongoDB connection');
  }

  app.use('/api', propertyRoutes);
  app.use('/api/premium', premiumRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
};

initializeServer().catch(err => {
  console.error('Failed to start server:', err);
});