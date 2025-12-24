// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config (direct values)
const firebaseConfig = {
  apiKey: "AIzaSyC2soDqMLmX54OAqsKTJ06bEYyD7MoIB7k",
  authDomain: "vingo-food-delivery-24407.firebaseapp.com",
  projectId: "vingo-food-delivery-24407",
  storageBucket: "vingo-food-delivery-24407.firebasestorage.app",
  messagingSenderId: "993024976094",
  appId: "1:993024976094:web:85c8f9238b87f64dcb8e4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);
