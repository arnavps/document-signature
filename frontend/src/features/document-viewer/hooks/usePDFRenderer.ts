import { useState } from 'react';
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFInfo {
    numPages: number;
    pageWidth: number;
    pageHeight: number;
}

export const usePDFRenderer = (_fileUrl: string) => {
    const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setPdfInfo({ numPages, pageWidth: 0, pageHeight: 0 });
        setLoading(false);
    };

    const onPageLoadSuccess = (page: any) => {
        const viewport = page.getViewport({ scale: 1 });
        setPdfInfo((prev) => ({
            numPages: prev?.numPages || 1,
            pageWidth: viewport.width,
            pageHeight: viewport.height,
        }));
    };

    const onDocumentLoadError = (error: Error) => {
        setError(error.message);
        setLoading(false);
    };

    const goToNextPage = () => {
        if (pdfInfo && currentPage < pdfInfo.numPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const resetZoom = () => {
        setScale(1.0);
    };

    return {
        pdfInfo,
        currentPage,
        scale,
        loading,
        error,
        onDocumentLoadSuccess,
        onPageLoadSuccess,
        onDocumentLoadError,
        goToNextPage,
        goToPreviousPage,
        zoomIn,
        zoomOut,
        resetZoom,
        setCurrentPage,
    };
};
