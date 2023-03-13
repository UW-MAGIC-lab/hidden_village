// Firebase Init
import { getDatabase, ref, set } from "firebase/database";

export const db = getDatabase();

export function writeUserData(poseData) {
  console.log("In call");
  set(ref(db, "experimentalData"), {
    Pose_Data: poseData,
  });
  console.log("end of function call");
}
