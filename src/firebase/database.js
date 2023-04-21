// Firebase Init
import { ref, push, getDatabase } from "firebase/database";

const db = getDatabase();

// User Id functionality will be added in a different PR
let userId = "placeholder";

export const writeToDatabase = async (poseData, conjectureId, frameRate) => {
  const dateObj = new Date();
  const timestamp = dateObj.toISOString();
  const dbRef = ref(db, "/Experimental_Data");
  const dataToSend = {
    userId,
    poseData: JSON.stringify(poseData),
    conjectureId,
    frameRate,
    timestamp,
  };
  const promise = push(dbRef, dataToSend);
  return promise;
};
