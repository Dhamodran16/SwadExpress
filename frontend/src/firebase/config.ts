// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDmFQWDADXBfAHdITlh1VBoPWwnWZChjGA",
  authDomain: "wt-project-e22c7.firebaseapp.com",
  projectId: "wt-project-e22c7",
  storageBucket: "wt-project-e22c7.firebasestorage.app",
  messagingSenderId: "510805300509",
  appId: "1:510805300509:web:6577334c08f4aca8883df4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };