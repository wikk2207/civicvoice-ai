# CivicVoice AI

**Smart Civic Complaint Platform** — AI-powered, multilingual, real-time civic issue management built with Node.js, Express, and Firebase Firestore.

---

## Features

- **AI Classification** — Keyword-weighted NLP engine automatically routes complaints to the correct municipal department (no external API required).
- **Multilingual Support** — Submit complaints in 24+ languages. Google Translate API integration with passthrough fallback.
- **Voice Input** — Live transcription via the Web Speech API; language-aware.
- **Real-time Tracking** — Track complaint status through a full timeline: submitted → under review → assigned → in progress → resolved.
- **Image Evidence** — Drag-and-drop multi-image upload (up to 5 photos, 10 MB each).
- **Department Routing** — Water, Roads, Electricity, Sanitation, Parking, Animals, and more.
- **Admin Dashboard** — Dark-themed admin panel with stats, filters, and inline status updates.
- **Analytics Dashboard** — Pure CSS/JS charts (bar, pie/donut, trend) with no chart library dependencies.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript     |
| Backend    | Node.js + Express 4                 |
| Database   | Firebase Firestore (firebase-admin) |
| File Upload| Multer                              |
| Voice      | Web Speech API (browser-native)     |
| Security   | Helmet, CORS, dotenv                |

---

## Folder Structure

```
civicvoice-ai/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── server.js
├── config/
│   └── firebase.js
├── routes/
│   ├── complaints.js
│   ├── upload.js
│   ├── translate.js
│   └── admin.js
├── services/
│   ├── classifier.js
│   └── translator.js
├── middleware/
│   └── errorHandler.js
├── uploads/
│   └── .gitkeep
└── public/
    ├── index.html
    ├── submit.html
    ├── track.html
    ├── admin.html
    ├── analytics.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── submit.js
        ├── track.js
        ├── admin.js
        ├── analytics.js
        └── voice.js
```

---

## Installation

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/wikk2207/civicvoice-ai.git
cd civicvoice-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Firebase project details

# 4. Add Firebase service account
# Download your service account JSON from Firebase Console
# → Project Settings → Service Accounts → Generate new private key
# Save as firebase-service-account.json in the project root

# 5. Start the server
npm start          # production
npm run dev        # development (auto-restart)
```

Open `http://localhost:3000` in your browser.

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** (in production or test mode).
3. Navigate to **Project Settings → Service Accounts** and generate a new private key.
4. Save the downloaded JSON as `firebase-service-account.json` in the project root (**never commit this file**).
5. Update `.env` with your `FIREBASE_PROJECT_ID` and `FIREBASE_STORAGE_BUCKET`.

> **Note:** The server will run in in-memory mode if Firebase credentials are not configured. Data will be lost on restart.

---

## Environment Variables

| Variable                       | Description                                      | Required |
|-------------------------------|--------------------------------------------------|----------|
| `PORT`                         | Server port (default: 3000)                     | No       |
| `NODE_ENV`                     | `development` or `production`                   | No       |
| `FIREBASE_PROJECT_ID`          | Your Firebase project ID                        | Yes      |
| `FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket name                    | Yes      |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON               | Yes      |
| `GOOGLE_TRANSLATE_API_KEY`     | Google Cloud Translate API key (optional)       | No       |

---

## API Endpoints

| Method  | Endpoint                              | Description                         |
|---------|---------------------------------------|-------------------------------------|
| `GET`   | `/api/health`                         | Health check                        |
| `POST`  | `/api/complaints`                     | Submit a new complaint              |
| `GET`   | `/api/complaints`                     | List all complaints (with filters)  |
| `GET`   | `/api/complaints/track/:trackingId`   | Get public complaint by tracking ID |
| `PATCH` | `/api/complaints/:trackingId/status`  | Update complaint status             |
| `POST`  | `/api/upload`                         | Upload an image file                |
| `POST`  | `/api/translate`                      | Detect language and translate text  |
| `GET`   | `/api/translate/languages`            | List supported languages            |
| `GET`   | `/api/admin/stats`                    | Aggregate statistics for dashboard  |

### Query Params for `GET /api/complaints`

| Param      | Example           | Description              |
|-----------|-------------------|--------------------------|
| `status`   | `submitted`       | Filter by status         |
| `category` | `water`           | Filter by category key   |
| `priority` | `high`            | Filter by priority       |
| `limit`    | `50`              | Max results              |

---

## Firestore Schema

**Collection:** `complaints`

| Field                  | Type      | Description                                       |
|------------------------|-----------|---------------------------------------------------|
| `trackingId`           | string    | Unique ID (format: `CV-YYYYMMDD-XXXXXXXX`)        |
| `title`                | string    | Optional title                                    |
| `description`          | string    | Original complaint text                           |
| `originalText`         | string    | Unmodified user input                             |
| `translatedText`       | string    | English translation                               |
| `name`                 | string    | Submitter name (optional)                         |
| `email`                | string    | Submitter email (optional)                        |
| `phone`                | string    | Submitter phone (optional)                        |
| `location`             | string    | Address or landmark                               |
| `coordinates`          | object    | `{lat, lng}` or null                             |
| `imageUrls`            | string[]  | Array of uploaded image paths                     |
| `inputLanguage`        | string    | Language code selected by user                    |
| `detectedLanguage`     | string    | Auto-detected language code                       |
| `detectedLanguageName` | string    | Human-readable language name                      |
| `translationMethod`    | string    | `google` or `passthrough`                         |
| `category`             | string    | Category key (e.g., `water`, `road`)              |
| `categoryLabel`        | string    | Human-readable category name                      |
| `department`           | string    | Assigned department                               |
| `priority`             | string    | `low` / `medium` / `high` / `critical`            |
| `confidence`           | number    | Classification confidence (0–1)                   |
| `status`               | string    | Current status                                    |
| `estimatedResolution`  | string    | ISO timestamp for estimated resolution            |
| `statusHistory`        | object[]  | Array of `{status, timestamp, note}`              |
| `createdAt`            | string    | ISO creation timestamp                            |
| `updatedAt`            | string    | ISO last-updated timestamp                        |
| `resolvedAt`           | string    | ISO resolved timestamp (or null)                  |

---

## License

MIT © 2025 [wikk2207](https://github.com/wikk2207)