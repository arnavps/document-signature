import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/hooks/useAuth';
import { ROUTES } from './lib/constants';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { EditorPage } from './pages/EditorPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

function App() {
    const { checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.UPLOAD}
                    element={
                        <ProtectedRoute>
                            <UploadPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editor/:id"
                    element={
                        <ProtectedRoute>
                            <EditorPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
