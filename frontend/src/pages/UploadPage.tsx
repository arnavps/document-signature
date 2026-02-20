import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DropZone } from '@/features/upload/components/DropZone';
import { uploadService } from '@/features/upload/services/upload.service';
import { motion } from 'framer-motion';

export const UploadPage = () => {
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = async (file: File) => {
        setIsUploading(true);
        setError('');

        try {
            const document = await uploadService.uploadDocument(file);
            navigate(`/editor/${document.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Upload failed');
            setIsUploading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Document</h1>
                    <p className="text-gray-600">Upload a PDF file to add your signature</p>
                </motion.div>

                <DropZone onFileSelect={handleFileSelect} isUploading={isUploading} />

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};
