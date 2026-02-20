import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    supabase: {
        url: process.env.SUPABASE_URL!,
        anonKey: process.env.SUPABASE_ANON_KEY!,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    cors: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    },

    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['application/pdf'],
    },
};

// Validate required env vars
const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
