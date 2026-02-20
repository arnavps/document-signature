import { Layout } from '@/components/layout/Layout';
import { QuickActions } from '@/features/dashboard/components/QuickActions';
import { RecentDocuments } from '@/features/dashboard/components/RecentDocuments';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Manage your documents and signatures</p>
                </motion.div>

                <QuickActions />
                <RecentDocuments />
            </div>
        </Layout>
    );
};
