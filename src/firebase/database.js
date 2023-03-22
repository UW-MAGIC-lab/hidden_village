// Firebase Init
import { ref, push } from "firebase/database";
import { db } from "./init";

const uid = "Unique Identifier";
export const framerate = 30;
export function writeToDatabase(poseData, conjectureId) {
  const dateObj = new Date();
  const timestamp = dateObj.toISOString();
  push(ref(db, "/Experimental_Data"), {
    // documentId: documentid,
    username: "username",
    userId: uid,
    poseData: JSON.stringify(poseData),
    conjectureId: conjectureId,
    timestamp: timestamp,
  })
    .then((response) => {
      console.log("Success");
    })
    .catch((error) => {
      console.log("Error");
    });
}
