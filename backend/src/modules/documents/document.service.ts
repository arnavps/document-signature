import { supabase } from '../../config/supabase';
import { DocumentStatus } from '../../types';
import { logger } from '../../utils/logger.util';
import { PDFDocument } from 'pdf-lib';

export class DocumentService {
    async uploadDocument(userId: string, file: Express.Multer.File) {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const filename = `${userId}/${timestamp}-${file.originalname}`;

            // Load PDF to get page count
            const pdfDoc = await PDFDocument.load(file.buffer);
            const pageCount = pdfDoc.getPageCount();

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('documents')
                .getPublicUrl(filename);

            // Save document metadata to database
            const { data: document, error: dbError } = await supabase
                .from('documents')
                .insert({
                    user_id: userId,
                    file_url: urlData.publicUrl,
                    original_name: file.originalname,
                    file_size: file.size,
                    page_count: pageCount,
                    status: 'pending',
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // Create audit log
            await this.createAuditLog(document.id, userId, 'document_uploaded');

            return document;
        } catch (error) {
            logger.error('Upload error:', error);
            throw new Error('Failed to upload document');
        }
    }

    async getDocuments(userId: string) {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async getDocumentById(userId: string, documentId: string) {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            throw new Error('Document not found');
        }

        // Create audit log
        await this.createAuditLog(documentId, userId, 'document_viewed');

        return data;
    }

    async deleteDocument(userId: string, documentId: string) {
        // Get document
        const { data: document } = await supabase
            .from('documents')
            .select('file_url')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (!document) {
            throw new Error('Document not found');
        }

        // Extract filename from URL
        const filename = document.file_url.split('/').pop();

        // Delete from storage
        if (filename) {
            await supabase.storage.from('documents').remove([`${userId}/${filename}`]);
        }

        // Delete from database
        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId)
            .eq('user_id', userId);

        if (error) throw error;

        // Create audit log
        await this.createAuditLog(documentId, userId, 'document_deleted');
    }

    async updateStatus(userId: string, documentId: string, status: DocumentStatus) {
        const { data, error } = await supabase
            .from('documents')
            .update({ status })
            .eq('id', documentId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    private async createAuditLog(
        documentId: string,
        userId: string,
        action: 'document_uploaded' | 'document_viewed' | 'document_deleted'
    ) {
        await supabase.from('audit_logs').insert({
            document_id: documentId,
            user_id: userId,
            action,
        });
    }
}
