// Firebase Init
import { initializeApp } from "firebase/app";

const {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
} = process.env;

// Firebase config
const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Initialize Firebase
export default initializeApp(firebaseConfig);
