import { Plus, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface SignatureToolbarProps {
    currentPage: number;
    totalPages: number;
    scale: number;
    onAddSignature: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onSave: () => void;
    onFinalize: () => void;
    isSaving?: boolean;
    isFinalizing?: boolean;
    hasSignatures?: boolean;
}

export const SignatureToolbar = ({
    currentPage,
    totalPages,
    scale,
    onAddSignature,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onPreviousPage,
    onNextPage,
    onSave,
    onFinalize,
    isSaving,
    isFinalizing,
    hasSignatures,
}: SignatureToolbarProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-soft p-4 mb-6"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left: Signature Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onAddSignature}
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Signature
                    </Button>

                    <div className="h-6 w-px bg-gray-300 mx-2" />

                    <Button
                        onClick={onSave}
                        variant="secondary"
                        size="sm"
                        isLoading={isSaving}
                        disabled={!hasSignatures}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Draft
                    </Button>

                    <Button
                        onClick={onFinalize}
                        variant="primary"
                        size="sm"
                        isLoading={isFinalizing}
                        disabled={!hasSignatures}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <Download className="w-4 h-4" />
                        Finalize & Download
                    </Button>
                </div>

                {/* Center: Page Navigation */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onPreviousPage}
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                        Page {currentPage} / {totalPages}
                    </span>

                    <Button
                        onClick={onNextPage}
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Right: Zoom Controls */}
                <div className="flex items-center gap-2">
                    <Button onClick={onZoomOut} variant="secondary" size="sm" disabled={scale <= 0.5}>
                        <ZoomOut className="w-4 h-4" />
                    </Button>

                    <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>

                    <Button onClick={onZoomIn} variant="secondary" size="sm" disabled={scale >= 3}>
                        <ZoomIn className="w-4 h-4" />
                    </Button>

                    <Button onClick={onResetZoom} variant="secondary" size="sm" title="Reset Zoom">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
