import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import './database';  // assuming this is a TypeScript or JavaScript file

dotenv.config();
console.log("xxxxxxxx", process.env.JWT_SECRET);

// Initialize express server
const server: Express = express();

// Middleware
server.use(express.json());
server.use(cors({
  origin: "http://localhost:5173"
}));

// To resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files
server.use(express.static(path.join(__dirname, 'public')));

// Import route handlers
import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';
import userRoutes from './routes/users';

// Use routes
server.use(authRoutes);
server.use(todoRoutes);
server.use(userRoutes);

// Start the server
server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
