import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { APP_NAME, ROUTES } from '@/lib/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
                    </Link>

                    {/* User Menu */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
