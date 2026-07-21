// server/index.ts
import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import cameraPermissionRoutes from './routes/cameraPermissionRoutes';
import userRoutes from './routes/userRoutes';

const app: Express = express();
// Default to 4000 so the API does not collide with the Next.js dev server (3000).
const PORT = process.env.PORT || 4000;

// BE-8: CORS lockdown. ALLOWED_ORIGINS is a comma-separated list (see
// .env.example); falls back to the local Next.js dev ports if unset so
// local development keeps working with no .env changes.
const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:3001'];

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push(...DEFAULT_ALLOWED_ORIGINS);
}

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // No Origin header (server-to-server calls, curl, Postman) is allowed —
    // browsers always send Origin for cross-origin fetches, so this only
    // exempts non-browser clients, not cross-origin browser requests.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: origin "${origin}" is not allowed.`));
  },
  allowedHeaders: ['Content-Type', 'X-User-Id'],
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users', cameraPermissionRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message?.startsWith('CORS:')) {
    res.status(403).json({
      success: false,
      error: {
        code: 'CORS_FORBIDDEN',
        message: err.message,
      },
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
