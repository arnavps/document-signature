import { api } from '@/lib/axios';
import { Document } from '@/types';

export const uploadService = {
    uploadDocument: async (file: File): Promise<Document> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/docs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};
