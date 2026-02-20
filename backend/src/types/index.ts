import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export interface JWTPayload {
    id: string;
    email: string;
}

export type DocumentStatus = 'pending' | 'signed' | 'expired' | 'cancelled';
export type SignatureStatus = 'placed' | 'finalized';
export type AuditAction =
    | 'document_uploaded'
    | 'document_viewed'
    | 'signature_placed'
    | 'signature_finalized'
    | 'document_downloaded'
    | 'document_deleted';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    full_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Document {
    id: string;
    user_id: string;
    file_url: string;
    original_name: string;
    file_size: number;
    page_count: number;
    status: DocumentStatus;
    signed_file_url?: string;
    created_at: Date;
    updated_at: Date;
    expires_at?: Date;
}

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
    signed_at?: Date;
    created_at: Date;
}

export interface AuditLog {
    id: string;
    document_id?: string;
    user_id?: string;
    action: AuditAction;
    ip_address?: string;
    user_agent?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}
