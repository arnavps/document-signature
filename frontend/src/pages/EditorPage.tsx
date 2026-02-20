import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PDFViewer } from '@/features/document-viewer/components/PDFViewer';
import { SignatureToolbar } from '@/features/document-viewer/components/SignatureToolbar';
import { signatureService } from '@/features/document-viewer/services/signature.service';
import { api } from '@/lib/axios';
import { Document } from '@/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePDFRenderer } from '@/features/document-viewer/hooks/usePDFRenderer';
import { useSignaturePlacement } from '@/features/document-viewer/hooks/useSignaturePlacement';
import { SignatureModal } from '@/features/document-viewer/components/SignatureModal';

export const EditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [document, setDocument] = useState<Document | null>(null);
    const [docLoading, setDocLoading] = useState(true);
    const [docError, setDocError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signingSignatureId, setSigningSignatureId] = useState<number | null>(null);

    // Initialize hooks here
    const {
        pdfInfo,
        currentPage,
        scale,
        loading: pdfLoading,
        error: pdfError,
        onDocumentLoadSuccess,
        onPageLoadSuccess,
        onDocumentLoadError,
        goToNextPage,
        goToPreviousPage,
        zoomIn,
        zoomOut,
        resetZoom,
    } = usePDFRenderer(document?.file_url || '');

    const {
        signatures,
        activeSignatureId,
        addSignature: addSignatureHook,
        updateSignature,
        removeSignature,
        setActiveSignatureId,
    } = useSignaturePlacement();

    useEffect(() => {
        if (id) {
            fetchDocument();
        }
    }, [id]);

    const fetchDocument = async () => {
        try {
            setDocLoading(true);
            const response = await api.get(`/docs/${id}`);
            setDocument(response.data.data);
            setDocLoading(false);
        } catch (err: any) {
            setDocError(err.response?.data?.message || 'Failed to load document');
            setDocLoading(false);
        }
    };

    const handleAddSignature = () => {
        addSignatureHook(currentPage);
    };

    const handleSignatureClick = (index: number | null) => {
        setActiveSignatureId(index);
        if (index !== null) {
            setSigningSignatureId(index);
            setIsModalOpen(true);
        }
    };

    const handleSaveSignatureCanvas = (dataUrl: string) => {
        if (signingSignatureId !== null) {
            updateSignature(signingSignatureId, { signatureDataUrl: dataUrl });
            setIsModalOpen(false);
            setSigningSignatureId(null);
        }
    };

    const handleSave = async () => {
        if (!document || !user) return;

        setIsSaving(true);
        try {
            // Save each signature to the backend
            // Ideally backend handles bulk insert/update, but adhering to existing pattern:
            for (const sig of signatures) {
                // Determine if it's already saved? Current hook doesn't track ID well for existing.
                // Assuming all are new or we just overwrite/place.
                await signatureService.placeSignature({
                    document_id: document.id,
                    signer_email: user.email,
                    signer_name: user.full_name,
                    position_x: sig.x,
                    position_y: sig.y,
                    width: sig.width,
                    height: sig.height,
                    page_number: sig.page,
                    signature_image_url: sig.signatureDataUrl,
                });
            }

            alert('Signatures saved successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save signatures');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalize = async () => {
        if (!document || !user) return;

        if (!window.confirm('Are you sure you want to finalize this document? This action cannot be undone.')) {
            return;
        }

        setIsFinalizing(true);
        try {
            // First save all signatures (implicit save before finalize)
            for (const sig of signatures) {
                await signatureService.placeSignature({
                    document_id: document.id,
                    signer_email: user.email,
                    signer_name: user.full_name,
                    position_x: sig.x,
                    position_y: sig.y,
                    width: sig.width,
                    height: sig.height,
                    page_number: sig.page,
                    signature_image_url: sig.signatureDataUrl,
                });
            }

            // Then finalize the document
            const result = await signatureService.finalizeSignature(document.id);

            // Download the signed document
            if (result.signed_file_url) {
                window.open(result.signed_file_url, '_blank');
            }

            alert('Document signed successfully!');
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to finalize document');
        } finally {
            setIsFinalizing(false);
        }
    };

    if (docLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (docError || !document) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Document</h2>
                        <p className="text-red-600 mb-4">{docError || 'Document not found'}</p>
                        <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="secondary">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Button
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                        variant="ghost"
                        size="sm"
                        className="mb-4 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {document.original_name}
                            </h1>
                            <p className="text-gray-600">
                                Place your signatures on the document, then finalize to download
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${document.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
              `}>
                                {document.status}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Toolbar */}
                <SignatureToolbar
                    currentPage={currentPage}
                    totalPages={pdfInfo?.numPages || 1}
                    scale={scale}
                    onAddSignature={handleAddSignature}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onResetZoom={resetZoom}
                    onPreviousPage={goToPreviousPage}
                    onNextPage={goToNextPage}
                    onSave={handleSave}
                    onFinalize={handleFinalize}
                    isSaving={isSaving}
                    isFinalizing={isFinalizing}
                    hasSignatures={signatures.length > 0}
                />

                {/* PDF Viewer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <PDFViewer
                        fileUrl={document.file_url}
                        currentPage={currentPage}
                        scale={scale}
                        signatures={signatures}
                        activeSignatureId={activeSignatureId}
                        onPageLoadSuccess={onPageLoadSuccess}
                        onDocumentLoadSuccess={onDocumentLoadSuccess}
                        onDocumentLoadError={onDocumentLoadError}
                        onSignatureUpdate={updateSignature}
                        onSignatureRemove={removeSignature}
                        onSignatureSelect={handleSignatureClick}
                        loading={pdfLoading}
                        error={pdfError}
                    />
                    {/* PDF Info moved here or kept in Viewer, but Viewer has structure for it. 
                        Actually PDFViewer implementation above kept the info display. 
                        We can keep it there. 
                     */}
                </motion.div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                    <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Click "Add Signature" to place a signature box on the current page</li>
                        <li>• Drag the signature box to position it where you want</li>
                        <li>• <strong>Click the signature box to sign it</strong></li>
                        <li>• Use zoom controls to adjust the view</li>
                        <li>• Click "Save Draft" to save your signature placements</li>
                        <li>• Click "Finalize & Download" to burn signatures into the PDF and download</li>
                    </ul>
                </motion.div>
            </div>

            <SignatureModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSigningSignatureId(null);
                }}
                onSave={handleSaveSignatureCanvas}
            />
        </Layout>
    );
};
