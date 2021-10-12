import { useCallback, useState } from "react";
import { Graphics } from "@inlet/react-pixi";
import {
  FACEMESH_FACE_OVAL,
  POSE_LANDMARKS,
} from "@mediapipe/holistic/holistic";

POSE_LANDMARKS.SOLAR_PLEXIS = 33;
POSE_LANDMARKS.PELVIS = 34;

// ****************************************************************
// Utility functions
// ****************************************************************
function objMap(obj, func) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}

function magnitude(point1, point2) {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

// ****************************************************************
// Component Logic
// ****************************************************************

const Pose = (props) => {
  const [width] = useState(props.width * 0.2);
  const [height] = useState(props.height * 0.2);

  const connectLandmarks = (landmarks, g) => {
    const coord = landmarks.shift();
    g.beginFill(0xff3300);
    g.lineStyle(4, 0xffd900, 1);
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

  const drawForeArms = (poseData, g) => {
    const foreArmLandmarks = (({
      RIGHT_SHOULDER,
      LEFT_SHOULDER,
      SOLAR_PLEXIS,
      RIGHT_ELBOW,
      LEFT_ELBOW,
    }) => ({
      RIGHT_SHOULDER,
      LEFT_SHOULDER,
      SOLAR_PLEXIS,
      RIGHT_ELBOW,
      LEFT_ELBOW,
    }))(POSE_LANDMARKS);
    const generalCoords = objMap(
      foreArmLandmarks,
      landmarkToCoordinates(poseData.poseLandmarks)
    );
    const armWidth =
      magnitude(generalCoords.RIGHT_SHOULDER, generalCoords.SOLAR_PLEXIS) *
      0.04;
    const rightForearmCoords = [
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
    const leftForearmCoords = [
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
    g.beginFill(0xff3300);
    g.drawCircle(abdomenCoords.PELVIS.x, abdomenCoords.PELVIS.y, radius);
    g.endFill();
  };

  const draw = useCallback(
    (g) => {
      g.clear();
      drawFace(props.poseData, g);
      drawForeArms(props.poseData, g);
      drawTorso(props.poseData, g);
      drawAbdomen(props.poseData, g);
    },
    [props.poseData]
  );

  return <Graphics draw={draw} />;
};

export default Pose;
