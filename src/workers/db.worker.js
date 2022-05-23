
let logData = [];

// WORKER LOGIC
function logPose (poseData, conjectureData, timestamp, db) {
  const payload = {
    leftHandLandmarks: poseData.leftHandLandmarks,
    rightHandLandmarks: poseData.rightHandLandmarks,
    poseLandmarks: poseData.poseLandmarks,
    faceLandmarks: poseData.faceLandmarks,
  }
  logData.push({
    event: "pose",
    timestamp: Date.now(),
    data: payload,
    conjectureId: conjectureData.id
  })
};

function logExperimentTransition (state, conjectureData, timestamp, db) {
  logData.push({
    event: "experimentTransition",
    data: state.value,
    conjectureId: conjectureData.id
  })
  console.log("transition data pushed");
}
// downsample logData b/c we don't want to a full 30-60 FPS
// SAMPLE_RATE represents how many frame we want to skip
const SAMPLE_RATE = 7;
// eslint-disable-next-line no-restricted-globals
onmessage = function (e) {
  const workerData = e.data;
  switch (workerData.type) {
    case "logPose":
      logPose(workerData.payload, workerData.conjectureData, workerData.timeStamp, workerData.db);
      break;
    case "logTransition":
      logExperimentTransition(workerData.payload, workerData.conjectureData, workerData.timeStamp, workerData.db);
      break;
    case "returnEvents":
      postMessage(JSON.parse(JSON.stringify(logData.filter((_, index) => index % SAMPLE_RATE === 0))));
      logData = [];
      break;
    case "download":
      download(workerData.db);
      break;
    default:
      console.error('[WORKER] Web worker onmessage error: unknown workerData.type');
      break;
  }
}