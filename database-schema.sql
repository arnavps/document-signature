-- ============================================
-- Document Signature App - Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TYPE document_status AS ENUM ('pending', 'signed', 'expired', 'cancelled');

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    page_count INTEGER DEFAULT 1,
    status document_status DEFAULT 'pending',
    signed_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- ============================================
-- SIGNATURES TABLE
-- ============================================
CREATE TYPE signature_status AS ENUM ('placed', 'finalized');

CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    signer_email VARCHAR(255) NOT NULL,
    signer_name VARCHAR(255),
    signature_image_url TEXT,
    position_x DECIMAL(10, 4) NOT NULL,
    position_y DECIMAL(10, 4) NOT NULL,
    width DECIMAL(10, 4) DEFAULT 150,
    height DECIMAL(10, 4) DEFAULT 50,
    page_number INTEGER NOT NULL DEFAULT 1,
    status signature_status DEFAULT 'placed',
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_signatures_document_id ON signatures(document_id);
CREATE INDEX idx_signatures_signer_email ON signatures(signer_email);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TYPE audit_action AS ENUM (
    'document_uploaded',
    'document_viewed',
    'signature_placed',
    'signature_finalized',
    'document_downloaded',
    'document_deleted'
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_document_id ON audit_logs(document_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can only see their own documents
CREATE POLICY documents_select_own ON documents
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY documents_insert_own ON documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY documents_update_own ON documents
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY documents_delete_own ON documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- Signatures are viewable by document owner
CREATE POLICY signatures_select_by_document_owner ON signatures
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = signatures.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- Audit logs are viewable by document owner
CREATE POLICY audit_logs_select_by_document_owner ON audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents
            WHERE documents.id = audit_logs.document_id
            AND documents.user_id = auth.uid()
        )
    );

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- ============================================
-- Create two storage buckets:
-- 1. 'documents' - for original PDFs
-- 2. 'signed-documents' - for finalized signed PDFs
-- 3. 'signatures' - for signature images

-- Storage policies (to be set in Supabase Dashboard):
-- - Users can upload to their own folder: user_id/*
-- - Users can read their own files
-- - Signed documents are publicly readable (optional)
