# Backend Setup Guide

## ✅ What's Been Created

The complete backend with:
- **Auth Module**: Register, login, JWT tokens, refresh tokens
- **Documents Module**: Upload, list, view, delete PDFs with Supabase Storage
- **Signatures Module**: Place signatures, finalize (burn into PDF with pdf-lib)
- **Middleware**: Authentication, file upload, error handling, rate limiting
- **Security**: Helmet, CORS, rate limiting, JWT validation

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Supabase
1. Go to https://supabase.com and create a new project
2. Copy your project URL and keys
3. In Supabase Dashboard → SQL Editor, run the entire `database-schema.sql` file
4. In Supabase Dashboard → Storage, create 3 buckets:
   - `documents`
   - `signed-documents`
   - `signatures`

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your values:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_ACCESS_SECRET=generate_random_string_here
JWT_REFRESH_SECRET=generate_different_random_string_here
```

### Step 4: Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 🧪 Test the API

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","full_name":"Test User"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

Save the `accessToken` from the response.

### Upload a PDF:
```bash
curl -X POST http://localhost:5000/api/docs/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/document.pdf"
```

## 📁 Backend Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication logic
│   │   ├── documents/      # Document management
│   │   └── signatures/     # Signature placement & finalization
│   ├── middleware/         # Auth, upload, error handling
│   ├── config/            # Env, Supabase, database config
│   ├── utils/             # JWT, password, logger utilities
│   ├── types/             # TypeScript interfaces
│   └── app.ts             # Express app entry point
└── package.json
```

## 🔐 Storage Bucket Policies

After creating buckets, set these policies in Supabase Dashboard → Storage → Policies:

**For `documents` bucket:**
```sql
-- Upload policy
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Read policy
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

Repeat similar policies for `signed-documents` and `signatures` buckets.

## ✨ Next Steps

Backend is ready! Now we can build the frontend with:
- React + Vite + TypeScript
- Tailwind CSS (Red/White theme)
- PDF viewer with drag-and-drop signatures
- Clean iLovePDF-style UI

Ready to proceed with the frontend?
