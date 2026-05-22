
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCymLRdqPlBnQ5iUXKYxcSAHN8mCnbM5o",
  authDomain: "my-glow-232b4.firebaseapp.com",
  projectId: "my-glow-232b4",
  storageBucket: "my-glow-232b4.firebasestorage.app",
  messagingSenderId: "1030578019289",
  appId: "1:1030578019289:web:a23a7cf34c9758c9ae57c8",
  measurementId: "G-5W98KWHHDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);