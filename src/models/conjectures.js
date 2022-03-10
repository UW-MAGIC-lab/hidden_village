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
      "The opposite angle of two lines that cross are always the same.",
    poseDataFileName: "oppositeAnglePoses.json",
    videoPath: "../assets/animations/opposite_angle.webm",
  },
];

export { conjectures };
