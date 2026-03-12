# CivicVoice AI

**Smart Civic Complaint Platform — AI-powered, multilingual, voice-enabled**

CivicVoice AI helps citizens report civic issues directly to the right government department using AI classification, multilingual support, voice input with audio playback confirmation, image evidence, and real-time tracking.

---

## Features

- **AI Classification** — Automatically categorizes complaints (Infrastructure, Sanitation, Water Supply, Electricity, Transportation, Public Safety, Environment, Healthcare, Education) and assigns priority (critical / high / medium / low)
- **Department Routing** — Routes each complaint to the correct government department
- **Multilingual Support** — 20+ languages including Hindi, Spanish, French, Arabic, Chinese, and more; optional Google Translate API integration
- **Voice Input with Audio Playback** — Record a complaint with your voice using the Web Speech API and MediaRecorder; listen back to the recording before confirming
- **Image Evidence** — Drag-and-drop upload of up to 5 images per complaint (max 5 MB each)
- **Geolocation** — Auto-detect your location using the browser's Geolocation API
- **Real-time Tracking** — Unique `CV-XXXXXX` tracking IDs with a full status timeline
- **Admin Dashboard** — Dark-themed admin panel to manage, filter, and update complaints
- **Analytics** — Canvas-based charts (bar, pie, line) — no external chart libraries
- **Firebase / In-memory** — Works with Firebase Firestore when configured, or falls back to in-memory storage automatically

---

## Tech Stack

| Layer      | Technology |
|------------|-----------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript |
| Backend    | Node.js + Express |
| Database   | Firebase Firestore (with in-memory fallback) |
| File Upload| Multer |
| Voice      | Web Speech API + MediaRecorder API |
| Auth       | Simple token-based authentication |

---

## Setup

### 1. Clone the repository

```bash
git clone -b complete-platform https://github.com/wikk2207/civicvoice-ai.git
cd civicvoice-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
GOOGLE_TRANSLATE_API_KEY=your-translate-api-key   # optional
AUTH_SECRET=change-this-to-a-random-secret
```

> **Firebase is optional.** If no service account is found, the app uses in-memory storage automatically.

### 4. Start the server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 5. Open in browser

| Page        | URL |
|-------------|-----|
| Landing     | http://localhost:3000 |
| Login       | http://localhost:3000/login |
| Register    | http://localhost:3000/register |
| Submit      | http://localhost:3000/submit |
| Track       | http://localhost:3000/track |
| Admin       | http://localhost:3000/admin |
| Analytics   | http://localhost:3000/analytics |

---

## Folder Structure

```
civicvoice-ai/
├── config/
│   └── firebase.js          # Firebase + in-memory store
├── middleware/
│   └── errorHandler.js      # Global error handler
├── routes/
│   ├── auth.js              # Register / Login
│   ├── complaints.js        # Create, get, update complaints
│   ├── upload.js            # Image upload (Multer)
│   ├── translate.js         # Text translation
│   └── admin.js             # Admin CRUD + stats
├── services/
│   ├── classifier.js        # AI keyword classifier
│   └── translator.js        # Google Translate / language detect
├── public/
│   ├── index.html           # Landing page
│   ├── login.html           # Login page
│   ├── register.html        # Register page
│   ├── submit.html          # Complaint submission (voice + upload)
│   ├── track.html           # Complaint tracking
│   ├── admin.html           # Admin dashboard (dark theme)
│   ├── analytics.html       # Analytics (dark theme, canvas charts)
│   ├── css/
│   │   └── styles.css       # Complete stylesheet
│   └── js/
│       ├── voice.js         # VoiceRecorder (SpeechRecognition + MediaRecorder)
│       ├── submit.js        # Submission logic + audio playback confirmation
│       ├── track.js         # Tracking logic
│       ├── admin.js         # Admin dashboard logic
│       └── analytics.js     # Canvas charts
├── uploads/                 # Uploaded images (created automatically)
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## API Endpoints

### Complaints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/complaints` | Create a new complaint |
| GET    | `/api/complaints/:trackingId` | Get complaint by tracking ID |
| PUT    | `/api/complaints/:trackingId/status` | Update complaint status |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/complaints` | List complaints (with filters) |
| GET    | `/api/admin/stats` | Dashboard statistics |
| PUT    | `/api/admin/complaints/:trackingId` | Update complaint |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login` | Login |

### Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/upload` | Upload images (max 5, 5 MB each) |
| POST   | `/api/translate` | Translate text |
| GET    | `/api/translate/languages` | List supported languages |
| GET    | `/api/health` | Health check |

---

## Design System

| Token | Value |
|-------|-------|
| Primary (Deep Red) | `#8B0000` |
| Secondary (Charcoal) | `#111111` |
| Accent (Cream) | `#F5F0E6` |
| Font | Inter (Google Fonts) |
| Admin theme | Dark (`#111111` background) |

---

## Deployment

### Render.com (free)

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo, set Build Command: `npm install`, Start Command: `node server.js`
4. Add environment variables in the Render dashboard

### Railway.app

```bash
railway login
railway init
railway up
```

---

## License

MIT © 2025 wikk2207
