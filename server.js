import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Study Planner API is running on http://localhost:${port}`);
  });
} catch (error) {
  console.error(`Unable to start server: ${error.message}`);
  process.exit(1);
}