import { api } from '@/lib/axios';
import { Signature } from '@/types';

interface PlaceSignatureData {
    document_id: string;
    signer_email: string;
    signer_name?: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    page_number: number;
    signature_image_url?: string;
}

export const signatureService = {
    placeSignature: async (data: PlaceSignatureData): Promise<Signature> => {
        const response = await api.post('/signatures', data);
        return response.data.data;
    },

    getSignatures: async (documentId: string): Promise<Signature[]> => {
        const response = await api.get(`/signatures/document/${documentId}`);
        return response.data.data;
    },

    finalizeSignature: async (documentId: string) => {
        const response = await api.post('/signatures/finalize', { document_id: documentId });
        return response.data.data;
    },

    deleteSignature: async (signatureId: string) => {
        await api.delete(`/signatures/${signatureId}`);
    },
};
