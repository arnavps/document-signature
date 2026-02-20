import { Response } from 'express';
import { AuthRequest } from '../../types';
import { DocumentService } from './document.service';
import { updateStatusSchema } from './document.schema';

const documentService = new DocumentService();

export class DocumentController {
    async uploadDocument(req: AuthRequest, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            const userId = req.user!.id;
            const result = await documentService.uploadDocument(userId, req.file);

            res.status(201).json({
                success: true,
                message: 'Document uploaded successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Upload failed',
            });
        }
    }

    async getDocuments(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const documents = await documentService.getDocuments(userId);

            res.status(200).json({
                success: true,
                data: documents,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch documents',
            });
        }
    }

    async getDocumentById(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const documentId = req.params.id;

            const document = await documentService.getDocumentById(userId, documentId);

            res.status(200).json({
                success: true,
                data: document,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Document not found',
            });
        }
    }

    async deleteDocument(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const documentId = req.params.id;

            await documentService.deleteDocument(userId, documentId);

            res.status(200).json({
                success: true,
                message: 'Document deleted successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete document',
            });
        }
    }

    async updateStatus(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const documentId = req.params.id;
            const validatedData = updateStatusSchema.parse(req.body);

            const document = await documentService.updateStatus(
                userId,
                documentId,
                validatedData.status
            );

            res.status(200).json({
                success: true,
                message: 'Status updated successfully',
                data: document,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update status',
            });
        }
    }
}
