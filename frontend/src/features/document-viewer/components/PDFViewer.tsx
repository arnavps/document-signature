import { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableSignature } from './DraggableSignature';
import { CoordinateMapper } from './CoordinateMapper';
import { AnimatePresence } from 'framer-motion';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
    fileUrl: string;
    currentPage: number;
    scale: number;
    signatures: any[];
    activeSignatureId: number | null;
    onPageLoadSuccess: (page: any) => void;
    onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
    onDocumentLoadError: (error: Error) => void;
    onSignatureUpdate: (index: number, position: any) => void;
    onSignatureRemove: (index: number) => void;
    onSignatureSelect: (index: number | null) => void;
    loading?: boolean;
    error?: string | null;
}

export const PDFViewer = ({
    fileUrl,
    currentPage,
    scale,
    signatures,
    activeSignatureId,
    onPageLoadSuccess,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    onSignatureUpdate,
    onSignatureRemove,
    onSignatureSelect,
    loading = true,
    error = null,
}: PDFViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const signatureIndex = parseInt(active.id.toString().split('-')[1]);
        const signature = signatures[signatureIndex];

        if (signature) {
            const newPosition = {
                x: signature.x + delta.x,
                y: signature.y + delta.y,
            };

            // Constrain to bounds
            if (containerDimensions.width && containerDimensions.height) {
                const constrained = CoordinateMapper.constrainToBounds(
                    { ...newPosition, width: signature.width, height: signature.height },
                    containerDimensions
                );
                onSignatureUpdate(signatureIndex, constrained);
            } else {
                onSignatureUpdate(signatureIndex, newPosition);
            }
        }
    };

    const handlePageRender = (page: any) => {
        onPageLoadSuccess(page);
        const canvas = containerRef.current?.querySelector('canvas');
        if (canvas) {
            setContainerDimensions({
                width: canvas.width / window.devicePixelRatio,
                height: canvas.height / window.devicePixelRatio,
            });
        }
    };

    const currentPageSignatures = signatures
        .map((sig, index) => ({ ...sig, index }))
        .filter((sig) => sig.page === currentPage);

    if (error) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2">Failed to load PDF</p>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="relative bg-gray-100 rounded-lg overflow-auto"
                style={{ maxHeight: '70vh' }}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    }
                >
                    <div className="relative inline-block">
                        <Page
                            pageNumber={currentPage}
                            scale={scale}
                            onRenderSuccess={handlePageRender}
                            className="shadow-lg"
                        />

                        {/* Signature Overlay */}
                        {!loading && containerDimensions.width > 0 && (
                            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="relative w-full h-full pointer-events-auto">
                                        <AnimatePresence>
                                            {currentPageSignatures.map((sig) => (
                                                <DraggableSignature
                                                    key={`signature-${sig.index}`}
                                                    id={`signature-${sig.index}`}
                                                    index={sig.index}
                                                    x={sig.x}
                                                    y={sig.y}
                                                    width={sig.width}
                                                    height={sig.height}
                                                    isActive={activeSignatureId === sig.index}
                                                    onRemove={() => onSignatureRemove(sig.index)}
                                                    onClick={() => onSignatureSelect(sig.index)}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </DndContext>
                        )}
                    </div>
                </Document>
            </div>
        </div>
    );
};
