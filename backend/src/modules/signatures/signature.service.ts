import { supabase } from '../../config/supabase';
import { PDFDocument, rgb } from 'pdf-lib';
import { PlaceSignatureInput } from './signature.schema';
import { logger } from '../../utils/logger.util';

export class SignatureService {
    async placeSignature(userId: string, data: PlaceSignatureInput) {
        // Verify document belongs to user
        const { data: document } = await supabase
            .from('documents')
            .select('id')
            .eq('id', data.document_id)
            .eq('user_id', userId)
            .single();

        if (!document) {
            throw new Error('Document not found');
        }

        // Save signature placement
        const { data: signature, error } = await supabase
            .from('signatures')
            .insert({
                document_id: data.document_id,
                signer_email: data.signer_email,
                signer_name: data.signer_name,
                signature_image_url: data.signature_image_url,
                position_x: data.position_x,
                position_y: data.position_y,
                width: data.width,
                height: data.height,
                page_number: data.page_number,
                status: 'placed',
            })
            .select()
            .single();

        if (error) throw error;

        // Create audit log
        await supabase.from('audit_logs').insert({
            document_id: data.document_id,
            user_id: userId,
            action: 'signature_placed',
        });

        return signature;
    }

    async getSignaturesByDocument(userId: string, documentId: string) {
        // Verify document belongs to user
        const { data: document } = await supabase
            .from('documents')
            .select('id')
            .eq('id', documentId)
            .eq('user_id', userId)
            .single();

        if (!document) {
            throw new Error('Document not found');
        }

        const { data, error } = await supabase
            .from('signatures')
            .select('*')
            .eq('document_id', documentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async finalizeSignature(userId: string, documentId: string) {
        try {
            // Get document
            const { data: document } = await supabase
                .from('documents')
                .select('*')
                .eq('id', documentId)
                .eq('user_id', userId)
                .single();

            if (!document) {
                throw new Error('Document not found');
            }

            // Get all signatures for this document
            const { data: signatures } = await supabase
                .from('signatures')
                .select('*')
                .eq('document_id', documentId)
                .eq('status', 'placed');

            if (!signatures || signatures.length === 0) {
                throw new Error('No signatures to finalize');
            }

            // Download original PDF
            const pdfUrl = document.file_url;
            const response = await fetch(pdfUrl);
            const pdfBuffer = await response.arrayBuffer();

            // Load PDF
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const pages = pdfDoc.getPages();

            // Add signatures to PDF
            for (const sig of signatures) {
                const page = pages[sig.page_number - 1];
                if (!page) continue;

                const { width: pageWidth, height: pageHeight } = page.getSize();

                // If a signature image URL (base64) exists, embed it
                if (sig.signature_image_url && sig.signature_image_url.startsWith('data:image/png;base64,')) {
                    try {
                        const imageBytes = sig.signature_image_url.split(',')[1];
                        const pngImage = await pdfDoc.embedPng(imageBytes);

                        page.drawImage(pngImage, {
                            x: sig.position_x,
                            y: pageHeight - sig.position_y - sig.height,
                            width: sig.width,
                            height: sig.height,
                        });
                    } catch (error) {
                        logger.error('Failed to embed signature image:', error);
                        // Fallback to text if image embedding fails
                        page.drawRectangle({
                            x: sig.position_x,
                            y: pageHeight - sig.position_y - sig.height,
                            width: sig.width,
                            height: sig.height,
                            borderColor: rgb(0.89, 0.21, 0.21), // #E33636
                            borderWidth: 2,
                        });
                    }
                } else {
                    // Fallback: Draw signature box
                    page.drawRectangle({
                        x: sig.position_x,
                        y: pageHeight - sig.position_y - sig.height,
                        width: sig.width,
                        height: sig.height,
                        borderColor: rgb(0.89, 0.21, 0.21), // #E33636
                    });
                }

                // Add signer name
                page.drawText(sig.signer_name || sig.signer_email, {
                    x: sig.position_x + 5,
                    y: pageHeight - sig.position_y - sig.height / 2,
                    size: 10,
                    color: rgb(0, 0, 0),
                });

                // Add timestamp
                const timestamp = new Date().toLocaleString();
                page.drawText(`Signed: ${timestamp}`, {
                    x: sig.position_x + 5,
                    y: pageHeight - sig.position_y - sig.height / 2 - 15,
                    size: 8,
                    color: rgb(0.5, 0.5, 0.5),
                });
            }

            // Save modified PDF
            const signedPdfBytes = await pdfDoc.save();

            // Upload signed PDF
            const timestamp = Date.now();
            const signedFilename = `${userId}/signed-${timestamp}-${document.original_name}`;

            const { error: uploadError } = await supabase.storage
                .from('signed-documents')
                .upload(signedFilename, signedPdfBytes, {
                    contentType: 'application/pdf',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('signed-documents')
                .getPublicUrl(signedFilename);

            // Update document
            const { data: updatedDoc, error: updateError } = await supabase
                .from('documents')
                .update({
                    signed_file_url: urlData.publicUrl,
                    status: 'signed',
                })
                .eq('id', documentId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Update signatures
            await supabase
                .from('signatures')
                .update({
                    status: 'finalized',
                    signed_at: new Date().toISOString(),
                })
                .eq('document_id', documentId);

            // Create audit log
            await supabase.from('audit_logs').insert({
                document_id: documentId,
                user_id: userId,
                action: 'signature_finalized',
            });

            return updatedDoc;
        } catch (error: any) {
            logger.error('Finalize signature error:', error);
            throw new Error('Failed to finalize signature');
        }
    }

    async deleteSignature(userId: string, signatureId: string) {
        // Verify signature belongs to user's document
        const { data: signature } = await supabase
            .from('signatures')
            .select('document_id, documents(user_id)')
            .eq('id', signatureId)
            .single();

        if (!signature || (signature.documents as any)?.user_id !== userId) {
            throw new Error('Signature not found');
        }

        const { error } = await supabase
            .from('signatures')
            .delete()
            .eq('id', signatureId);

        if (error) throw error;
    }
}
