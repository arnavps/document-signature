export const APP_NAME = 'SignDoc';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    UPLOAD: '/upload',
    EDITOR: '/editor/:id',
    PROFILE: '/profile',
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];

export const SIGNATURE_DEFAULTS = {
    WIDTH: 150,
    HEIGHT: 50,
    COLOR: '#E33636',
};
