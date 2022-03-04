import { useState, useEffect, useRef, useCallback } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic, FACEMESH_FACE_OVAL, POSE_LANDMARKS } from '@mediapipe/holistic/holistic';
import { blue, yellow} from "../utils/colors";
import { landmarkToCoordinates, objMap } from "./Pose/pose_drawing_utilities";
import { enrichLandmarks, LANDMARK_GROUPINGS } from "./Pose/landmark_utilities";

// ****************************************************************
// Utility functions
// ****************************************************************
const magnitude = (point1, point2) => {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  };
  
  const FILL_COLOR = "#"+yellow.toString(16); // hex color in DOMstring 
  const STROKE_COLOR = "#"+blue.toString(16);
  
  const connectLandmarks = (
    landmarks,
    g,
    width,
    height,
    similarityScoreSegment,
    similarityScores
  ) => {
    if (
      similarityScores &&
      similarityScores.length > 1 &&
      similarityScoreSegment
    ) {
      similarityScores.forEach((score) => {
        if (score.segment === similarityScoreSegment) {
          FILL_COLOR = parseInt(
            matchedFill(score.similarityScore).hex().substring(1),
            16
          );
          STROKE_COLOR = parseInt(
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
    g.beginPath(); //g.beginFill(FILL_COLOR);
    g.fillStyle = FILL_COLOR;
    g.lineWidth = 4; //g.lineStyle(4, STROKE_COLOR, 1);
    g.strokeStyle = STROKE_COLOR;
    g.globalAlpha = 1;
    g.moveTo(coord.x, coord.y);
    landmarks.forEach((coordinate) => {
      g.lineTo(coordinate.x, coordinate.y);
    });
    g.lineTo(coord.x, coord.y);
    // g.closePath();
    g.stroke();
    g.fill();
  };
  
  const connectFinger = (landmarks, g) => {
    g.beginPath(); 
    g.fillStyle = FILL_COLOR; //g.beginFill(FILL_COLOR);
    g.lineWidth = 4;
    g.strokeStyle = STROKE_COLOR; 
    g.globalAlpha = 1; //g.lineStyle(4, STROKE_COLOR, 1);
    const coord = landmarks.shift();
    g.moveTo(coord.x, coord.y);
    landmarks.forEach((coordinate) => {
      g.lineTo(coordinate.x, coordinate.y);
    });
    g.stroke();
    g.fill(); //g.endFill();
  };
  
  const calculateArmWidth = (poseData, width, height) => {
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
  
  const drawBiceps = (poseData, g, armWidth, width, height, similarityScores) => {
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
    connectLandmarks(
      rightBicepCoords,
      g,
      width,
      height,
      "RIGHT_BICEP",
      similarityScores
    );
    connectLandmarks(
      leftBicepCoords,
      g,
      width,
      height,
      "LEFT_BICEP",
      similarityScores
    );
  };
  
  const drawForearms = (
    poseData,
    g,
    armWidth,
    width,
    height,
    similarityScores
  ) => {
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
    connectLandmarks(
      rightForearmCoords,
      g,
      width,
      height,
      "RIGHT_FOREARM",
      similarityScores
    );
    connectLandmarks(
      leftForearmCoords,
      g,
      width,
      height,
      "LEFT_FOREARM",
      similarityScores
    );
  };
  
  const drawFace = (poseData, g, width, height, similarityScores) => {
    let faceOvalCoords = FACEMESH_FACE_OVAL.map((indexPair) => {
      const coordinates = poseData.faceLandmarks[indexPair[0]];
      coordinates.x *= width;
      coordinates.y *= height;
      return coordinates;
    });
    connectLandmarks(faceOvalCoords, g, width, height, similarityScores);
  };
  
  // create a drawThighs function that mimics the drawBiceps function
  // but uses the LEFT_HIP and RIGHT_HIP landmarks instead of the
  // RIGHT_SHOULDER and LEFT_SHOULDER landmarks
  // and the LEFT_KNEE and RIGHT_KNEE landmarks instead of the
  // LEFT_ELBOW and RIGHT_ELBOW landmarks
  const drawThighs = (poseData, g, armWidth, width, height, similarityScores) => {
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
      connectLandmarks(rightThighCoords, g, width, height, similarityScores);
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
      connectLandmarks(leftThighCoords, g, width, height, similarityScores);
    }
  };
  
  const drawTorso = (poseData, g, width, height, similarityScores) => {
    let torsoCoords = objMap(
      LANDMARK_GROUPINGS.TORSO_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    connectLandmarks(
      Object.values(torsoCoords),
      g,
      width,
      height,
      similarityScores
    );
  };
  
  const drawShins = (poseData, g, armWidth, width, height, similarityScores) => {
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
      connectLandmarks(rightShinCoords, g, width, height, similarityScores);
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
  
      connectLandmarks(leftShinCoords, g, width, height, similarityScores);
    }
  };
  
  const drawAbdomen = (poseData, g, width, height) => {
    let abdomenCoords = objMap(
      LANDMARK_GROUPINGS.ABDOMEN_LANDMARKS,
      landmarkToCoordinates(poseData.poseLandmarks, width, height)
    );
    const radius = magnitude(abdomenCoords.PELVIS, abdomenCoords.LEFT_HIP); //*0.8
    g.beginPath(); 
    g.fillStyle = FILL_COLOR; 
    g.lineWidth = 4;
    g.globalAlpha = 1;
    g.strokeStyle = STROKE_COLOR; //g.beginFill(FILL_COLOR);
    g.arc(abdomenCoords.PELVIS.x, abdomenCoords.PELVIS.y, radius, 0, 2*Math.PI); //g.drawCircle(abdomenCoords.PELVIS.x, abdomenCoords.PELVIS.y, radius);
    g.fill();
    g.stroke(); 
  };
  
  const drawHands = (poseData, g, width, height, similarityScores) => {
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
      connectLandmarks(
        Object.values(rightPalmCoords),
        g,
        width,
        height,
        similarityScores
      );
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
      connectLandmarks(
        Object.values(leftPalmCoords),
        g,
        width,
        height,
        similarityScores
      );
      let leftFingers = fingerLandmarks.map((fingerLandmarks) =>
        objMap(
          fingerLandmarks,
          landmarkToCoordinates(poseData.leftHandLandmarks, width, height)
        )
      );
      leftFingers.forEach((finger) => connectFinger(Object.values(finger), g));
    }
  };

// ****************************************************************
// Component Logic
// ****************************************************************
const EditorCanvas = (props) => {
  const {height, width, poseData} = props;
  // const [height, setHeight] = useState(600);
  // const [width, setWidth] = useState(800);
  const [open, setOpen] = useState(false);
  // const [poseData, setPoseData] = useState({});

  // const widthSliderRef = useRef(null);
  // const heightSliderRef = useRef(null);
  const canvasRef = useRef(null);
  // const context = useRef(null);

  // draw poseData logic
  const [armWidth, setArmWidth] = useState(0);
  const draw = useCallback(
    () => {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, width, height); // context.clear();
      if (poseData.faceLandmarks) {
        drawFace(poseData, context, width, height, false);
      }
      if (poseData.poseLandmarks) {
        setArmWidth(calculateArmWidth(poseData, width, height));
        // NOTE: Order of drawing body section matters, do not reorder
        drawTorso(poseData, context, width, height, false);
        drawAbdomen(poseData, context, width, height);
        drawBiceps(
          poseData,
          context,
          armWidth,
          width,
          height,
          false
        );
        drawForearms(
          poseData,
          context,
          armWidth,
          width,
          height,
          false
        );
        drawThighs(
          poseData,
          context,
          armWidth,
          width,
          height,
          false
        );
        drawShins(poseData, context, armWidth, width, height, false);
      }
      drawHands(poseData, context, width, height, false);
    },
    [poseData]
  );

  useEffect(() => {
    if (open)
      draw();
  }, [poseData]);

  return (
      <div onClick={() => setOpen(!open)}>
        {open && (
          <div className="flex justify-center">
            <canvas ref={canvasRef} width={width} height={height}></canvas>
          </div>
        )}
        {!open && (
          <div>CLOSE STATE</div>
        )}
          {/* <div>
              <input ref={widthSliderRef} type="range" min="400" max="800" defaultValue={width} step="25"></input>
              <input ref={heightSliderRef} type="range" min="300" max="600" defaultValue={height} step="25"></input>
          </div> */}
      </div>
  )
};

export default EditorCanvas;