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

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.cors.frontendUrl,
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

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${config.nodeEnv}`);
    logger.info(`🌐 CORS enabled for: ${config.cors.frontendUrl}`);
});

export default app;
