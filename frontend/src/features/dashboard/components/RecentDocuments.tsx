import { useEffect } from 'react';
import { DocumentCard } from './DocumentCard';
import { useDocuments } from '../hooks/useDocuments';
import { motion } from 'framer-motion';
import { FileX } from 'lucide-react';

export const RecentDocuments = () => {
    const { documents, loading, fetchDocuments, deleteDocument } = useDocuments();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            await deleteDocument(id);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
            >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileX className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-500">Upload your first PDF to get started</p>
            </motion.div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Documents</h2>
            <div className="space-y-4">
                {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
};
