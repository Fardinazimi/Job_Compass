// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlVwlF_pK6eBxzWqWXCD9QO8ZQXH43KPM",
  authDomain: "job-compass-8aedf.firebaseapp.com",
  projectId: "job-compass-8aedf",
  storageBucket: "job-compass-8aedf.appspot.com",
  messagingSenderId: "1048256070849",
  appId: "1:1048256070849:web:f3d4a1f2c0b98e5c8c0c8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Authentication methods
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
    throw error;
  }
};
