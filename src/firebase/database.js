// Firebase Init
import { ref, push, getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getDatabase();
// const auth = getAuth();
// let userId;

// onAuthStateChanged(auth, (user) => {
//   userId = user.uid;
// });

export const writeToDatabase = async (poseData, conjectureId) => {
  const dateObj = new Date();
  const timestamp = dateObj.toISOString();
  const dbRef = ref(db, "/Experimental_Data");
  const dataToSend = {
    userId: "userId",
    poseData: JSON.stringify(poseData),
    conjectureId: conjectureId,
    timestamp: timestamp,
  };
  const promise = push(dbRef, dataToSend);
  return promise;
};

export const promiseChecker = async (currentFrameRate, promises) => {
  const acceptableDataLossInSeconds = 2;
  const runningTimeOfCheckingDataLossInSeconds = 10;
  const totalFramePackages =
    runningTimeOfCheckingDataLossInSeconds * currentFrameRate;
  const dataLossThreshold = acceptableDataLossInSeconds * currentFrameRate;

  let idx = promises.length - totalFramePackages;

  const slicedArray = promises.slice(idx > 0 ? 0 : idx);

  const totalRejections = await isRejected(slicedArray);

  // if there is an error then if researcher clicks ok to alert to continue then it will happen again in 0.33s (1000 ms / 30 frames)
  if (totalRejections > dataLossThreshold) {
    alert(
      "Hey Researcher, the program is broken and is not sending enough data to database!"
    );
  } else {
    // The code always enters in here and never in true because of totalRejections not adding success
    console.log("not true");
  }
};

function isRejected(data) {
  let rejected = 0;
  let success = 0;

  data.forEach((promise) => {
    promise
      .then(() => {
        // Doesnt add success for some reason need to debug more
        success++;
      })
      // Never enters the rejected
      .catch(() => {
        rejected++;
      });
  });
  console.log("work: " + success);
  return success;
}
