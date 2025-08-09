# LearnLingo

Basic React + Vite web app with Firebase (REST) for auth and Realtime Database.

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm i`
3. Run dev: `npm run dev`

## Env

Create `.env` based on:

```
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_DB_URL=https://YOUR_PROJECT-id-default-rtdb.firebaseio.com
```

## Firebase via REST

- Auth endpoints: Identity Toolkit (sign up/in, refresh).
- Database: Realtime Database JSON REST under `VITE_FIREBASE_DB_URL`.

Service: `src/db/dbService.js`

- `auth.signUp({ email, password, displayName })`
- `auth.signIn({ email, password })`
- `auth.getCurrentUser()` / `auth.signOut()`
- `teachers.getPage({ limit, startAfterKey })`
- `teachers.getById(teacherId)`
- `favorites.add/remove/toggle/isFavorite/getAllIdsForCurrentUser()`
- `bookings.create({...})`

Local storage utils: `src/utilities/localStorage.js`.

## Notes

- Add your Firebase Realtime Database rules to allow read for teachers and authenticated reads/writes for user-specific data.
- To seed example teachers, call `teachers.seedFromLocalSample()` from a dev-only action.
