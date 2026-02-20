import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '@/lib/constants';

const registerSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');
            await registerUser(data.email, data.password, data.full_name);
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
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
                label="Full Name (Optional)"
                type="text"
                placeholder="John Doe"
                error={errors.full_name?.message}
                {...register('full_name')}
            />

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
                Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
};
