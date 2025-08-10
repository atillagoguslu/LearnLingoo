// Simple Firebase Auth helpers and minimal user profile storage
// Stores a light session in localStorage so UI can gate features (e.g. favorites)

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get, set, onValue, update } from "firebase/database";
import { auth, database } from "./dbInit";
import {
  saveAuthSession,
  clearAuthSession,
  loadAuthSession,
} from "../utilities/localStorage";

async function ensureUserProfileInDb({ uid, name, email }) {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snap = await get(userRef);
    if (!snap.exists()) {
      await set(userRef, {
        uid,
        name: name || "",
        email: email || "",
        favorites: [],
      });
    }
  } catch (_) {
    // Non-fatal; UI can still proceed
  }
}

export async function signUp(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  try {
    if (name) {
      await updateProfile(user, { displayName: name });
    }
  } catch (_) {
    // ignore profile update issues
  }

  const session = {
    uid: user.uid,
    email: user.email || email,
    name: name || user.displayName || "",
  };
  saveAuthSession(session);
  await ensureUserProfileInDb({
    uid: user.uid,
    name: session.name,
    email: session.email,
  });
  return session;
}

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Try to resolve a display name from DB if not on the auth profile
  let name = user.displayName || "";
  try {
    if (!name) {
      const snap = await get(ref(database, `users/${user.uid}`));
      if (snap.exists()) {
        const val = snap.val();
        if (val && typeof val.name === "string") name = val.name;
      }
    }
  } catch (_) {
    // ignore
  }

  const session = { uid: user.uid, email: user.email || email, name };
  saveAuthSession(session);
  await ensureUserProfileInDb({
    uid: user.uid,
    name: session.name,
    email: session.email,
  });
  return session;
}

export async function signOutUser() {
  await signOut(auth);
  clearAuthSession();
}

export function subscribeToAuthState(callback) {
  // Keep localStorage session in sync and notify caller
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      clearAuthSession();
      callback(null);
      return;
    }
    // Compute a light session object
    let name = user.displayName || "";
    try {
      if (!name) {
        const snap = await get(ref(database, `users/${user.uid}`));
        if (snap.exists()) {
          const val = snap.val();
          if (val && typeof val.name === "string") name = val.name;
        }
      }
    } catch (_) {
      // ignore
    }
    const session = { uid: user.uid, email: user.email || "", name };
    saveAuthSession(session);
    callback(session);
  });
  return unsubscribe;
}

export function getSavedSession() {
  return loadAuthSession();
}

// Favorites API (per-user)
export function subscribeToFavorites(uid, callback) {
  const userFavRef = ref(database, `users/${uid}/favorites`);
  const unsubscribe = onValue(
    userFavRef,
    (snap) => {
      const val = snap.val();
      const list = Array.isArray(val)
        ? val
        : val && typeof val === "object"
        ? Object.values(val)
        : [];
      callback(list.map((v) => String(v)));
    },
    () => callback([])
  );
  return unsubscribe;
}

export async function toggleFavorite(uid, teacherId) {
  const userRef = ref(database, `users/${uid}`);
  const snap = await get(userRef);
  const current = snap.exists() ? snap.val() : null;
  const list = Array.isArray(current?.favorites)
    ? current.favorites.map((v) => String(v))
    : [];
  const key = String(teacherId);
  const next = list.includes(key)
    ? list.filter((x) => x !== key)
    : [...list, key];
  await update(userRef, { favorites: next });
  return next;
}
