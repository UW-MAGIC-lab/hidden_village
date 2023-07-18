import { Stage } from "@pixi/react";
import Background from "./Background";
import { useState, useEffect } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic } from "@mediapipe/holistic/holistic";
import { enrichLandmarks } from "./Pose/landmark_utilities";
import { generateRowAndColumnFunctions } from "./utilities/layoutFunction";
const [
  numRows,
  numColumns,
  marginBetweenRows,
  marginBetweenColumns,
  columnGutter,
  rowGutter,
] = [2, 3, 20, 20, 30, 30];

import Character from "./Character";
import { yellow, blue, white, darkGray, green, pink } from "../utils/colors";

const Sandbox = () => {
  let holistic;
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [poseData, setPoseData] = useState({});
  let [rowDimensions, columnDimensions] = generateRowAndColumnFunctions(
    width,
    height,
    numRows,
    numColumns,
    marginBetweenRows,
    marginBetweenColumns,
    columnGutter,
    rowGutter
  );
  const [col1, setCol1] = useState(columnDimensions(1));
  const [row1, setRow1] = useState(rowDimensions(1));

  useEffect(() => {
    holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });
    async function poseDetectionFrame() {
      await holistic.send({ image: videoElement });
    }

    const videoElement = document.getElementsByClassName("input-video")[0];
    let camera = new Camera(videoElement, {
      onFrame: poseDetectionFrame,
      width: window.innerWidth,
      height: window.innerHeight,
      facingMode: "environment",
    });
    camera.start();
    const updatePoseResults = (newResults) => {
      setPoseData(enrichLandmarks(newResults));
    };
    holistic.onResults(updatePoseResults);
  }, []);

  return (
    <Stage
      height={height}
      width={width}
      options={{
        antialias: true,
        autoDensity: true,
        backgroundColor: 0xfacf5a,
      }}
    >
      <Background height={height} width={width} />
      <Character
        placement={[row1.x + row1.width * 0.4, row1.y + row1.height * 0.4]}
        type={"circle"}
        color={pink}
        facePosition={[-20, -30]}
        height={col1.height * 0.1}
        mood={"happy"}
      />
      <Character
        type={"equilateralTriangle"}
        height={col1.height * 0.1}
        placement={[col1.x + col1.width * 0.66, col1.y + col1.height * 0.9]}
        color={blue}
        mood={"happy"}
        facePosition={[50, 0]}
      />
      <Character
        type={"rectangle"}
        height={col1.height * 0.2}
        placement={[col1.x + col1.width * 0.1, col1.y + col1.height * 0.35]}
        color={blue}
        mood={"neutral"}
        facePosition={[70, 50]}
      />
      <Character
        type={"scaleneTriangle"}
        height={col1.height * 0.2}
        placement={[col1.x + col1.width * 0.8, col1.y + col1.height * 0.55]}
        color={green}
        mood={"happy"}
        facePosition={[5, 100]}
      />
      <Character
        type={"trapezoid"}
        height={col1.height * 0.15}
        placement={[col1.x + col1.width * 0.95, col1.y + col1.height * 0.65]}
        color={pink}
        mood={"neutral"}
        facePosition={[70, 50]}
      />
      <Character
        type={"square"}
        height={col1.height * 0.3}
        placement={[col1.x + col1.width * 1.25, col1.y + col1.height * 0.75]}
        color={green}
        mood={"happy"}
        facePosition={[70, 50]}
      />
    </Stage>
  );
};

export default Sandbox;
