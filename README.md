<div align="center">
  <img src="public/icon-192.png" alt="Elite Tracker app icon" width="120" />

  # Elite Tracker

  **A mobile-first training and nutrition companion for consistent, measurable progress.**

  [Open the Web App](https://elitetracker.vercel.app/) ·
  [View the Repository](https://github.com/kietvohoanganh/elite-tracker.git)

  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
  [![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
</div>

## Overview

Elite Tracker combines workout programming, performance history, AI-assisted
meal logging, body-weight tracking, and adaptive calorie insights in one
responsive application. It is designed for fast daily use on the web and can
also be packaged as a native iOS app with Capacitor.

The nutrition workflow is intentionally simple: take a meal photo or describe
what you ate, review the estimated portions and macros, edit anything that
looks inaccurate, and save the result to today's log.

## Core Features

| Area | Capabilities |
| --- | --- |
| **Workout tracking** | Record sets, repetitions, load, completion state, and session duration |
| **Workout templates** | Create, edit, reuse, and import structured training plans |
| **Exercise library** | Browse built-in movements, add custom exercises, and save favorites |
| **Performance history** | Review previous sessions and inspect exercise-specific progress |
| **Meal photo analysis** | Estimate food items, portions, calories, protein, carbohydrates, and fat from an image |
| **Meal description analysis** | Turn a natural-language meal description into an editable nutrition estimate |
| **Nutrition review** | Correct food names, serving sizes, calories, and macros before saving |
| **Daily nutrition log** | Track calorie and macro totals alongside body weight |
| **Dynamic TDEE** | Estimate real-world energy expenditure from intake and weight trends |
| **Cross-platform experience** | Responsive web interface with native iOS camera and photo-library support |

## Product Flow

```mermaid
flowchart LR
    A["Plan a workout"] --> B["Log sets and performance"]
    B --> C["Review training history"]
    D["Take a meal photo"] --> F["AI nutrition estimate"]
    E["Describe a meal"] --> F
    F --> G["Review and edit P / C / F / calories"]
    G --> H["Save daily nutrition"]
    H --> I["Track weight and dynamic TDEE"]
```

## Technology

- **Frontend:** React 19 and Vite 8
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **AI nutrition:** Firebase AI Logic with Gemini 2.5 Flash
- **Native runtime:** Capacitor 8
- **Camera access:** Capacitor Camera
- **Charts:** Recharts
- **Workout image parsing:** Vision-based OCR for local macOS development

## Architecture

```mermaid
flowchart TD
    UI["React + Vite application"]
    AUTH["Firebase Authentication"]
    DB["Cloud Firestore"]
    AI["Firebase AI Logic"]
    GEMINI["Gemini 2.5 Flash"]
    IOS["Capacitor iOS application"]
    CAMERA["Camera and photo library"]

    UI --> AUTH
    UI --> DB
    UI --> AI
    AI --> GEMINI
    IOS --> UI
    IOS --> CAMERA
```

Meal analysis uses Firebase AI Logic directly from the application. The project
does not require a third-party food-search API key.

## AI Meal Analysis

The meal analyzer supports two input modes:

- **Photo:** capture a meal with the native camera or choose an image.
- **Description:** enter foods and portions in natural language.

The result contains editable meal items with estimated grams, calories,
protein, carbohydrates, fat, and confidence. Nothing is added to the daily log
until the user reviews and confirms the estimate.

Nutrition estimates are informational and should not replace professional
medical or dietary advice.

## Workout Image Import

During local macOS development, workout-template screenshots can be parsed
through the Vite middleware and the Vision OCR script in
`scripts/ocr-workout-image.swift`.

For interface testing without OCR, set:

```bash
VITE_USE_MOCK_IMAGE_PARSER=true
```

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## iOS

Build the web application and synchronize it with the native project:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Camera and photo-library permission descriptions are defined in
`ios/App/App/Info.plist`.

## Data Model

Authenticated user data is isolated beneath the user's Firebase UID:

```text
users/{userId}/daily_logs/{date}
users/{userId}/history/{workoutId}
users/{userId}/workout_templates/{templateId}
users/{userId}/custom_exercises/{exerciseId}
users/{userId}/preferences/exercises
```

## Project Structure

```text
.
├── public/                 # Web application icons and manifest
├── scripts/                # Local OCR tooling
├── src/
│   ├── components/         # Reusable interface components
│   ├── services/           # Meal analysis and image parsing
│   ├── utils/              # Exercise and template utilities
│   ├── App.jsx             # Main application and Firebase integration
│   └── main.jsx            # React entry point
├── ios/                    # Capacitor iOS project
├── firestore.rules         # User-scoped Firestore access rules
├── capacitor.config.ts
└── vite.config.js
```

---

<div align="center">
  Built for disciplined training, practical nutrition tracking, and long-term progress.
</div>
