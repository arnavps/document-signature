import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '../services/auth.service';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, full_name?: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    login: async (email, password) => {
        const response = await authService.login({ email, password });
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        set({ user: response.user, isAuthenticated: true });
    },

    register: async (email, password, full_name) => {
        const response = await authService.register({ email, password, full_name });
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        set({ user: response.user, isAuthenticated: true });
    },

    logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                set({ isLoading: false });
                return;
            }

            const user = await authService.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
