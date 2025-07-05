import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { errorMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Error Middleware
app.use(errorMiddleware);

export default app;
