<div align="center">

# LearnLingo

Find the right language tutor, book a trial lesson, and favorite teachers you love.

![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![React%20Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=white)
![react--hook--form](https://img.shields.io/badge/react--hook--form-7-EC5990)
![Yup](https://img.shields.io/badge/Yup-1-2E7D32)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)

</div>

---

## ✨ Overview

LearnLingo is a modern Vite + React single‑page app that helps learners discover language tutors, explore detailed profiles and reviews, and book a trial lesson. Authentication is powered by Firebase. Forms are built with react‑hook‑form and validated with Yup. Favorites are persisted per user in Firebase and survive page refreshes.

## 🚀 Live-ready Highlights

- ✅ Three pages: `Home`, `Teachers`, `Favorites`
- 🔐 Auth with Firebase: registration, login, logout (modals)
- 🧠 Strong form UX: react-hook-form + Yup, all fields required
- 🗂️ Teachers list with filters (language, level, price) and server‑aware pagination
- ❤️ Favorites per authorized user (stored in Firebase), persisted between sessions
- 🔍 “Read more” expands rich teacher details with reviews
- 📅 “Book trial lesson” opens a validated booking form
- ♿ Modal UX: close by cross, backdrop click, or Esc key
- 🧭 Protected routes for `Teachers` and `Favorites`
- ⚡ Vite dev server, production build ready for Vercel

> Note: In this implementation, `Teachers` and `Favorites` routes are gated behind auth. Unauthorized users attempting to favorite a teacher are prompted appropriately.

---

## 📦 Tech Stack

- Vite 7
- React 19
- React Router 7 (using `react-router` package)
- Firebase (Auth + Realtime Database)
- react-hook-form + @hookform/resolvers
- Yup validation
- ESLint 9

---

## 🧭 App Structure

```
src/
  App.jsx                # App shell + route outlet
  main.jsx               # Router, routes, protected pages
  components/
    Header.jsx           # Top navigation + auth modals
    modals/
      login.jsx          # Login modal (Esc/backdrop/cross to close)
      registration.jsx   # Registration modal
    teachersPage/
      CardList.jsx       # 4-per-page list + Load more
      Card.jsx           # Teacher card (read more, favorite, book)
      BookTrialLesson.jsx# Booking form modal (validated)
      filters/TeacherFilter.jsx
    favouritePage/
      ...                # Favorites page UI helpers (shared styles via Card)
  pages/
    HomePage.jsx         # Marketing hero + stats
    TeachersPage.jsx     # Filters + list
    FavoritesPage.jsx    # User’s favorites (authorized only)
  db/
    dbInit.js            # Firebase App/Auth/DB/Analytics
    auth.js              # Sign in/up/out, session, favorites API
    teachers.js          # DB queries, pagination, filtering
  utilities/
    validations.js       # Yup schemas
    localStorage.js      # Session helpers
    pageAuthorization.jsx# Route guard
  constants/ImportedImages.js
```

---

## 🔎 Teachers: Filtering, Pagination, and Data Model

- Displays 4 cards initially; click “Load more” to fetch the next page.
- Filters: language, level, exact price per hour.
- Under the hood (`src/db/teachers.js`):
  - Uses Firebase Realtime Database queries.
  - Applies one primary server-side filter (price) where possible.
  - Applies secondary filters (language/level) client-side for robust results.
  - Cursor-based pagination ensures no duplicates between pages.

Expected `teachers` collection shape (flexible; arrays or keyed objects supported):

```json
{
  "teachers": {
    "0": {
      "name": "Jane",
      "surname": "Doe",
      "avatar_url": "https://...",
      "languages": ["english", "spanish"],
      "levels": ["A1 Beginner", "A2 Elementary"],
      "price_per_hour": 20,
      "lessons_done": 122,
      "rating": 4.9,
      "lesson_info": "Personalized 1:1 online lessons",
      "conditions": ["First lesson free"],
      "experience": "5+ years teaching adults",
      "reviews": [
        {
          "reviewer_name": "Alex",
          "reviewer_rating": 5,
          "comment": "Amazing lesson!"
        }
      ]
    }
  }
}
```

---

## ❤️ Favorites

- Only authorized users can add/remove favorites.
- Stored at `users/{uid}/favorites` in Firebase Realtime Database.
- UI state syncs live via a subscription; selections persist after refresh.

---

## 🔐 Authentication & Modals

- Login and registration live in modals.
- Validation via Yup; all fields are required.
- Each modal closes via cross icon, backdrop click, or Esc key.

Session is stored in `localStorage` for quick gating and is synced with Firebase Auth state.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm 9+

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env.local` in the project root with your Firebase web API key:

```bash
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_WEB_API_KEY
```

Other Firebase config values are already embedded in `src/db/dbInit.js` for the LearnLingo project. If you fork this app for your own Firebase project, update `authDomain`, `databaseURL`, `projectId`, etc. accordingly.

### 3) Run the app

```bash
npm run dev
```

### 4) Build and preview

```bash
npm run build
npm run preview
```

### Useful scripts

```bash
npm run lint       # Run ESLint
```

---

## ☁️ Deploying to Vercel

1. Push the repository to GitHub/GitLab.
2. Create a new Vercel project and import the repo.
3. Set Environment Variables:
   - `VITE_FIREBASE_API_KEY`
4. Build settings:
   - Install Command: `npm ci` (or `npm install`)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy. Vercel will serve the SPA and fallback routes automatically.

---

## 🔒 Route Protection

`/teachers` and `/favorites` are protected with a simple authorization wrapper (`src/utilities/pageAuthorization.jsx`). Unauthorized users are redirected to `Home` until they sign in.

---

## 🧪 UX & Accessibility Notes

- Keyboard users can close modals with `Esc`.
- Focus order and visual indicators are preserved by default components and styles.
- Images include `alt` text; decorative icons avoid noise.

---

## 🧩 Design Decisions & Trade‑offs

- React Router v7 single package (`react-router`) for modern routing.
- Realtime Database querying favors correctness and pagination consistency; secondary filters are applied client‑side for flexibility.
- Favorites live in Firebase (not only localStorage) to keep state consistent across devices and refreshes.

---

## 🤝 Contributing

Issues and PRs are welcome. If you plan significant changes (e.g., switching DB, adding SSR), please open an issue first to discuss the approach.

---

## 📄 License

This project currently ships without an explicit license. If you intend to use it beyond learning or evaluation, consider adding a license file (e.g., MIT) to the repository.

---

## 🙌 Acknowledgements

- Built with Vite and React
- Firebase Auth & Realtime Database
- react-hook-form & Yup for forms and validation
