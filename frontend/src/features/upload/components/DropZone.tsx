import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    isUploading?: boolean;
}

export const DropZone = ({ onFileSelect, isUploading }: DropZoneProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const validateFile = (file: File): boolean => {
        setError('');

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError('Only PDF files are allowed');
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError('File size must be less than 10MB');
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            setSelectedFile(file);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleUpload = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setError('');
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
              relative border-4 border-dashed rounded-2xl p-12 text-center transition-all
              ${isDragging ? 'border-primary bg-primary-50 scale-105' : 'border-gray-300 hover:border-gray-400'}
            `}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="pointer-events-none">
                            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Upload className="w-10 h-10 text-primary" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Drop your PDF here
                            </h3>
                            <p className="text-gray-500 mb-6">
                                or click to browse from your computer
                            </p>

                            <div className="text-sm text-gray-400">
                                Maximum file size: 10MB
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl border-2 border-gray-200 p-8"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate mb-1">
                                    {selectedFile.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={handleRemove}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <Button
                            onClick={handleUpload}
                            className="w-full"
                            size="lg"
                            isLoading={isUploading}
                        >
                            Upload & Continue
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};
