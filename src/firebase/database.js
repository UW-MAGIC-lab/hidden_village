// Firebase Init
import { ref, push } from "firebase/database";
import { db } from "./init";

const uid = "";
export const framerate = 30;
export function writeToDatabase(poseData, conjectureId) {
  const dateObj = new Date();
  const timestamp2 = dateObj.toUTCString();
  const timestamp = dateObj.toISOString();
  console.log("ISO:" + timestamp);
  console.log("UTC:" + timestamp2);
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

// export function writeUserData() {
//   // console.log("In call");
//   push(ref(db, "/Experimental_Data"), { ...poseData })
//     .then((response) => {
//       console.log("Success");
//     })
//     .catch((error) => {
//       console.log("Error");
//     });
//   // console.log("end of function call");
// }
