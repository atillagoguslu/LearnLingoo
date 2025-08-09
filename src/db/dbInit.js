import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const VITE_FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: "learnlingo-ati.firebaseapp.com",
  databaseURL:
    "https://learnlingo-ati-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "learnlingo-ati",
  storageBucket: "learnlingo-ati.firebasestorage.app",
  messagingSenderId: "908070665374",
  appId: "1:908070665374:web:d6b81b5d5c2555c6a84f8f",
  measurementId: "G-LB704J82KB",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { auth, database, analytics };
