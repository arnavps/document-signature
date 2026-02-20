import { api } from '@/lib/axios';
import { AuthResponse } from '@/types';

interface RegisterData {
    email: string;
    password: string;
    full_name?: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
};
