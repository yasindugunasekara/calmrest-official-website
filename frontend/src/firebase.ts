// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0kP8TKjkJYZ4dSJShDEYYx--mz4Ocud8",
  authDomain: "hotel-managmnet-website.firebaseapp.com",
  projectId: "hotel-managmnet-website",
  storageBucket: "hotel-managmnet-website.firebasestorage.app",
  messagingSenderId: "405341415797",
  appId: "1:405341415797:web:4df3e06ba00d7257f80b3c",
  measurementId: "G-W6VFYS47F8"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

export { auth };
