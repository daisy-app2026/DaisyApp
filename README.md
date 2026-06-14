# Daisy App 🌼
> Express. Remember. Heal.

A psychologist-founded personal diary and mental wellness mobile app built with React Native + Expo SDK 54.

---

## Project Structure

```
daisy-app/
├── frontend/          # React Native mobile app (Expo SDK 54)
├── backend/           # Node.js + Express API server
├── landing/           # Vite + React landing page
└── admin/             # Vite + React admin panel
```

---

## Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.81.5 | Mobile framework |
| expo | ~54.0.x | Build toolchain |
| typescript | ~5.3.x | Type safety |
| @react-navigation/native | ^6.x | Navigation |
| @react-navigation/stack | ^6.x | Stack navigator |
| @react-navigation/bottom-tabs | ^6.x | Tab navigator |
| zustand | ^5.x | State management |
| axios | ^1.x | HTTP client |
| firebase | ^11.x | Auth + Firestore client |
| @react-native-google-signin/google-signin | ^13.x | Native Google Sign In |
| expo-splash-screen | ~0.29.x | Splash screen control |
| expo-notifications | ~0.29.x | Push notifications |
| expo-image-picker | ~16.0.x | Image selection |
| expo-av | ~15.0.x | Audio recording (deprecated SDK 54, migrate to expo-audio later) |
| expo-file-system | ~18.0.x | File access |
| expo-linear-gradient | ~14.0.x | Gradient UI |
| react-native-svg | 15.8.0 | SVG support |
| react-native-view-shot | 3.8.0 | Doodle canvas capture |
| react-native-safe-area-context | 4.12.0 | Safe area insets |
| @react-native-async-storage/async-storage | 1.23.1 | Local storage |
| @react-native-community/datetimepicker | 8.x | Date picker |
| @expo/vector-icons | ^14.x | Icons |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| node | 20.11.0 | Runtime |
| express | ^4.x | HTTP framework |
| typescript | ^5.x | Type safety |
| firebase-admin | ^12.x | Firebase server SDK |
| openai | ^4.x | OpenAI API client |
| @pinecone-database/pinecone | ^3.x | Vector database client |
| cloudinary | ^2.x | Media storage |
| expo-server-sdk | removed | Replaced with direct HTTP to Expo Push API |
| axios | ^1.x | HTTP client (used for Expo Push API) |
| cors | ^2.x | CORS middleware |
| express-rate-limit | ^7.x | Rate limiting |
| dotenv | ^16.x | Environment variables |
| ts-node | ^10.x | TypeScript execution |
| nodemon | ^3.x | Dev auto-restart |

### Admin Panel
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.x | UI framework |
| vite | ^5.x | Build tool |
| typescript | ^5.x | Type safety |
| axios | ^1.x | API calls |
| recharts | ^2.x | Analytics charts |
| lucide-react | ^0.x | Icons |

---

## Services Used

| Service | Purpose | Account | Plan |
|---------|---------|---------|------|
| Firebase Auth | User authentication | daisy.nag.tm@gmail.com | Free |
| Firebase Firestore | Database (eur3 region) | daisy.nag.tm@gmail.com | Free |
| Firebase Cloud Messaging | Push notification delivery | daisy.nag.tm@gmail.com | Free |
| Cloudinary | Media storage (images, audio, doodles) | daisy.nag.tm@gmail.com | Free (25GB) |
| OpenAI | Chat (gpt-4o-mini) + Embeddings (text-embedding-3-small) | Meriem's account | Pay-as-you-go |
| Pinecone | Vector database for RAG pipeline | daisy.nag.tm@gmail.com | Free |
| Render | Backend hosting | daisy.nag.tm@gmail.com | Starter $7/month |
| Expo EAS | APK/AAB builds | daisyapp2026 | Free |
| Vercel | Landing page + Admin panel hosting | daisy.nag.tm@gmail.com | Free |
| UptimeRobot | Server uptime monitoring | daisy.nag.tm@gmail.com | Free |
| GitHub | Source code | daisy-app2026 | Free |

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=3000
FIREBASE_PROJECT_ID=daisy-app-82b09
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@daisy-app-82b09.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLOUDINARY_CLOUD_NAME=diylru5iv
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
OPENAI_API_KEY=sk-proj-...
PINECONE_API_KEY=your_key
PINECONE_INDEX_NAME=daisy-entries
PINECONE_INDEX_HOST=your_host_url
ADMIN_SECRET=daisy-admin-2026
```

> **IMPORTANT**: `FIREBASE_PRIVATE_KEY` must preserve `\n` characters. In Render dashboard paste the key with literal `\n` characters — the code applies `.replace(/\\n/g, '\n')` automatically.

### Frontend (`frontend/.env`)
```env
EXPO_PUBLIC_API_URL=https://daisyapp.onrender.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=daisy-app-82b09.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=daisy-app-82b09
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=daisy-app-82b09.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=173246095861
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=173246095861-84qqc7cckfvdavn3uq4a28alqgaq7s4u.apps.googleusercontent.com
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=diylru5iv
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Admin Panel (`admin/.env`)
```env
VITE_API_URL=https://daisyapp.onrender.com
VITE_ADMIN_SECRET=daisy-admin-2026
```

---

## Local Development Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
npm run dev
# Runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
npx expo start --clear
```

> **Local IP**: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to get your IPv4 address.
> Update `EXPO_PUBLIC_API_URL` every time your IP changes.

### Admin Panel
```bash
cd admin
npm install
cp .env.example .env
# Fill in .env values
npm run dev
# Runs on http://localhost:5173
```

### Landing Page
```bash
cd landing
npm install
npm run dev
# Runs on http://localhost:5174
```

---

## Deployment

### Backend → Render
- **URL**: https://daisyapp.onrender.com
- **Plan**: Starter $7/month (always on, no sleep)
- **Region**: Frankfurt, EU
- **Node version**: 20.11.0
- **Build command**: `npm install && npm run build`
- **Start command**: `node dist/index.js`
- **Root directory**: `backend`
- **Auto deploy**: On every GitHub push to `main`
- **Health check**: GET `/health`

> **UptimeRobot** pings `/health` every 5 minutes to prevent cold starts.

### Frontend → Expo EAS

**Preview APK (for testing):**
```bash
cd frontend
eas build --platform android --profile preview
```

**Production AAB (for Play Store):**
```bash
cd frontend
eas build --platform android --profile production
```

**OTA Update (JS-only changes, no APK rebuild):**
```bash
eas update --branch production --message "fix: description"
```
> Use EAS Update for UI fixes, text changes, API URL changes. Build new APK only when native packages, `app.json`, or `google-services.json` change.

### Landing Page + Admin Panel → Vercel
- Connect GitHub repo to Vercel
- Set root directory: `landing` or `admin`
- Auto deploys on every push to `main`
- Add `.env` variables in Vercel dashboard

---

## API Endpoints

### Auth
```
POST   /api/auth/register           # Register/sync user after Firebase auth
GET    /api/auth/user/:uid          # Get user profile
PUT    /api/auth/update-name        # Update display name
PUT    /api/auth/update-photo       # Update profile photo URL
POST   /api/auth/check-email        # Check if email exists
GET    /api/auth/language           # Get user language preference
PUT    /api/auth/update-language    # Update language preference
GET    /api/auth/config             # Get app config (Privacy Policy URL, ToS URL)
```

### Entries
```
POST   /api/entries/create          # Create diary entry (text/audio/image/doodle)
GET    /api/entries/space/:spaceId  # Get entries for a space
GET    /api/entries/recent          # Get recent entries (home screen)
GET    /api/entries/all             # Get all entries
GET    /api/entries/stats           # Get entry stats (count, streak)
GET    /api/entries/unlocked-capsules  # Get unlocked memory capsules
PUT    /api/entries/update/:entryId    # Update entry
PUT    /api/entries/mark-shown/:entryId  # Mark capsule notification shown
DELETE /api/entries/delete/:entryId    # Delete entry + Cloudinary media
```

### Spaces
```
GET    /api/spaces                  # Get all spaces (default + custom)
POST   /api/spaces/add              # Add custom space
DELETE /api/spaces/delete           # Delete custom space
```

### Talk to Past
```
POST   /api/talk-to-past/sessions                        # Create session (with section answers)
GET    /api/talk-to-past/sessions                        # List all sessions
GET    /api/talk-to-past/sessions/:id                    # Get session + messages
POST   /api/talk-to-past/sessions/:id/message            # Send message (RAG + AI)
DELETE /api/talk-to-past/sessions/:id                    # Delete session + Pinecone vectors
```

### Talk to Crush
```
POST   /api/talk-to-crush/sessions                       # Create session (with section answers)
GET    /api/talk-to-crush/sessions                       # List all sessions
GET    /api/talk-to-crush/sessions/:id                   # Get session + messages
POST   /api/talk-to-crush/sessions/:id/message           # Send message (AI)
DELETE /api/talk-to-crush/sessions/:id                   # Delete session + Pinecone vectors
```

### Notifications
```
POST   /api/notifications/save-token    # Save Expo push token for user
POST   /api/notifications/send-all      # Broadcast to all users (admin only, x-admin-secret header)
```

### Admin
```
GET    /api/admin/stats                  # Dashboard stats
GET    /api/admin/users                  # All users list
DELETE /api/admin/users/:uid             # Delete user
GET    /api/admin/analytics              # Last 7 days entries chart data
PUT    /api/admin/config                 # Update Privacy Policy + ToS URLs (persisted to Firestore)
POST   /api/admin/notifications/send     # Send broadcast notification
```

> All `/api/admin/*` routes require header: `x-admin-secret: <ADMIN_SECRET>`

---

## Firestore Collections

| Collection | Description |
|-----------|-------------|
| `users` | User profiles, push tokens, streaks, language preference |
| `users/{userId}/spaces` | Custom spaces created by user |
| `entries` | All diary entries (text, audio, image, doodle, capsule) |
| `talkToPastSessions` | Talk to Past sessions + messages array |
| `talkToCrushSessions` | Talk to Crush sessions + messages array |
| `config` | App config (Privacy Policy URL, ToS URL) - persisted by admin panel |

### Required Firestore Indexes

Create manually in Firebase Console → Firestore → Indexes:

| Collection | Field 1 | Field 2 | Field 3 |
|-----------|---------|---------|---------|
| entries | userId ASC | spaceId ASC | createdAt DESC |
| entries | userId ASC | createdAt DESC | — |
| talkToPastSessions | userId ASC | createdAt DESC | — |
| talkToCrushSessions | userId ASC | createdAt DESC | — |

---

## RAG Pipeline (Talk to Past)

```
User message
    ↓
Generate embedding (OpenAI text-embedding-3-small)
    ↓
Query Pinecone (daisy-entries index, 1536 dimensions)
    ↓
Retrieve relevant context (diary entries + section answers)
    ↓
Build system prompt (person identity + context + rules)
    ↓
OpenAI gpt-4o-mini (max_tokens: 250)
    ↓
Response to user
    ↓
Save to Firestore session
```

### Pinecone Vector Types
| Type | userId | Description |
|------|--------|-------------|
| `diary_entry` | user's UID | User's diary entries |
| `section_answer` | user's UID | Talk to Past section answers |
| `crush_answer` | user's UID | Talk to Crush section answers |
| `predefined` | `global` | 28 psychology chunks (Talk to Past) |
| `predefined_crush` | `global` | 34 psychology chunks (Talk to Crush) |

---

## Push Notifications

### How it works
1. App opens → `registerForPushNotifications()` gets Expo token
2. Token saved to Firestore (`users/{uid}.pushToken`)
3. Capsule unlocks → backend calls Expo Push API directly via HTTP
4. Admin panel → sends broadcast to all users via Expo Push API

### Expo Push API (direct HTTP)
```
POST https://exp.host/--/api/v2/push/send
Body: { to: "ExponentPushToken[xxx]", title: "...", body: "..." }
```

> `expo-server-sdk` was removed due to ESM/CommonJS incompatibility. Direct HTTP to Expo Push API is used instead.

### Terminal Script (manual send)
```bash
cd backend
npx ts-node scripts/sendNotification.ts
# Interactive: enter title, body, confirm
```

---

## Admin Panel

**URL**: Your Vercel deployment URL  
**Login**: Enter `ADMIN_SECRET` value as password

### Features
| Tab | Function |
|-----|---------|
| Dashboard | Total users, active today, entries count, session counts |
| Users | List all users, view details, delete user |
| Notifications | Send broadcast notification to all app users |
| Analytics | Last 7 days diary entries line chart |
| Config | Update Privacy Policy URL + Terms of Service URL (saved to Firestore, no APK needed) |

---

## Google Sign In Setup

### Android OAuth (Google Cloud Console)
1. Go to `console.cloud.google.com`
2. APIs & Services → Credentials
3. Android OAuth client must have:
   - Package name: `com.daisy.app`
   - SHA-1: Get from `eas credentials --platform android`
4. OAuth consent screen must be set to **Production** (not Testing)

### SHA-1 Fingerprint
```bash
cd frontend
eas credentials --platform android
# Copy SHA-1 Fingerprint from output
# Add to Firebase Console → Project Settings → Android App → SHA certificate fingerprints
# Add to Google Cloud Console → Android OAuth client
```

### google-services.json
- Download from Firebase Console → Project Settings → Android App
- Place at `frontend/google-services.json`
- Referenced in `app.json`: `"googleServicesFile": "./google-services.json"`

---

## Memory Capsule

- User creates entry with `isCapsule: true` and sets `unlockDate` (format: `"YYYY-MM-DD"` date-only, no timezone)
- Backend compares: `unlockDate.split('T')[0] <= today` (date-only comparison, timezone safe)
- On unlock: push notification sent + in-app banner shown
- `notificationShown: true` prevents duplicate notifications

---

## Useful Scripts

```bash
# Send push notification to all users
cd backend && npx ts-node scripts/sendNotification.ts

# Clean test data from Pinecone (keeps predefined global data)
cd backend && npx ts-node scripts/cleanupPinecone.ts

# Clean Cloudinary test media
cd backend && npx ts-node scripts/cleanupCloudinary.ts

# Index predefined psychology data (run once on fresh setup)
cd backend && npx ts-node scripts/indexPredefined.ts
cd backend && npx ts-node scripts/indexCrushPredefined.ts
```

---

## Common Issues & Solutions

### 403 on admin routes
- Check `ADMIN_SECRET` matches between Render env and admin panel env
- Header must be: `x-admin-secret: <value>`

### Push notifications not working
- Token must be `ExponentPushToken[xxx]` format
- User must have opened app at least once after install
- Check `pushToken` field in Firestore `users` collection

### Google Sign In fails (Error 400)
- OAuth consent screen must be **Production** not Testing
- SHA-1 must be added to Firebase + Google Cloud Console
- `google-services.json` must be downloaded after adding SHA-1

### Capsule not unlocking
- Check `unlockDate` format in Firestore — should be `"YYYY-MM-DD"` (date only)
- Old entries may have full ISO format — both are handled by `.split('T')[0]`

### Firebase PRIVATE_KEY error on Render
- The code applies `.replace(/\\n/g, '\n')` automatically
- Paste key with literal `\n` characters in Render env dashboard (no surrounding quotes)

### Port conflict (local dev)
```bash
netstat -ano | findstr :3000
taskkill /f /pid <PID>
```

### Backend cold start (Render free tier)
- Upgrade to Starter plan ($7/month) for always-on
- Or use UptimeRobot to ping `/health` every 5 minutes

---

## When to Rebuild APK vs Use EAS Update

| Change Type | Action |
|------------|--------|
| UI changes, text, colors | `eas update` (no rebuild) |
| API URL change | `eas update` (no rebuild) |
| System prompt change | Push to GitHub → auto deploy backend |
| Privacy Policy URL | Admin panel → Config tab |
| New npm package | `eas build` (full rebuild) |
| `app.json` changes | `eas build` (full rebuild) |
| `google-services.json` changes | `eas build` (full rebuild) |
| Native code changes | `eas build` (full rebuild) |

---

## Monthly Running Costs

| Service | Cost | Notes |
|---------|------|-------|
| Render (Backend) | $7/month | Starter plan, always on |
| OpenAI API | ~$15-20/month | gpt-4o-mini + embeddings |
| Firebase | Free | Free tier sufficient |
| Pinecone | Free | Free tier sufficient |
| Cloudinary | Free | 25GB free storage |
| Vercel | Free | Landing + Admin panel |
| UptimeRobot | Free | Server monitoring |
| **Total** | **~$22-27/month** | |


## Notes for Developers

- **Google Sign In**: Works in production APK only (not Expo Go)
- **Push Notifications**: Works in production APK only (not Expo Go, SDK 53+ removed from Expo Go)
- **expo-av**: Deprecated in SDK 54, migrate to `expo-audio` and `expo-video` in future
- **Language support**: `en.json`, `de.json`, `ar.json` in `frontend/locales/`
- **AI model**: `gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings — both use same `OPENAI_API_KEY`
- **Expo Push**: Uses direct HTTP to `https://exp.host/--/api/v2/push/send` (no SDK)
- **Config persistence**: Admin panel config updates are saved to Firestore `config/appConfig` document and loaded on server startup