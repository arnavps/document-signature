import { supabase } from '../../config/supabase';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.util';
import { RegisterInput, LoginInput } from './auth.schema';
import { User } from '../../types';

export class AuthService {
    async register(data: RegisterInput) {
        const { email, password, full_name } = data;

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                email,
                password_hash,
                full_name,
            })
            .select('id, email, full_name, created_at')
            .single();

        if (error) throw error;

        // Generate tokens
        const accessToken = generateAccessToken({ id: newUser.id, email: newUser.email });
        const refreshToken = generateRefreshToken({ id: newUser.id, email: newUser.email });

        return {
            user: newUser,
            accessToken,
            refreshToken,
        };
    }

    async login(data: LoginInput) {
        const { email, password } = data;

        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password_hash);

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                created_at: user.created_at,
            },
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(token: string) {
        try {
            const decoded = verifyRefreshToken(token);

            // Verify user still exists
            const { data: user, error } = await supabase
                .from('users')
                .select('id, email')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                throw new Error('User not found');
            }

            // Generate new tokens
            const accessToken = generateAccessToken({ id: user.id, email: user.email });
            const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async getProfile(userId: string) {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, full_name, created_at')
            .eq('id', userId)
            .single();

        if (error || !user) {
            throw new Error('User not found');
        }

        return user;
    }
}
