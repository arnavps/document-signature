# Document Signature App - Frontend

## 🎨 Features

- **Clean iLovePDF-style UI** with red/white theme
- **Authentication** with JWT tokens
- **Dashboard** with quick actions and recent documents
- **Drag-and-drop upload** with file validation
- **Responsive design** with Tailwind CSS
- **Smooth animations** with Framer Motion
- **Type-safe** with TypeScript

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

App runs on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   │   ├── components/   # Login/Register forms
│   │   ├── hooks/        # useAuth hook
│   │   └── services/     # API calls
│   ├── dashboard/        # Dashboard
│   │   ├── components/   # QuickActions, DocumentCard
│   │   └── hooks/        # useDocuments hook
│   ├── upload/           # File upload
│   │   ├── components/   # DropZone
│   │   └── services/     # Upload API
│   └── document-viewer/  # PDF editor (Phase 3)
├── components/           # Shared components
│   ├── layout/          # Layout, Navbar
│   └── ui/              # Button, Input, Card
├── lib/                 # Utilities
│   ├── axios.ts         # API client
│   └── constants.ts     # App constants
├── pages/               # Route pages
├── types/               # TypeScript types
└── App.tsx              # Main app with routing
```

## 🎨 UI Components

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  error="Invalid email"
  {...register('email')}
/>
```

### Card
```tsx
<Card hover={true}>
  Content here
</Card>
```

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT tokens stored in localStorage
3. Axios interceptor adds token to requests
4. Auto-refresh on 401 errors
5. Protected routes check auth state

## 📦 State Management

Using **Zustand** for global state:

- `useAuth` - User authentication state
- `useDocuments` - Documents list state

## 🎯 Next Steps

Phase 3 will add:
- PDF Viewer with react-pdf
- Draggable signature placement with dnd-kit
- Coordinate mapping for PDF positioning
- Signature finalization

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** + Zod for forms
- **Axios** for API calls
- **Lucide React** for icons
