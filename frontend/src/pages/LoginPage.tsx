import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { APP_NAME, ROUTES } from '@/lib/constants';
import { motion } from 'framer-motion';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-soft p-8">
                    <LoginForm />
                </div>
            </motion.div>
        </div>
    );
};
