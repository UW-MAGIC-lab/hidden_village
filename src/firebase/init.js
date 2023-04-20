// Firebase Init
import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";

// const {
//   apiKey,
//   authDomain,
//   databaseURL,
//   projectId,
//   storageBucket,
//   messagingSenderId,
//   appId,
// } = process.env;

// Firebase config
// const firebaseConfig = {
//   // apiKey,
//   // authDomain,
//   // databaseURL,
//   // projectId,
//   // storageBucket,
//   // messagingSenderId,
//   // appId,
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   databaseURL: process.env.databaseURL,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
// };

const firebaseConfig = {
  apiKey: "AIzaSyB1hD2nHSxuudHr2Ij6gsOTBGY1rgiy2QU",
  authDomain: "hidden-village-8cba8.firebaseapp.com",
  databaseURL: "https://hidden-village-8cba8-default-rtdb.firebaseio.com",
  projectId: "hidden-village-8cba8",
  storageBucket: "hidden-village-8cba8.appspot.com",
  messagingSenderId: "51453066273",
  appId: "1:51453066273:web:7af952db8e6f84fdb2f760",
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
