import { Response } from 'express';
import { AuthRequest } from '../../types';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.schema';

const authService = new AuthService();

export class AuthController {
    async register(req: AuthRequest, res: Response) {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await authService.register(validatedData);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed',
            });
        }
    }

    async login(req: AuthRequest, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || 'Login failed',
            });
        }
    }

    async refreshToken(req: AuthRequest, res: Response) {
        try {
            const validatedData = refreshTokenSchema.parse(req.body);
            const result = await authService.refreshToken(validatedData.refreshToken);

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || 'Token refresh failed',
            });
        }
    }

    async getProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const user = await authService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'User not found',
            });
        }
    }
}
