// Firebase Init
import { ref, push, getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getDatabase();

// User Id functionality will be added in a different PR
let userId;

// Get the Firebase authentication instance
const auth = getAuth();

// Listen for changes to the authentication state
// and update the userId variable accordingly
onAuthStateChanged(auth, (user) => {
  userId = user.uid;
});

// Export a function named writeToDatabase
export const writeToDatabase = async (poseData, conjectureId, frameRate) => {
  // Create a new date object to get a timestamp
  const dateObj = new Date();
  const timestamp = dateObj.toISOString();

  // Create a reference to the Firebase Realtime Database
  const dbRef = ref(db, "/Experimental_Data");

  // Create an object to send to the database
  // This object includes the userId, poseData, conjectureId, frameRate, and timestamp
  const dataToSend = {
    userId,
    poseData: JSON.stringify(poseData),
    conjectureId,
    frameRate,
    timestamp,
  };

  // Push the data to the database using the dbRef reference
  const promise = push(dbRef, dataToSend);

  // Return the promise that push() returns
  return promise;
};
