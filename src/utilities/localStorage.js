// Local Storage helpers for LearnLingo

const AUTH_KEY = "learnlingo.auth.session.v1";

export function saveAuthSession(session) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to save auth session", e);
  }
}

export function loadAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    // ignore
  }
}

// Generic helpers
export function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

export function loadJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
