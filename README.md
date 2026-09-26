# Daisy App 🌼
> Express. Remember. Heal.

A psychologist-founded personal diary and mental wellness mobile app built with React Native + Expo SDK 54.

**Status**: Live on App Store + Play Store ✅

---

## Project Structure

```
daisy-app/
├── frontend/          # React Native mobile app (Expo SDK 54)
├── backend/           # Node.js + Express API server
├── landing/           # Vite + React landing page (daisyapp.com)
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
| axios | ^1.x | HTTP client (used for Expo Push API) |
| cors | ^2.x | CORS middleware |
| express-rate-limit | ^7.x | Rate limiting |
| dotenv | ^16.x | Environment variables |
| ts-node | ^10.x | TypeScript execution |
| nodemon | ^3.x | Dev auto-restart |

### Landing Page
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.x | UI framework |
| vite | ^5.x | Build tool |
| typescript | ^5.x | Type safety |
| firebase | ^11.x | Auth (Email/Password + Google sign-in) |
| lucide-react | ^0.x | Icons |

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
| Paddle | Web payment processing (Merchant of Record) | daisy.nag.tm@gmail.com | Free + 5% after $2500 MTR |
| Render | Backend hosting | daisy.nag.tm@gmail.com | Hobby $7/month (always on) |
| Expo EAS | APK/AAB builds + OTA updates | daisyapp2026 | Free |
| Vercel | Landing page + Admin panel hosting | daisy.nag.tm@gmail.com | Free |
| GitHub | Source code | daisy-app2026 | Free |

> **UptimeRobot** was used on the free Render plan. Now on Hobby ($7/month), UptimeRobot is no longer needed since the server never sleeps.

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
PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret
PADDLE_API_KEY=your_paddle_api_key
```

> **IMPORTANT**: `FIREBASE_PRIVATE_KEY` must preserve `\n` characters. In Render dashboard paste the key with literal `\n` characters — the code applies `.replace(/\\n/g, '\n')` automatically.

> **Paddle secrets**: Get `PADDLE_WEBHOOK_SECRET` from Paddle Dashboard → Notifications → Webhooks → your endpoint's secret. Get `PADDLE_API_KEY` from Paddle Dashboard → Developer → Authentication.

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

### Landing Page (`landing/.env`)
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=daisy-app-82b09.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=daisy-app-82b09
VITE_FIREBASE_STORAGE_BUCKET=daisy-app-82b09.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=173246095861
VITE_FIREBASE_APP_ID=your_app_id
VITE_PADDLE_CLIENT_TOKEN=your_paddle_client_token
VITE_API_URL=https://daisyapp.onrender.com
```

> **`VITE_PADDLE_CLIENT_TOKEN`**: Get from Paddle Dashboard → Developer → Authentication → Client-side token. This is safe to expose in frontend (read-only, no billing access).

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

### Landing Page
```bash
cd landing
npm install
npm run dev
# Runs on http://localhost:5174
```

### Admin Panel
```bash
cd admin
npm install
cp .env.example .env
# Fill in .env values
npm run dev
# Runs on http://localhost:5173
```

---

## Deployment

### Backend → Render
- **URL**: https://daisyapp.onrender.com
- **Plan**: Hobby $7/month (always on, no sleep)
- **Region**: Frankfurt, EU
- **Node version**: 20.11.0
- **Build command**: `npm install && npm run build`
- **Start command**: `node dist/index.js`
- **Root directory**: `backend`
- **Auto deploy**: On every GitHub push to `main`
- **Health check**: GET `/health`

### Frontend → Expo EAS (App Store + Play Store)

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

**iOS build (for App Store):**
```bash
cd frontend
eas build --platform ios --profile production
```

**OTA Update (JS-only changes, no APK/IPA rebuild):**
```bash
eas update --branch production --message "fix: description"
```
> Use EAS Update for UI fixes, text changes, API URL changes. Build new APK/IPA only when native packages, `app.json`, or `google-services.json` change.

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
POST   /api/talk-to-past/sessions/:id/message            # Send message (RAG + AI) — checks chatLimit/messageLimit
DELETE /api/talk-to-past/sessions/:id                    # Delete session + Pinecone vectors
```

### Talk to Crush
```
POST   /api/talk-to-crush/sessions                       # Create session (with section answers)
GET    /api/talk-to-crush/sessions                       # List all sessions
GET    /api/talk-to-crush/sessions/:id                   # Get session + messages
POST   /api/talk-to-crush/sessions/:id/message           # Send message (AI) — checks chatLimit/messageLimit
DELETE /api/talk-to-crush/sessions/:id                   # Delete session + Pinecone vectors
```

> **Limit enforcement**: Both Talk to Past and Talk to Crush message endpoints read `chatLimit` and `messageLimit` dynamically from the user's Firestore document. On limit hit, returns HTTP `403` with `{ code: "LIMIT_REACHED", upgradeUrl: "https://daisyapp.com/billing" }` — this triggers the `UpgradePrompt` modal in the app.

### Notifications
```
POST   /api/notifications/save-token    # Save Expo push token for user
POST   /api/notifications/send-all      # Broadcast to all users (admin only, x-admin-secret header)
```

### Paddle (Payments)
```
POST   /api/webhooks/paddle             # Paddle webhook receiver (HMAC-SHA256 verified, rate-limited)
POST   /api/paddle/cancel              # Cancel user subscription
```

### Admin
```
GET    /api/admin/stats                  # Dashboard stats (users, entries, sessions) — cached 5 min
GET    /api/admin/users                  # All users list — cached 5 min
DELETE /api/admin/users/:uid             # Delete user
GET    /api/admin/analytics              # Last 7 days entries chart data — cached 5 min
GET    /api/admin/subscription-stats     # Subscription analytics (paid users, revenue, plan breakdown) — cached 5 min
DELETE /api/admin/cache                  # Clear all in-memory caches immediately
PUT    /api/admin/config                 # Update Privacy Policy + ToS URLs (persisted to Firestore)
POST   /api/admin/notifications/send     # Send broadcast notification
```

> All `/api/admin/*` routes require header: `x-admin-secret: <ADMIN_SECRET>`

---

## Subscription / Payment System

### Overview
Payments are **web-only** via Paddle (no App Store / Play Store in-app purchase). This avoids the 30% platform cut and EU VAT complications (Paddle is Merchant of Record, they handle EU VAT automatically).

### Plans & Pricing

| Plan | Monthly | Yearly | Message Limit | Chat Limit |
|------|---------|--------|---------------|------------|
| Free | $0 | $0 | 30/month | 3 chats |
| Basic | $8.99/mo | $86.30/yr (~20% off) | 150/month | 10 chats |
| Pro | $14.99/mo | $143.90/yr (~20% off) | 500/month | Unlimited |

### Paddle Products (in Paddle dashboard)
| Product ID | Price |
|------------|-------|
| daisy_basic_monthly | $8.99/month |
| daisy_basic_yearly | $86.30/year |
| daisy_pro_monthly | $14.99/month |
| daisy_pro_yearly | $143.90/year |

### Payment Flow
1. User taps "Upgrade" in app → `openBillingPage()` opens `https://daisyapp.com/billing` in browser
2. User signs in on billing page with same credentials as app (Email/Password or Google)
3. User selects plan → Paddle checkout opens
4. Payment completes → Paddle sends webhook to `/api/webhooks/paddle`
5. Backend verifies HMAC-SHA256 signature + timestamp (5-minute window)
6. Firestore `users/{userId}` updated: `{ plan, messageLimit, chatLimit, paddleSubscriptionId, paddleCustomerId }`
7. App's `onSnapshot` listener detects Firestore change → updates `subscriptionStore` in real time
8. Full-screen overlay on billing page shows 3.5s loading buffer for webhook processing
9. Success page shown → "Open Daisy App" deep link (`daisy://billing/success`)
10. App handles deep link → reloads plan + navigates to Profile screen

### Webhook Security
- HMAC-SHA256 signature verified using `PADDLE_WEBHOOK_SECRET`
- Timestamp check: rejects webhooks older than 5 minutes
- Rate limiter on webhook route
- `userId` extracted strictly from verified Paddle `custom_data` (never from raw request body)
- Email fallback: if `userId` missing from `custom_data`, searches Firestore by Paddle customer email

### Billing Page (`landing/src/pages/Billing.tsx`)
- Firebase Auth (Email/Password + Google sign-in) — no Sign Up (account creation is app-only)
- Apple ID fallback: email-only input box for users who used Sign in with Apple
- New user detection: shows "No account found! Download the Daisy app first" + App Store / Play Store links
- Monthly / Yearly billing toggle
- 3 plan cards: Free / Basic / Pro
- Paddle v2 JS checkout with `userId` in `customData` + `customer.email`
- Full-screen loading overlay (3.5s webhook buffer)
- Success page with plan breakdown + "Open Daisy App" deep link
- Failed page: "Try Again" + "Contact Support"
- Manage subscription section for paid users (cancel subscription button)

### Paddle JS Setup
Paddle v2 JS script is loaded in `landing/index.html`:
```html
<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
```

### Frontend Subscription State (Zustand)
`frontend/store/subscriptionStore.ts` — stores `plan`, `messageLimit`, `chatLimit`, `isLoading`.  
`setPlan()` auto-sets limits: `free(30/3)`, `basic(150/10)`, `pro(500/-1 = unlimited)`.

### Real-time Plan Updates
`frontend/hooks/useSubscription.ts`:
- `loadUserPlan()` — one-time Firestore read on login
- `subscribeToUserPlan()` — `onSnapshot` real-time listener → updates store immediately when Firestore changes (after webhook)
- `openBillingPage()` — `Linking.openURL('https://daisyapp.com/billing')`

`frontend/App.tsx`:
- Calls `subscribeToUserPlan()` after auth → unsubscribes on logout
- Deep link handler: `Linking.addEventListener('url', ...)` + `Linking.getInitialURL()`
  - Handles `daisy://billing/success` → reloads plan + navigates to Profile

### UpgradePrompt Component
`frontend/components/UpgradePrompt/UpgradePrompt.tsx`:
- Modal triggered when API returns `403 { code: "LIMIT_REACHED" }`
- Title: "You've reached your limit"
- "Unlock More Space" button → opens billing page
- "Maybe Later" → dismiss

### Testing Paddle Payments (Sandbox)
- Use sandbox card: `4242 4242 4242 4242` (any future expiry, any CVV)
- Toggle sandbox mode in `Billing.tsx`: `Paddle.Environment.set('sandbox')`
- Sandbox webhooks go to `/api/webhooks/paddle` (same endpoint)

---

## Firestore Collections

| Collection | Description |
|-----------|-------------|
| `users` | User profiles, push tokens, streaks, language preference, plan, messageLimit, chatLimit, paddleSubscriptionId |
| `users/{userId}/spaces` | Custom spaces created by user |
| `entries` | All diary entries (text, audio, image, doodle, capsule) |
| `talkToPastSessions` | Talk to Past sessions + messages array |
| `talkToCrushSessions` | Talk to Crush sessions + messages array |
| `config` | App config (Privacy Policy URL, ToS URL) - persisted by admin panel |

### User Document Fields (subscription-related)
```json
{
  "plan": "free | basic | pro",
  "messageLimit": 30,
  "chatLimit": 3,
  "paddleSubscriptionId": "sub_xxx",
  "paddleCustomerId": "ctm_xxx",
  "paddleStatus": "active | canceled | past_due"
}
```

> **Security note**: `plan`, `messageLimit`, `chatLimit` should be backend-write-only in Firestore security rules (only Firebase Admin SDK / backend can write these fields — users cannot self-promote their plan).

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
| Dashboard | Total users, active today, entries count, session counts, **monthly revenue**, **paid members count**, **conversion rate** |
| Users | List all users, view details, delete user |
| Notifications | Send broadcast notification to all app users |
| Analytics | Last 7 days diary entries line chart |
| Pricing | **Subscription analytics**: plan breakdown (Free/Basic/Pro counts), revenue stats, recent subscriptions table, cache clear button |
| Config | Service health monitor (Backend/Firebase/OpenAI/Pinecone/Cloudinary), Privacy Policy URL + Terms of Service URL (saved to Firestore) |

### Admin Caching
All admin stats endpoints use a **5-minute in-memory cache** to avoid hammering Firestore on every page load.

- Cache is automatically invalidated after 5 minutes
- Manual cache clear: `DELETE /api/admin/cache` (also available as button in Pricing tab)
- Revenue calculation: Basic = $8.99/user, Pro = $14.99/user (counted per active paid user only)

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

### Paddle webhook not receiving
- Ensure backend is deployed and `/api/webhooks/paddle` is accessible
- Check Paddle Dashboard → Notifications → Webhooks → your endpoint for delivery logs
- Webhook secret must match `PADDLE_WEBHOOK_SECRET` in Render env
- Test with Paddle sandbox: card `4242 4242 4242 4242`

### User plan not updating after payment
- Check Paddle webhook delivery in Paddle Dashboard → Events
- Verify `userId` is in `custom_data` in the Paddle checkout call
- Check Render logs for webhook errors
- The `onSnapshot` listener in `App.tsx` updates plan in real time once Firestore is updated

### Billing page Firebase auth error: does not provide an export named 'User'
- Use `import type { User }` from `firebase/auth` (not `import { User }`)

### Admin showing all users as paid
- Verify `totalPaid = basic + pro` (not total user count) in `adminController.ts`

---

## When to Rebuild APK vs Use EAS Update

| Change Type | Action |
|------------|--------|
| UI changes, text, colors | `eas update` (no rebuild) |
| API URL change | `eas update` (no rebuild) |
| System prompt change | Push to GitHub → auto deploy backend |
| Privacy Policy URL | Admin panel → Config tab |
| Pricing page changes | Push to GitHub → Vercel auto deploys |
| New npm package | `eas build` (full rebuild) |
| `app.json` changes | `eas build` (full rebuild) |
| `google-services.json` changes | `eas build` (full rebuild) |
| Native code changes | `eas build` (full rebuild) |

---

## Monthly Running Costs

| Service | Cost | Notes |
|---------|------|-------|
| Render (Backend) | $7/month | Hobby plan, always on |
| OpenAI API | ~$15-20/month | gpt-4o-mini + embeddings |
| Paddle | Free until $2,500 MTR, then 5% | Merchant of Record, handles EU VAT |
| Firebase | Free | Free tier sufficient |
| Pinecone | Free | Free tier sufficient |
| Cloudinary | Free | 25GB free storage |
| Vercel | Free | Landing + Admin panel |
| **Total** | **~$22-27/month** | Paddle fees extra after $2,500 MTR |

---

## Notes for Developers

- **Google Sign In**: Works in production APK only (not Expo Go)
- **Push Notifications**: Works in production APK only (not Expo Go, SDK 53+ removed from Expo Go)
- **expo-av**: Deprecated in SDK 54, migrate to `expo-audio` and `expo-video` in future
- **Language support**: `en.json`, `de.json`, `ar.json` in `frontend/locales/`
- **AI model**: `gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings — both use same `OPENAI_API_KEY`
- **Expo Push**: Uses direct HTTP to `https://exp.host/--/api/v2/push/send` (no SDK)
- **Config persistence**: Admin panel config updates are saved to Firestore `config/appConfig` document and loaded on server startup
- **Payments**: Web-only via Paddle — no App Store / Play Store in-app purchases (avoids 30% platform cut)
- **Plan updates**: Real-time via Firestore `onSnapshot` in `App.tsx` — no polling needed
- **Deep link**: `daisy://billing/success` handled in `App.tsx` → reloads plan + navigates to Profile
- **Account creation**: App-only. No Sign Up on the billing/landing page — users must create account in the Daisy app first
- **Apple Sign In**: Billing page has email-only fallback for users who used Sign in with Apple (Apple hides email after first auth)
























