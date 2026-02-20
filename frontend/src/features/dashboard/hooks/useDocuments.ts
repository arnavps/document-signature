import { create } from 'zustand';
import { Document } from '@/types';
import { api } from '@/lib/axios';

interface DocumentsState {
    documents: Document[];
    loading: boolean;
    error: string | null;
    fetchDocuments: () => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
}

export const useDocuments = create<DocumentsState>((set, get) => ({
    documents: [],
    loading: false,
    error: null,

    fetchDocuments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/docs');
            set({ documents: response.data.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteDocument: async (id: string) => {
        try {
            await api.delete(`/docs/${id}`);
            set({ documents: get().documents.filter((doc) => doc.id !== id) });
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
