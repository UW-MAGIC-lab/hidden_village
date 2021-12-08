import { useCallback, useState } from "react";
import { Graphics, Container } from "@inlet/react-pixi";
import {
  FACEMESH_FACE_OVAL,
  POSE_LANDMARKS,
} from "@mediapipe/holistic/holistic";
import { blue, yellow, pink } from "../../utils/colors";
import { LANDMARK_GROUPINGS } from "./landmark_utilities";
import { landmarkToCoordinates, objMap } from "./pose_drawing_utilities";
import { scale } from "chroma-js";

const matchedFill = scale([yellow.toString(16), pink.toString(16)]).domain([
  0, 100,
]);
const matchedStroke = scale([blue.toString(16), pink.toString(16)]).domain([
  0, 100,
]);

// ****************************************************************
// Utility functions
// ****************************************************************
const magnitude = (point1, point2) => {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
};

const FILL_COLOR = yellow;
const STROKE_COLOR = blue;

// ****************************************************************
// Component Logic
// ****************************************************************

const Pose = (props) => {
  const [armWidth, setArmWidth] = useState(0);
  const { colAttr } = props;
  const { width, height } = colAttr;

  const connectLandmarks = (landmarks, g, similarityScoreSegment) => {
    let fillColor = yellow;
    let strokeColor = blue;
    if (
      props.similarityScores &&
      props.similarityScores.length > 1 &&
      similarityScoreSegment
    ) {
      props.similarityScores.forEach((score) => {
        if (score.segment === similarityScoreSegment) {
          fillColor = parseInt(
            matchedFill(score.similarityScore).hex().substring(1),
            16
          );
          strokeColor = parseInt(
            matchedStroke(score.similarityScore).hex().substring(1),
            16
          );
        }
      });
    }
    // return if landmarks x or y is larger than width or height
    if (landmarks.some((l) => l.x > width || l.y > height)) {
      return;
    }
    const coord = landmarks.shift();
    g.beginFill(fillColor);
    g.lineStyle(4, strokeColor, 1);
    g.moveTo(coord.x, coord.y);
    landmarks.forEach((coordinate) => {
      g.lineTo(coordinate.x, coordinate.y);
    });
    g.lineTo(coord.x, coord.y);
    g.endFill();
  };

  const connectFinger = (landmarks, g) => {
    g.beginFill(FILL_COLOR);
    g.lineStyle(4, STROKE_COLOR, 1);
    const coord = landmarks.shift();
    g.moveTo(coord.x, coord.y);
    landmarks.forEach((coordinate) => {
      g.lineTo(coordinate.x, coordinate.y);
    });
    g.endFill();
  };

  const calculateArmWidth = (poseData) => {
    const landmarks = (({ RIGHT_SHOULDER, SOLAR_PLEXIS }) => ({
      RIGHT_SHOULDER,
      SOLAR_PLEXIS,
    }))(POSE_LANDMARKS);
    const coords = objMap(
      landmarks,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    return magnitude(coords.RIGHT_SHOULDER, coords.SOLAR_PLEXIS) * 0.04;
  };

  const drawBiceps = (poseData, g) => {
    const generalCoords = objMap(
      LANDMARK_GROUPINGS.BICEP_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
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
    connectLandmarks(rightBicepCoords, g, "RIGHT_BICEP");
    connectLandmarks(leftBicepCoords, g, "LEFT_BICEP");
  };

  const drawForearms = (poseData, g) => {
    const generalCoords = objMap(
      LANDMARK_GROUPINGS.FOREARM_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    let rightWrist;
    let leftWrist;
    if (poseData.rightHandLandmarks) {
      rightWrist = objMap(
        LANDMARK_GROUPINGS.WRIST_LANDMARK,
        landmarkToCoordinates(poseData.rightHandLandmarks, width, height)
      ).WRIST;
    } else {
      rightWrist = generalCoords.RIGHT_WRIST;
    }
    if (poseData.leftHandLandmarks) {
      leftWrist = objMap(
        LANDMARK_GROUPINGS.WRIST_LANDMARK,
        landmarkToCoordinates(poseData.leftHandLandmarks, width, height)
      ).WRIST;
    } else {
      leftWrist = generalCoords.LEFT_WRIST;
    }
    const rightForearmCoords = [
      {
        x: generalCoords.RIGHT_ELBOW.x + armWidth,
        y: generalCoords.RIGHT_ELBOW.y + armWidth,
      },
      {
        x: generalCoords.RIGHT_ELBOW.x - armWidth,
        y: generalCoords.RIGHT_ELBOW.y - armWidth,
      },
      rightWrist,
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
      leftWrist,
    ];
    connectLandmarks(rightForearmCoords, g, "RIGHT_FOREARM");
    connectLandmarks(leftForearmCoords, g, "LEFT_FOREARM");
  };

  const drawFace = (poseData, g) => {
    let faceOvalCoords = FACEMESH_FACE_OVAL.map((indexPair) => {
      const coordinates = poseData.faceLandmarks[indexPair[0]];
      coordinates.x *= width;
      coordinates.y *= height;
      return coordinates;
    });
    connectLandmarks(faceOvalCoords, g);
  };

  // create a drawThighs function that mimics the drawBiceps function
  // but uses the LEFT_HIP and RIGHT_HIP landmarks instead of the
  // RIGHT_SHOULDER and LEFT_SHOULDER landmarks
  // and the LEFT_KNEE and RIGHT_KNEE landmarks instead of the
  // LEFT_ELBOW and RIGHT_ELBOW landmarks
  const drawThighs = (poseData, g) => {
    const generalCoords = objMap(
      LANDMARK_GROUPINGS.THIGH_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    // Add magnitude to y coordinate to get a shorter distance b/c 0,0 is top left
    if (generalCoords.RIGHT_KNEE.visibility > 0.6) {
      const rightHipY =
        generalCoords.RIGHT_HIP.y +
        magnitude(generalCoords.PELVIS, generalCoords.RIGHT_HIP);
      const rightKneeY =
        generalCoords.RIGHT_KNEE.y -
        magnitude(generalCoords.PELVIS, generalCoords.RIGHT_HIP);
      const rightThighCoords = [
        {
          x: generalCoords.RIGHT_KNEE.x + armWidth,
          y: rightKneeY + armWidth,
        },
        {
          x: generalCoords.RIGHT_HIP.x + armWidth,
          y: rightHipY + armWidth,
        },
        {
          x: generalCoords.RIGHT_HIP.x - armWidth,
          y: rightHipY - armWidth,
        },
        {
          x: generalCoords.RIGHT_KNEE.x - armWidth,
          y: rightKneeY - armWidth,
        },
      ];
      connectLandmarks(rightThighCoords, g);
    }
    if (generalCoords.LEFT_KNEE.visibility > 0.6) {
      const leftHipY =
        generalCoords.LEFT_HIP.y +
        magnitude(generalCoords.PELVIS, generalCoords.LEFT_HIP);
      const leftKneeY =
        generalCoords.LEFT_KNEE.y -
        magnitude(generalCoords.PELVIS, generalCoords.LEFT_HIP);
      const leftThighCoords = [
        {
          x: generalCoords.LEFT_KNEE.x + armWidth,
          y: leftKneeY + armWidth,
        },
        {
          x: generalCoords.LEFT_HIP.x + armWidth,
          y: leftHipY + armWidth,
        },
        {
          x: generalCoords.LEFT_HIP.x - armWidth,
          y: leftHipY - armWidth,
        },
        {
          x: generalCoords.LEFT_KNEE.x - armWidth,
          y: leftKneeY - armWidth,
        },
      ];
      connectLandmarks(leftThighCoords, g);
    }
  };

  const drawTorso = (poseData, g) => {
    let torsoCoords = objMap(
      LANDMARK_GROUPINGS.TORSO_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    connectLandmarks(Object.values(torsoCoords), g);
  };

  const drawShins = (poseData, g) => {
    const generalCoords = objMap(
      LANDMARK_GROUPINGS.SHIN_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    if (generalCoords.RIGHT_KNEE.visibility > 0.6) {
      const rightShinCoords = [
        {
          x: generalCoords.RIGHT_KNEE.x + armWidth,
          y: generalCoords.RIGHT_KNEE.y + armWidth,
        },
        {
          x: generalCoords.RIGHT_KNEE.x - armWidth,
          y: generalCoords.RIGHT_KNEE.y - armWidth,
        },
        generalCoords.RIGHT_ANKLE,
      ];
      connectLandmarks(rightShinCoords, g);
    }
    if (generalCoords.LEFT_KNEE.visibility > 0.6) {
      const leftShinCoords = [
        {
          x: generalCoords.LEFT_KNEE.x + armWidth,
          y: generalCoords.LEFT_KNEE.y + armWidth,
        },
        {
          x: generalCoords.LEFT_KNEE.x - armWidth,
          y: generalCoords.LEFT_KNEE.y - armWidth,
        },
        generalCoords.LEFT_ANKLE,
      ];

      connectLandmarks(leftShinCoords, g);
    }
  };

  const drawAbdomen = (poseData, g) => {
    let abdomenCoords = objMap(
      LANDMARK_GROUPINGS.ABDOMEN_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    const radius = magnitude(abdomenCoords.PELVIS, abdomenCoords.LEFT_HIP); //*0.8
    g.beginFill(FILL_COLOR);
    g.drawCircle(abdomenCoords.PELVIS.x, abdomenCoords.PELVIS.y, radius);
    g.endFill();
  };

  const drawHands = (poseData, g) => {
    const fingerLandmarks = [
      LANDMARK_GROUPINGS.THUMB_LANDMARKS,
      LANDMARK_GROUPINGS.INDEX_FINGER_LANDMARKS,
      LANDMARK_GROUPINGS.MIDDLE_FINGER_LANDMARKS,
      LANDMARK_GROUPINGS.RING_FINGER_LANDMARKS,
      LANDMARK_GROUPINGS.PINKY_LANDMARKS,
    ];
    if (poseData.rightHandLandmarks) {
      let rightPalmCoords = objMap(
        LANDMARK_GROUPINGS.PALM_LANDMARKS,
        landmarkToCoordinates(poseData.rightHandLandmarks, width, height)
      );
      connectLandmarks(Object.values(rightPalmCoords), g);
      let rightFingers = fingerLandmarks.map((fingerLandmarks) =>
        objMap(
          fingerLandmarks,
          landmarkToCoordinates(poseData.rightHandLandmarks, width, height)
        )
      );
      rightFingers.forEach((finger) => connectFinger(Object.values(finger), g));
    }
    if (poseData.leftHandLandmarks) {
      let leftPalmCoords = objMap(
        LANDMARK_GROUPINGS.PALM_LANDMARKS,
        landmarkToCoordinates(poseData.leftHandLandmarks, width, height)
      );
      connectLandmarks(Object.values(leftPalmCoords), g);
      let leftFingers = fingerLandmarks.map((fingerLandmarks) =>
        objMap(
          fingerLandmarks,
          landmarkToCoordinates(poseData.leftHandLandmarks, width, height)
        )
      );
      leftFingers.forEach((finger) => connectFinger(Object.values(finger), g));
    }
  };

  const draw = useCallback(
    (g) => {
      g.clear();
      // g.beginFill(0xffffff);
      // g.drawRect(colAttr.x, colAttr.y, colAttr.width, colAttr.height);
      // g.endFill();
      if (props.poseData.faceLandmarks) {
        drawFace(props.poseData, g);
      }
      if (props.poseData.poseLandmarks) {
        setArmWidth(calculateArmWidth(props.poseData));
        // NOTE: Order of drawing body section matters, do not reorder
        drawTorso(props.poseData, g);
        drawAbdomen(props.poseData, g);
        drawBiceps(props.poseData, g);
        drawForearms(props.poseData, g);
        drawThighs(props.poseData, g);
        drawShins(props.poseData, g);
      }
      drawHands(props.poseData, g);
    },
    [props.poseData]
  );

  return (
    <Container position={[colAttr.x, colAttr.y]} scale={0.8}>
      <Graphics draw={draw} />
    </Container>
  );
};

export default Pose;
