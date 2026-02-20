import { Response } from 'express';
import { AuthRequest } from '../../types';
import { SignatureService } from './signature.service';
import { placeSignatureSchema, finalizeSignatureSchema } from './signature.schema';

const signatureService = new SignatureService();

export class SignatureController {
    async placeSignature(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const validatedData = placeSignatureSchema.parse(req.body);

            const signature = await signatureService.placeSignature(userId, validatedData);

            res.status(201).json({
                success: true,
                message: 'Signature placed successfully',
                data: signature,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to place signature',
            });
        }
    }

    async getSignaturesByDocument(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const documentId = req.params.documentId;

            const signatures = await signatureService.getSignaturesByDocument(userId, documentId);

            res.status(200).json({
                success: true,
                data: signatures,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Signatures not found',
            });
        }
    }

    async finalizeSignature(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const validatedData = finalizeSignatureSchema.parse(req.body);

            const result = await signatureService.finalizeSignature(
                userId,
                validatedData.document_id
            );

            res.status(200).json({
                success: true,
                message: 'Document signed successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to finalize signature',
            });
        }
    }

    async deleteSignature(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const signatureId = req.params.id;

            await signatureService.deleteSignature(userId, signatureId);

            res.status(200).json({
                success: true,
                message: 'Signature deleted successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete signature',
            });
        }
    }
}
