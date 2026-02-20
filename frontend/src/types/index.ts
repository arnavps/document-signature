export interface User {
    id: string;
    email: string;
    full_name?: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export type DocumentStatus = 'pending' | 'signed' | 'expired' | 'cancelled';

export interface Document {
    id: string;
    user_id: string;
    file_url: string;
    original_name: string;
    file_size: number;
    page_count: number;
    status: DocumentStatus;
    signed_file_url?: string;
    created_at: string;
    updated_at: string;
    expires_at?: string;
}

export type SignatureStatus = 'placed' | 'finalized';

export interface Signature {
    id: string;
    document_id: string;
    signer_email: string;
    signer_name?: string;
    signature_image_url?: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    page_number: number;
    status: SignatureStatus;
    signed_at?: string;
    created_at: string;
}

export interface SignaturePosition {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
}
