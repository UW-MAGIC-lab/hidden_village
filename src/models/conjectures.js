/**
@typedef {Object} NormalizedLandmark 
@property {number} x
@property {number} y
@property {number} z
@property {number} [visibility]
*/

/**
@typedef {Object} MatchingConfig
@property {string} segment - This should map to a particular "friendly name" of a POSE_LANDMARKS that should be matched
@property {string} data -  This corresponds to the key (in the landmarks) where you would find the "friendly name" of the POSE LANDMARK
*/

/**
@typedef {Object} PoseLandmarks
@property {Array.NormalizedLandmark} poseLandmarks
@property {Array.NormalizedLandmark} [faceLandmarks]
@property {Array.NormalizedLandmark} [rightHandLandmarks]
@property {Array.NormalizedLandmark} [leftHandLandmarks]
*/

/**
@typedef {Object} Pose
@property {PoseLandmarks} landmarks
@property {MatchingConfig} matchingConfig
@property {string} name
*/

/**
@typedef {Object} ExperimentConjecture
@property {string} conjecture
@property {string} poseDataFileName - name of the pose data file to load
@property {string} videoPath - name of the pose data file to load
*/
/**
 * @param {Object} props
 * @param {function} props.columnDimensions
 * @param {Pose} props.poseData
 * @param {function} props.rowDimensions
 * @param {function} props.onComplete
 * @param {boolean} props.debugMode
 * @param {ExperimentConjecture} props.conjectureData
 */

 import oppositeAnglePoseData from "./rawPoses/oppositeAnglePoses.json";
 import parallelogramPoseData from "./rawPoses/area_parallelogram.json";
 import areaDoubled from './rawPoses/area_doubled.json';
 import angleAngleAngle from './rawPoses/angleAngleAnglePoses.json';

const conjectures = [
  {
    conjecture:
      "The opposite angle of two lines that cross are always the same",
    poseDataFileName: "oppositeAnglePoses.json",
    videoPath: "../assets/animations/opposite_angle.webm",
  },
  {
    conjecture:
      "The area of a parallelogram is the same as the area of a rectangle with the same base and width",
    poseDataFileName: "area_parallelogram.json",
    videoPath: "../assets/animations/area_parallelogram_trimmed.webm",
  },
  {
    conjecture:
      "If you double the length and the width of a rectangle, then the area is exactly doubled.",
    poseDataFileName: "area_doubled.json",
    videoPath: "../assets/animations/area_doubled_trimmed.webm",
  },
  {
    conjecture:
      "Given that you know the measure of all three angles of a triangle, there is only one unique triangle that can be formed with these three angle measurements.",
    poseDataFileName: "angleAngleAnglePoses.json",
    videoPath: "../assets/animations/angle_angle_angle_trimmed.webm",
  },
];

const getPoseData = (poseDataFileName) => {
  switch (poseDataFileName) {
    case "oppositeAnglePoses.json":
      return oppositeAnglePoseData;
      break;
    case "area_parallelogram.json":
      return parallelogramPoseData;
      break;
    case "area_doubled.json":
      return areaDoubled;
      break;
    case "angleAngleAnglePoses.json":
      return angleAngleAngle;
      break;
    default:
      return null;
  }
}

export { conjectures, getPoseData };
