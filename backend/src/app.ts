import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { logger } from './utils/logger.util';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import documentRoutes from './modules/documents/document.routes';
import signatureRoutes from './modules/signatures/signature.routes';
import path from 'path';

const app = express();

// Security middleware
app.use(helmet());

const stripTrailingSlash = (url: string) => url.endsWith('/') ? url.slice(0, -1) : url;
const allowedOrigin = stripTrailingSlash(config.cors.frontendUrl);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const requestOrigin = stripTrailingSlash(origin);
        if (requestOrigin === allowedOrigin || requestOrigin === 'http://localhost:5173') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/docs', documentRoutes);
app.use('/api/signatures', signatureRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Serve frontend in production
if (config.nodeEnv === 'production') {
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${config.nodeEnv}`);
    logger.info(`🌐 CORS enabled for: ${config.cors.frontendUrl}`);
});

export default app;
