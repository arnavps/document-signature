import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '@/lib/constants';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            await login(data.email, data.password);
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
            >
                Sign In
            </Button>

            <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="text-primary font-medium hover:underline">
                    Sign up
                </Link>
            </p>
        </form>
    );
};
