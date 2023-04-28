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

const conjectures = [
  {
    conjecture:
      "The area of a parallelogram is the same as the area of a rectangle with the same base and height",
    poseDataFileName: "area_parallelogram.json",
    videoPath: "../assets/animations/area_parallelogram_trimmed.webm",
  },
  {
    conjecture:
      "The area of a parallelogram is the same as the area of a rectangle with the same base and height",
    poseDataFileName: "area_parallelogram.json",
    videoPath: "../assets/animations/slowed_enriched_area.mp4",
  }
];

// Import the pose data
import oppositeAnglePoseData from "./rawPoses/oppositeAnglePoses.json";
import parallelogramPoseData from "./rawPoses/area_parallelogram.json";
import areaDoubled from "./rawPoses/area_doubled_2.json";
import angleAngleAngle from "./rawPoses/angleAngleAnglePoses.json";
import diagonalsRectangle from "./rawPoses/diagonals_rectangle.json";
import reflectionOverAxis from "./rawPoses/reflection_over_axis_poses.json";
import sumTwoSides from "./rawPoses/sum_two_sides_poses_2.json";
import sideAngleSide from "./rawPoses/side_angle_side_poses.json";
// reference the pose data
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
    case "diagonals_rectangle.json":
      return diagonalsRectangle;
      break;
    case "reflection_over_axis_poses.json":
      return reflectionOverAxis;
      break;
    case "sum_two_sides_poses.json":
      return sumTwoSides;
      break;
    case "side_angle_side_poses.json":
      return sideAngleSide;
      break;
    default:
      return null;
  }
};

// ***********************************
// Conjecture Video Data
// ***********************************
// HACK: as mentioned in the parcel issue https://github.com/parcel-bundler/parcel/issues/7643
// there's a weirdness that still exists with how parcel is resolving
// the URL paths

const oppositeAnglePath = new URL(
  "../assets/animations/opposite_angle.webm",
  import.meta.url
);
const parallelogramPath = new URL(
  "../assets/animations/area_parallelogram_trimmed.webm",
  import.meta.url
);
const parallelogram2Path = new URL(
  "../assets/animations/slowed_enriched_area.mp4",
  import.meta.url
);
const angleAngleAnglePath = new URL(
  "../assets/animations/angle_angle_angle_trimmed.webm",
  import.meta.url
);
const areaDoubledPath = new URL(
  "../assets/animations/area_doubled_trimmed_2.webm",
  import.meta.url
);
const diagonalsRectanglePath = new URL(
  "../assets/animations/diagonals_rectangle.webm",
  import.meta.url
);
const reflectionOverAxisPath = new URL(
  "../assets/animations/reflection_over_axis_trimmed.webm",
  import.meta.url
);
const sideAngleSidePath = new URL(
  "../assets/animations/side_angle_side_trimmed.webm",
  import.meta.url
);
const sumTwoSidesPath = new URL(
  "../assets/animations/sum_two_sides_trimmed_2.webm",
  import.meta.url
);

const getVideoFromPath = (path) => {
  // default is opposite angle
  switch (path) {
    case "../assets/animations/opposite_angle.webm":
      return oppositeAnglePath;
    case "../assets/animations/area_parallelogram_trimmed.webm":
      return parallelogramPath;
    case "../assets/animations/slowed_enriched_area.mp4":
      return parallelogram2Path;
    case "../assets/animations/angle_angle_angle_trimmed.webm":
      return angleAngleAnglePath;
    case "../assets/animations/area_doubled_trimmed.webm":
      return areaDoubledPath;
    case "../assets/animations/diagonals_rectangle.webm":
      return diagonalsRectanglePath;
    case "../assets/animations/reflection_over_axis_trimmed.webm":
      return reflectionOverAxisPath;
    case "../assets/animations/side_angle_side_trimmed.webm":
      return sideAngleSidePath;
    case "../assets/animations/sum_two_sides_trimmed.webm":
      return sumTwoSidesPath;
    default:
      return new URL(path, import.meta.url);
  }
};

export { conjectures, getPoseData, getVideoFromPath };
