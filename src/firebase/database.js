// Firebase Init
import { getDatabase, ref, set, push } from "firebase/database";

export const db = getDatabase();

export function writeUserData(poseData) {
  console.log("In call");
  push(ref(db, "/Experimental_Data"), { ...poseData })
    .then((response) => {
      console.log("Success");
    })
    .catch((error) => {
      console.log("Error");
    });
  console.log("end of function call");
}
