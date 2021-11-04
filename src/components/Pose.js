import { useCallback, useState } from "react";
import { Graphics } from "@inlet/react-pixi";
import {
  FACEMESH_FACE_OVAL,
  POSE_LANDMARKS,
} from "@mediapipe/holistic/holistic";

POSE_LANDMARKS.SOLAR_PLEXIS = 33;
POSE_LANDMARKS.PELVIS = 34;

const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5,
  INDEX_FINGER_PIP: 6,
  INDEX_FINGER_DIP: 7,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9,
  MIDDLE_FINGER_PIP: 10,
  MIDDLE_FINGER_DIP: 11,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13,
  RING_FINGER_PIP: 14,
  RING_FINGER_DIP: 15,
  RING_FINGER_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
};

// ****************************************************************
// Utility functions
// ****************************************************************
function objMap(obj, func) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}

const magnitude = (point1, point2) => {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
};

const FILL_COLOR = 0xfa655a;
const STROKE_COLOR = 0x2080d5;

// ****************************************************************
// Component Logic
// ****************************************************************

const Pose = (props) => {
  const [width] = useState(props.width * 0.2);
  const [height] = useState(props.height * 0.2);
  const [armWidth, setArmWidth] = useState(0);

  const connectLandmarks = (landmarks, g) => {
    const coord = landmarks.shift();
    g.beginFill(FILL_COLOR);
    g.lineStyle(1, STROKE_COLOR, 1);
    g.moveTo(coord.x, coord.y);
    landmarks.forEach((coordinate) => {
      g.lineTo(coordinate.x, coordinate.y);
    });
    g.lineTo(coord.x, coord.y);
    g.endFill();
  };

  const landmarkToCoordinates = (data) => {
    return (landmark) => {
      const coordinates = Object.assign({}, data[landmark]);
      coordinates.x = coordinates.x * width - width;
      coordinates.y = coordinates.y * height - height;
      return coordinates;
    };
  };

  const calculateArmWidth = (poseData) => {
    const landmarks = (({ RIGHT_SHOULDER, SOLAR_PLEXIS }) => ({
      RIGHT_SHOULDER,
      SOLAR_PLEXIS,
    }))(POSE_LANDMARKS);
    const coords = objMap(
      landmarks,
      landmarkToCoordinates(poseData.poseLandmarks)
    );
    return magnitude(coords.RIGHT_SHOULDER, coords.SOLAR_PLEXIS) * 0.04;
  };

  const drawBiceps = (poseData, g) => {
    const bicepLandmarks = (({
      RIGHT_SHOULDER,
      LEFT_SHOULDER,
      RIGHT_ELBOW,
      LEFT_ELBOW,
    }) => ({
      RIGHT_SHOULDER,
      LEFT_SHOULDER,
      RIGHT_ELBOW,
      LEFT_ELBOW,
    }))(POSE_LANDMARKS);
    const generalCoords = objMap(
      bicepLandmarks,
      landmarkToCoordinates(poseData.poseLandmarks)
    );
    const rightBicepCoords = [
      {
        x: generalCoords.RIGHT_SHOULDER.x + armWidth,
        y: generalCoords.RIGHT_SHOULDER.y + armWidth,
      },
      {
        x: generalCoords.RIGHT_SHOULDER.x - armWidth,
        y: generalCoords.RIGHT_SHOULDER.y - armWidth,
      },
      generalCoords.RIGHT_ELBOW,
    ];
    const leftBicepCoords = [
      {
        x: generalCoords.LEFT_SHOULDER.x + armWidth,
        y: generalCoords.LEFT_SHOULDER.y + armWidth,
      },
      {
        x: generalCoords.LEFT_SHOULDER.x - armWidth,
        y: generalCoords.LEFT_SHOULDER.y - armWidth,
      },
      generalCoords.LEFT_ELBOW,
    ];
    connectLandmarks(rightBicepCoords, g);
    connectLandmarks(leftBicepCoords, g);
  };

  const drawForearms = (poseData, g) => {
    const forearmLandmarks = (({
      RIGHT_ELBOW,
      RIGHT_WRIST,
      LEFT_ELBOW,
      LEFT_WRIST,
    }) => ({
      RIGHT_ELBOW,
      RIGHT_WRIST,
      LEFT_ELBOW,
      LEFT_WRIST,
    }))(POSE_LANDMARKS);
    const generalCoords = objMap(
      forearmLandmarks,
      landmarkToCoordinates(poseData.poseLandmarks)
    );
    const rightForearmCoords = [
      {
        x: generalCoords.RIGHT_ELBOW.x + armWidth,
        y: generalCoords.RIGHT_ELBOW.y + armWidth,
      },
      {
        x: generalCoords.RIGHT_ELBOW.x - armWidth,
        y: generalCoords.RIGHT_ELBOW.y - armWidth,
      },
      generalCoords.RIGHT_WRIST,
    ];
    const leftForearmCoords = [
      {
        x: generalCoords.LEFT_ELBOW.x + armWidth,
        y: generalCoords.LEFT_ELBOW.y + armWidth,
      },
      {
        x: generalCoords.LEFT_ELBOW.x - armWidth,
        y: generalCoords.LEFT_ELBOW.y - armWidth,
      },
      generalCoords.LEFT_WRIST,
    ];
    connectLandmarks(rightForearmCoords, g);
    connectLandmarks(leftForearmCoords, g);
  };

  const drawFace = (poseData, g) => {
    let faceOvalCoords = FACEMESH_FACE_OVAL.map((indexPair) => {
      const coordinates = poseData.faceLandmarks[indexPair[0]];
      coordinates.x = coordinates.x * width - width;
      coordinates.y = coordinates.y * height - height;
      return coordinates;
    });
    connectLandmarks(faceOvalCoords, g);
  };

  const drawTorso = (poseData, g) => {
    const torsoLandmarks = (({
      RIGHT_SHOULDER,
      LEFT_SHOULDER,
      SOLAR_PLEXIS,
    }) => ({ RIGHT_SHOULDER, LEFT_SHOULDER, SOLAR_PLEXIS }))(POSE_LANDMARKS);
    let torsoCoords = objMap(
      torsoLandmarks,
      landmarkToCoordinates(poseData.poseLandmarks)
    );
    connectLandmarks(Object.values(torsoCoords), g);
  };

  const drawAbdomen = (poseData, g) => {
    const abdomenLandmarks = (({ PELVIS, LEFT_HIP }) => ({ PELVIS, LEFT_HIP }))(
      POSE_LANDMARKS
    );
    let abdomenCoords = objMap(
      abdomenLandmarks,
      landmarkToCoordinates(poseData.poseLandmarks)
    );
    const radius = magnitude(abdomenCoords.PELVIS, abdomenCoords.LEFT_HIP); //*0.8
    g.beginFill(FILL_COLOR);
    g.drawCircle(abdomenCoords.PELVIS.x, abdomenCoords.PELVIS.y, radius);
    g.endFill();
  };

  const drawHands = (poseData, g) => {
    const palmLandmarks = (({
      WRIST,
      THUMB_CMC,
      INDEX_FINGER_MCP,
      MIDDLE_FINGER_MCP,
      RING_FINGER_MCP,
      PINKY_MCP,
    }) => ({
      WRIST,
      THUMB_CMC,
      INDEX_FINGER_MCP,
      MIDDLE_FINGER_MCP,
      RING_FINGER_MCP,
      PINKY_MCP,
    }))(HAND_LANDMARKS);
    if (poseData.rightHandLandmarks) {
      let rightPalmCoords = objMap(
        palmLandmarks,
        landmarkToCoordinates(poseData.rightHandLandmarks)
      );
      connectLandmarks(Object.values(rightPalmCoords), g);
    }
    if (poseData.leftHandLandmarks) {
      let leftPalmCoords = objMap(
        palmLandmarks,
        landmarkToCoordinates(poseData.leftHandLandmarks)
      );
      connectLandmarks(Object.values(leftPalmCoords), g);
    }
  };

  const draw = useCallback(
    (g) => {
      g.clear();
      setArmWidth(calculateArmWidth(props.poseData));
      // NOTE: Order of drawing body section matters, do not reorder
      drawFace(props.poseData, g);
      drawTorso(props.poseData, g);
      drawAbdomen(props.poseData, g);
      drawBiceps(props.poseData, g);
      drawForearms(props.poseData, g);
      drawHands(props.poseData, g);
    },
    [props.poseData]
  );

  return <Graphics draw={draw} />;
};

export default Pose;
