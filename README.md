# Daisy App 🌼
> Express. Remember. Heal.

A psychologist-founded personal diary 
and mental wellness mobile app.

## Tech Stack

### Frontend
| Package | Version |
|---------|---------|
| react-native | 0.76.x |
| expo | ~52.0.x |
| typescript | ~5.3.x |
| @firebase/auth | ^11.x |
| firebase | ^11.x |
| @react-native-async-storage/async-storage | 1.23.1 |
| axios | ^1.x |
| zustand | ^5.x |
| expo-av | ~15.0.x |
| expo-image-picker | ~16.0.x |
| expo-file-system | ~18.0.x |
| react-native-svg | 15.8.0 |
| react-native-view-shot | 3.8.0 |
| @react-native-community/slider | 4.5.x |
| @react-native-community/datetimepicker | 8.x |
| expo-auth-session | ~6.0.x |
| expo-web-browser | ~14.0.x |
| react-native-safe-area-context | 4.12.0 |
| @expo/vector-icons | ^14.x |

### Backend
| Package | Version |
|---------|---------|
| node | v22.17.1 |
| express | ^4.x |
| typescript | ^5.x |
| firebase-admin | ^12.x |
| ts-node | ^10.x |
| nodemon | ^3.x |
| axios | ^1.x |
| cors | ^2.x |
| dotenv | ^16.x |

## Project Structure

```
daisy-app/
├── frontend/
│   ├── App.tsx
│   ├── components/
│   │   ├── SplashScreen/
│   │   ├── LoginScreen/
│   │   ├── SignupScreen/
│   │   ├── HomeScreen/
│   │   ├── CategoryScreen/
│   │   ├── NewEntryScreen/
│   │   │   ├── AudioRecorder.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── DoodleCanvas.tsx
│   │   ├── ViewEntryScreen/
│   │   ├── SearchScreen/
│   │   ├── ProfileScreen/
│   │   ├── DisclaimerScreen/
│   │   └── shared/
│   │       ├── BottomNavBar/
│   │       ├── EntryCard/
│   │       ├── CapsuleCard/
│   │       ├── SpaceCircle/
│   │       ├── FullImageViewer/
│   │       └── CapsuleNotification/
│   ├── services/
│   │   ├── authService.ts
│   │   ├── entryService.ts
│   │   └── spaceService.ts
│   ├── store/
│   │   └── authStore.ts
│   ├── config/
│   │   └── firebase.ts
│   ├── hooks/
│   │   └── useGoogleAuth.ts
│   ├── locales/
│   │   └── en.json
│   └── assets/
│
└── backend/
    └── src/
        ├── index.ts
        ├── config/
        │   └── firebase.ts
        ├── controllers/
        │   ├── authController.ts
        │   ├── entriesController.ts
        │   └── spacesController.ts
        ├── middleware/
        │   └── verifyToken.ts
        └── routes/
            ├── auth.ts
            ├── entries.ts
            └── spaces.ts
```

## Services Used

| Service | Purpose |
|---------|---------|
| Firebase Auth | User authentication |
| Firebase Firestore | Database (eur3 region) |
| Cloudinary | File storage (images, audio, doodles) |
| Claude API (Anthropic) | AI conversations (Talk to Past/Crush) |
| Pinecone | Vector database for RAG |
| OpenAI | Text embeddings |

## Firebase Firestore Indexes Required

Create these indexes manually in 
Firebase Console → Firestore → Indexes:

Index 1:
Collection: entries
Fields: userId ASC, spaceId ASC, createdAt DESC

Index 2:
Collection: entries  
Fields: userId ASC, createdAt DESC

## Setup Instructions

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in .env values
npx expo start --clear
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
# Add firebase-service-account.json
npm run dev
```

## API Endpoints

### Auth
```
POST /api/auth/register
GET  /api/auth/user/:uid
PUT  /api/auth/update-name
PUT  /api/auth/update-photo
```

### Entries
```
POST   /api/entries/create
GET    /api/entries/space/:spaceId
GET    /api/entries/recent
GET    /api/entries/all
GET    /api/entries/stats
GET    /api/entries/unlocked-capsules
PUT    /api/entries/update/:entryId
PUT    /api/entries/mark-shown/:entryId
DELETE /api/entries/delete/:entryId
```

### Spaces
```
GET    /api/spaces
POST   /api/spaces/add
DELETE /api/spaces/delete
```

## Talk to Past Feature

Complete AI-powered healing chat:
- 4 section questionnaire
- RAG pipeline (Pinecone + OpenAI)
- Psychology-based responses
- Crisis protocol built-in
- Sessions saved to Firebase

## RAG Pipeline

- Embeddings: `openai/text-embedding-3-small`
- Vector DB: Pinecone (1536 dimensions)
- Index: `daisy-entries`
- 3 data types: `diary_entry`, `section_answer`, `predefined`

## Psychology Data Setup

Run once to index predefined data:
```bash
cd backend
npx ts-node scripts/indexPredefined.ts
```

## Common Issues & Solutions

### Network Error / App Not Loading:
1. Check IP: `ipconfig`
2. Update `frontend/.env` `EXPO_PUBLIC_API_URL`
3. Add firewall rule (PowerShell Admin):
   ```powershell
   New-NetFirewallRule -DisplayName "Daisy Backend 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -Profile Any
   ```
4. Restart both backend and frontend

### Port Conflict:
```bash
npx expo start --clear
```
Accept new port when prompted

### Token Expired (401 errors):
Already fixed via `getFreshToken()` in `frontend/utils/getToken.ts`

### Pinecone Dimension Error:
Recreate index with `text-embedding-3-small` model = 1536 dimensions automatically

## Production Switch

Change in `backend/.env` only:
- `ANTHROPIC_API_KEY` → Real Anthropic key
- `OPENAI_API_KEY` → Real OpenAI key

## Notes
- IP changes daily on local network
  Update EXPO_PUBLIC_API_URL in .env
  Run: npx expo start --clear
- Google login works in production build only
- Push notifications: production build only
- expo-av deprecated in SDK 54 
  (migrate to expo-audio later)
