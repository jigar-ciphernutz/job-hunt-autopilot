# Job Hunt Autopilot ✈️

> An AI-powered job application tracker with scam detection, pipeline management, and deterministic follow-up reminders.

## Overview

Job Hunt Autopilot lets you import your job-related emails as JSON, automatically classify them with Gemini AI, group related emails into application records, and visualize everything in a Kanban-style pipeline. Suspected scam emails are flagged with concrete evidence and never placed in the pipeline.

## Features

- **📥 JSON Import** – Import job emails from a JSON file matching the `RawEmail` schema
- **🧠 AI Classification** – Gemini classifies each email into: `application_acknowledgment`, `interview_invitation`, `rejection`, `offer`, `scam`, or `other`
- **🛡️ Dual Scam Detection** – Gemini + deterministic regex rules; cross-referenced to produce "Likely Scam" (red) or "Needs Review" (amber)
- **📋 Pipeline Board** – Four-column Kanban: Applied → Interview → Offer → Rejected
- **⏰ Reminders** – Deterministic 7-day follow-up reminders; clock resets when employer responds
- **💾 Local Persistence** – State saved to localStorage; re-importing unchanged emails makes **zero** API calls
- **📅 Reference Date Override** – Change the "today" date in the header for demo purposes

## Setup

### Prerequisites

- Node.js 18+
- A Firebase project with the [Firebase AI Logic / Gemini Developer API](https://firebase.google.com/docs/ai-logic) enabled

### 1. Clone and install

```bash
git clone <repo-url>
cd job-hunt-autopilot
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Firebase project values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: override model (default: gemini-2.0-flash)
# VITE_GEMINI_MODEL=gemini-2.0-flash
```

> **Model selection**: Set `VITE_GEMINI_MODEL` to any supported model ID. The spec mentions `gemini-2.0-flash` as default. `gemini-4-argon` is paid-tier. No code changes needed—just update the env var.

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173

### 4. Import sample data

Click **"Import Emails"** and select `public/sample-emails.json` (or drag-drop). The app will classify all 20 emails and build the pipeline.

## Running Tests

```bash
npm test
```

Runs Vitest unit tests for:
- `grouping.ts` – Email grouping, company normalization, role-null attachment
- `reminders.ts` – Reminder due dates, overdue detection, boundary cases
- `scamRules.ts` – Regex-based scam detection

## Running the Eval Script

The eval script classifies the fixture against the **real Gemini API** and compares results to `public/expected.json`:

```bash
npm run eval
```

Output: a table showing expected vs actual category for each email, category accuracy %, scam detection accuracy %, and a list of any mismatches.

> **Note**: The eval script uses `@google/generative-ai` (Node SDK) directly, bypassing the browser Firebase SDK. Requires `VITE_FIREBASE_API_KEY` to be set.

## Deploy to Firebase Hosting

```bash
npm run build
npx firebase deploy --only hosting
```

Or with the Firebase CLI installed globally:

```bash
firebase deploy --only hosting
```

## Data Model

```typescript
type EmailCategory =
  | "application_acknowledgment" | "interview_invitation" | "rejection"
  | "offer" | "scam" | "other";

interface RawEmail {
  id: number;
  from: string;
  subject: string;
  date: string; // ISO
  body: string;
}
```

See [`src/types.ts`](src/types.ts) for the full type definitions.

## Architecture

```
src/
  types.ts          – Core data types
  storage.ts        – localStorage abstraction + classification cache
  gemini.ts         – Gemini classification (Firebase AI Logic SDK)
  grouping.ts       – Email → Application grouping logic
  reminders.ts      – Pure reminder computation functions
  scamRules.ts      – Deterministic regex scam rules
  App.tsx           – Main app shell and state management
  components/
    ApplicationCard.tsx      – Pipeline card with reminder badge
    DetailPanel.tsx          – Email timeline detail view
    NeedsAttentionPanel.tsx  – Overdue reminders + scam flags
```

## Known Limitations & Design Decisions

1. **No authentication** – All data is local to the browser (localStorage). Multi-user support is out of scope.
2. **No Gmail/.mbox integration** – Import is JSON-only. The storage module is designed to be swapped for Firestore.
3. **Free-mail sender alone ≠ scam** – Per spec, a Gmail/Yahoo/etc. sender address without other red flags is NOT flagged.
4. **Email #5 (FinEdge recruiter)** – Category is `other` rather than `application_acknowledgment` because the email is outreach/inquiry, not a confirmation. The model may vary.
5. **Role normalization is approximate** – Normalizing "Software Engineer II" vs "Software Engineer" as different roles is intentional per the spec (different keys → different applications). Synonyms are not merged.
6. **Concurrency cap** – Gemini calls are batched with a concurrency limit of 4 to avoid rate limiting.
7. **Cache invalidation** – Cache is keyed by `emailId + contentHash(from|subject|date|body)`. Changing any field forces a re-classification.
8. **eval script model** – The eval script uses `@google/generative-ai` (Node.js compatible) rather than the browser Firebase SDK. Both use the same model and API key.
9. **Reference date default** – Defaults to `2026-10-24` as specified. Use the date picker in the header to change it.
