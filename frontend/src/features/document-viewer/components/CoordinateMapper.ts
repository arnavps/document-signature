/**
 * Coordinate Mapper Utility
 * Converts DOM coordinates to PDF coordinates
 */

interface PDFDimensions {
    width: number;
    height: number;
}

interface DOMPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface PDFPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class CoordinateMapper {
    /**
     * Convert DOM coordinates to PDF coordinates
     * 
     * PDF coordinate system:
     * - Origin (0,0) is at bottom-left
     * - Y increases upward
     * 
     * DOM coordinate system:
     * - Origin (0,0) is at top-left
     * - Y increases downward
     */
    static domToPDF(
        domPosition: DOMPosition,
        pdfDimensions: PDFDimensions,
        containerDimensions: PDFDimensions,
        scale: number = 1
    ): PDFPosition {
        // Calculate the scale factor between rendered size and actual PDF size
        const scaleX = pdfDimensions.width / (containerDimensions.width * scale);
        const scaleY = pdfDimensions.height / (containerDimensions.height * scale);

        // Convert DOM coordinates to PDF coordinates
        const pdfX = domPosition.x * scaleX;
        const pdfY = pdfDimensions.height - (domPosition.y * scaleY) - (domPosition.height * scaleY);
        const pdfWidth = domPosition.width * scaleX;
        const pdfHeight = domPosition.height * scaleY;

        return {
            x: Math.round(pdfX * 100) / 100,
            y: Math.round(pdfY * 100) / 100,
            width: Math.round(pdfWidth * 100) / 100,
            height: Math.round(pdfHeight * 100) / 100,
        };
    }

    /**
     * Convert PDF coordinates to DOM coordinates
     * Used for rendering existing signatures
     */
    static pdfToDOM(
        pdfPosition: PDFPosition,
        pdfDimensions: PDFDimensions,
        containerDimensions: PDFDimensions,
        scale: number = 1
    ): DOMPosition {
        const scaleX = (containerDimensions.width * scale) / pdfDimensions.width;
        const scaleY = (containerDimensions.height * scale) / pdfDimensions.height;

        const domX = pdfPosition.x * scaleX;
        const domY = (pdfDimensions.height - pdfPosition.y - pdfPosition.height) * scaleY;
        const domWidth = pdfPosition.width * scaleX;
        const domHeight = pdfPosition.height * scaleY;

        return {
            x: Math.round(domX * 100) / 100,
            y: Math.round(domY * 100) / 100,
            width: Math.round(domWidth * 100) / 100,
            height: Math.round(domHeight * 100) / 100,
        };
    }

    /**
     * Constrain position within bounds
     */
    static constrainToBounds(
        position: DOMPosition,
        bounds: PDFDimensions
    ): DOMPosition {
        return {
            x: Math.max(0, Math.min(position.x, bounds.width - position.width)),
            y: Math.max(0, Math.min(position.y, bounds.height - position.height)),
            width: position.width,
            height: position.height,
        };
    }
}
