import { useCallback } from "react";
import { Graphics } from "@inlet/react-pixi";
import {
  FACEMESH_FACE_OVAL,
  POSE_LANDMARKS,
} from "@mediapipe/holistic/holistic";

POSE_LANDMARKS.SOLAR_PLEXIS = 33;
POSE_LANDMARKS.PELVIS = 34;

function objMap(obj, func) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}

const Pose = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      drawFace(props.poseData, g);
      drawTorso(props.poseData, g);
      drawAbdomen(props.poseData, g);
    },
    [props.poseData]
  );

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

  const drawFace = (poseData, g) => {
    let faceOvalCoords = FACEMESH_FACE_OVAL.map((indexPair) => {
      const coordinates = poseData.faceLandmarks[indexPair[0]];
      coordinates.x = coordinates.x * props.width * 0.2 - props.width * 0.2;
      coordinates.y = coordinates.y * props.height * 0.2 - props.height * 0.2;
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
    let torso = objMap(torsoLandmarks, (landmark) => {
      const coordinates = Object.assign({}, poseData.poseLandmarks[landmark]);
      coordinates.x = coordinates.x * props.width * 0.2 - props.width * 0.2;
      coordinates.y = coordinates.y * props.height * 0.2 - props.height * 0.2;
      return coordinates;
    });
    connectLandmarks(Object.values(torso), g);
  };

  const drawAbdomen = (poseData, g) => {
    const abdomenLandmarks = (({ PELVIS, LEFT_HIP }) => ({ PELVIS, LEFT_HIP }))(
      POSE_LANDMARKS
    );
    let abdomen = objMap(abdomenLandmarks, (landmark) => {
      const coordinates = Object.assign({}, poseData.poseLandmarks[landmark]);
      coordinates.x = coordinates.x * props.width * 0.2 - props.width * 0.2;
      coordinates.y = coordinates.y * props.height * 0.2 - props.height * 0.2;
      return coordinates;
    });
    const radius = Math.sqrt(
      (abdomen.PELVIS.x - abdomen.LEFT_HIP.x) ** 2 +
        (abdomen.PELVIS.y - abdomen.LEFT_HIP.y) ** 2
    ); //*0.8
    g.beginFill(0xff3300);
    g.drawCircle(abdomen.PELVIS.x, abdomen.PELVIS.y, radius);
    g.endFill();
  };

  return <Graphics draw={draw} />;
};

export default Pose;
