import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCA2fO3Q9UsbkIP5K13surFgBNc2ULn9ks",
  authDomain: "undangan-online-2b663.firebaseapp.com",
  databaseURL:
    "https://undangan-online-2b663-default-rtdb.firebaseio.com",
  projectId: "undangan-online-2b663",
  storageBucket: "undangan-online-2b663.firebasestorage.app",
  messagingSenderId: "959446780697",
  appId: "1:959446780697:web:a0a2b8aedc7ee3d6f1d388",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export async function ensureAuth(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          unsub();
          resolve(user);
        }
      },
      (err) => {
        unsub();
        reject(err);
      },
    );

    signInAnonymously(auth).catch((err) => {
      unsub();
      reject(err);
    });
  });
}

export { app, auth, db };