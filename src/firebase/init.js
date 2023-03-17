// Firebase Init
import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";

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
export const app = firebase.initializeApp(firebaseConfig);
export const db = getDatabase();
