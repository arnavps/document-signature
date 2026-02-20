import { Upload, FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants';
import { motion } from 'framer-motion';

export const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: Upload,
            title: 'Upload Document',
            description: 'Upload a PDF to sign',
            color: 'bg-primary',
            onClick: () => navigate(ROUTES.UPLOAD),
        },
        {
            icon: FileSignature,
            title: 'Sign Request',
            description: 'Request signatures from others',
            color: 'bg-blue-500',
            onClick: () => alert('Coming soon!'),
        },
    ];

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {actions.map((action, index) => (
                    <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className="cursor-pointer group hover:scale-105 transition-transform"
                            onClick={action.onClick}
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                                    <p className="text-sm text-gray-500">{action.description}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
