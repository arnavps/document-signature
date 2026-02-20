# Document Signature App - Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_ACCESS_SECRET`: Random secret for access tokens
- `JWT_REFRESH_SECRET`: Random secret for refresh tokens

### 3. Setup Supabase

1. Create a new Supabase project
2. Run the SQL schema from `../database-schema.sql` in the SQL Editor
3. Create three storage buckets:
   - `documents` (private)
   - `signed-documents` (public or private)
   - `signatures` (private)

4. Set storage policies for each bucket (example for documents):
```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Build for Production
```bash
npm run build
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile (protected)

### Documents
- `POST /api/docs/upload` - Upload PDF (protected)
- `GET /api/docs` - Get all user documents (protected)
- `GET /api/docs/:id` - Get document by ID (protected)
- `DELETE /api/docs/:id` - Delete document (protected)
- `PATCH /api/docs/:id/status` - Update document status (protected)

### Signatures
- `POST /api/signatures` - Place signature on document (protected)
- `GET /api/signatures/document/:documentId` - Get signatures for document (protected)
- `POST /api/signatures/finalize` - Finalize and burn signatures into PDF (protected)
- `DELETE /api/signatures/:id` - Delete signature (protected)

## Project Structure
```
src/
├── modules/          # Feature modules (MVC pattern)
│   ├── auth/
│   ├── documents/
│   └── signatures/
├── middleware/       # Express middleware
├── config/          # Configuration files
├── utils/           # Utility functions
├── types/           # TypeScript types
└── app.ts           # Main application file
```
