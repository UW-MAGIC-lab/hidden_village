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

// Set the initial time of the last alert to the current time
let lastAlertTime = Date.now();

// Define a function to check the status of a set of promises
export const promiseChecker = async (frameRate, promises) => {
  // Set the data loss threshold and check interval in seconds
  const dataLossThresholdInSeconds = 2;
  const checkIntervalInSeconds = 10;

  // Calculate the number of frame packages and the data loss threshold in frames
  const totalFramePackages = checkIntervalInSeconds * frameRate;
  const dataLossThreshold = dataLossThresholdInSeconds * frameRate;

  // Calculate the starting index for the promises to check
  const startIndex = Math.max(promises.length - totalFramePackages - 1, 0);

  // Get the promises to check
  const promisesToCheck = promises.slice(startIndex);

  // Count the number of rejected promises
  const totalRejections = await countRejectedPromises(promisesToCheck);

  // If the number of rejected promises is greater than the data loss threshold, alert the user
  if (totalRejections > dataLossThreshold) {
    // Get the current time
    const currentTime = Date.now();

    // Check if enough time has passed since the last alert
    if (currentTime - lastAlertTime > checkIntervalInSeconds * 1000) {
      // Alert the user
      alert(
        "The program is not sending enough data to the database. Please check the internet connection/connection speed to make sure that it can support data collection for this experiment."
      );

      // Update the last alert time
      lastAlertTime = currentTime;
    }
  } else {
    // If there is no data loss, log a message to the console
    console.log("No data loss detected");
  }
};

// Define a function to count the number of rejected promises
const countRejectedPromises = async (promises) => {
  let rejectedCount = 0;

  // Use Promise.allSettled to check the status of each promise
  await Promise.allSettled(
    promises.map((promise) => {
      return promise
        .then(() => {
          // If the promise is resolved, do nothing
        })
        .catch(() => {
          // If the promise is rejected, increment the rejected count
          rejectedCount++;
        });
    })
  );

  // Return the total number of rejected promises
  return rejectedCount;
};
