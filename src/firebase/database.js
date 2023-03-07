// Firebase Init
import { getDatabase, ref, set, onValue } from "firebase/database";

export const db = getDatabase();

export function writeUserData(poseData) {
  set(ref(db, "/experimentalData"), {
    Pose_Data: poseData,
  });
}
