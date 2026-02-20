# Frontend Setup Guide

## ✅ What's Been Created

Complete frontend foundation with:
- **Authentication**: Login/Register with JWT, auto-refresh tokens
- **Dashboard**: iLovePDF-style UI with quick actions and document cards
- **Upload**: Drag-and-drop file upload with validation
- **Routing**: Protected routes, navigation
- **UI Components**: Button, Input, Card with Tailwind
- **State Management**: Zustand for auth and documents
- **Animations**: Framer Motion for smooth transitions

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

This installs:
- React, React Router, TypeScript
- Tailwind CSS, Framer Motion
- Axios, Zustand
- React Hook Form, Zod
- Lucide React (icons)
- react-pdf, pdf-lib, dnd-kit (for Phase 3)

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Run Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎨 UI Preview

### Login/Register Pages
- Clean centered form
- Red primary color (#E33636)
- Form validation with error messages
- Auto-redirect if already logged in

### Dashboard
- **Quick Actions**: Large icon cards for Upload, Sign Request
- **Recent Documents**: List of uploaded PDFs with status badges
- Document actions: Edit (pending), Download (signed), Delete

### Upload Page
- Oversized drag-and-drop zone
- File validation (PDF only, 10MB max)
- File preview before upload
- Progress indicator

## 📁 Key Files

### Authentication
- `src/features/auth/hooks/useAuth.ts` - Auth state management
- `src/features/auth/services/auth.service.ts` - API calls
- `src/features/auth/components/LoginForm.tsx` - Login UI
- `src/features/auth/components/RegisterForm.tsx` - Register UI

### Dashboard
- `src/features/dashboard/components/QuickActions.tsx` - Action cards
- `src/features/dashboard/components/DocumentCard.tsx` - Document item
- `src/features/dashboard/components/RecentDocuments.tsx` - Document list
- `src/features/dashboard/hooks/useDocuments.ts` - Documents state

### Upload
- `src/features/upload/components/DropZone.tsx` - Drag-and-drop UI
- `src/features/upload/services/upload.service.ts` - Upload API

### Shared
- `src/components/layout/Layout.tsx` - Page wrapper
- `src/components/layout/Navbar.tsx` - Top navigation
- `src/components/ui/Button.tsx` - Button component
- `src/components/ui/Input.tsx` - Input component
- `src/components/ui/Card.tsx` - Card component

## 🎯 Current Features

✅ User registration and login
✅ JWT token management with auto-refresh
✅ Protected routes
✅ Dashboard with document list
✅ File upload with drag-and-drop
✅ Document CRUD operations
✅ Responsive design
✅ Smooth animations

## 🔜 Phase 3: PDF Editor

Next, we'll build the document editor with:
1. **PDF Viewer** - Render PDF with react-pdf
2. **Draggable Signature** - Drag signature box with dnd-kit
3. **Coordinate Mapping** - Convert DOM coords to PDF coords
4. **Signature Finalization** - Burn signature into PDF

## 🧪 Test the App

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173`
4. Register a new account
5. Upload a PDF
6. View dashboard with your documents

## 🎨 Customization

### Change Primary Color
Edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: {
    DEFAULT: '#E33636', // Change this
    // ...
  }
}
```

### Change App Name
Edit `frontend/src/lib/constants.ts`:
```ts
export const APP_NAME = 'SignDoc'; // Change this
```

## ✨ Ready for Phase 3?

The foundation is solid. Ready to build the PDF editor with signature placement?
