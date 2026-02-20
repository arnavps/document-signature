import { FileText, Download, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Document } from '@/types';
import { motion } from 'framer-motion';

interface DocumentCardProps {
    document: Document;
    onDelete: (id: string) => void;
}

export const DocumentCard = ({ document, onDelete }: DocumentCardProps) => {
    const navigate = useNavigate();

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'signed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'expired':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <Card className="group">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate mb-1">
                            {document.original_name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{formatFileSize(document.file_size)}</span>
                            <span>•</span>
                            <span>{formatDate(document.created_at)}</span>
                        </div>
                        <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                                {document.status}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {document.status === 'pending' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/editor/${document.id}`)}
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        )}
                        {document.signed_file_url && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(document.signed_file_url, '_blank')}
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(document.id)}
                            title="Delete"
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
