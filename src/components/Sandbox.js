import { Stage } from "@inlet/react-pixi";
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
import { yellow, blue, white, darkGray } from "../utils/colors";

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

  // useEffect(() => {
  //   holistic = new Holistic({
  //     locateFile: (file) => {
  //       return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  //     },
  //   });
  //   holistic.setOptions({
  //     modelComplexity: 1,
  //     smoothLandmarks: true,
  //     enableSegmentation: true,
  //     smoothSegmentation: true,
  //     minDetectionConfidence: 0.5,
  //     minTrackingConfidence: 0.5,
  //     selfieMode: true,
  //   });
  //   async function poseDetectionFrame() {
  //     await holistic.send({ image: videoElement });
  //   }

  //   const videoElement = document.getElementsByClassName("input-video")[0];
  //   let camera = new Camera(videoElement, {
  //     onFrame: poseDetectionFrame,
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //     facingMode: "environment",
  //   });
  //   camera.start();
  //   const updatePoseResults = (newResults) => {
  //     setPoseData(enrichLandmarks(newResults));
  //   };
  //   holistic.onResults(updatePoseResults);
  // }, []);

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
      <Character />
      {/* eyePosition={[-50/2,0]} eyeSpacing={50} eyeWidth={10} eyeHeight={15} mouthPosition={[-50/2, 35]} mouthWidth={50} mouthHeight={15} browPosition={[-50/2+10/2,-35]} browAngle={0.5} browLength={25}  */}
    </Stage>
  );
};

export default Sandbox;
