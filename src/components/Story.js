import { useEffect, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic } from "@mediapipe/holistic/holistic";
import Loader from "./utilities/Loader.js";
import Game from "./Game.js";
import Home from "./Home.js";
import { useMachine } from "@xstate/react";
import { StoryMachine } from "../machines/storyMachine.js";
import { Stage } from "@inlet/react-pixi";
import { yellow } from "../utils/colors";
import { generateRowAndColumnFunctions } from "./utilities/layoutFunction";
import { enrichLandmarks } from "./Pose/landmark_utilities";

const [
  numRows,
  numColumns,
  marginBetweenRows,
  marginBetweenColumns,
  columnGutter,
  rowGutter,
] = [2, 3, 20, 20, 30, 30];

const Story = () => {
  let holistic;
  // HACK: I should figure out a way to use xstate to migrate from loading to ready
  //  but b/c the async/await nature of the callbacks with Holistic, I'm leaving this hack in for now.
  const [loading, setLoading] = useState(true);
  const [poseData, setPoseData] = useState({});
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [state, send] = useMachine(StoryMachine);
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

  useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
      [rowDimensions, columnDimensions] = generateRowAndColumnFunctions(
        width,
        height,
        numRows,
        numColumns,
        marginBetweenRows,
        marginBetweenColumns,
        columnGutter,
        rowGutter
      );
    });
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
      if (loading) {
        setLoading(false);
      }
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
    <>
      {loading && <Loader />}
      <Stage
        height={height}
        width={width}
        options={{
          antialias: true,
          autoDensity: true,
          backgroundColor: yellow,
        }}
      >
        {state.value === "ready" && (
          <Home
            width={width}
            height={height}
            startCallback={() => send("TOGGLE")}
          />
        )}
        {state.value === "playing" && (
          <Game
            poseData={poseData}
            columnDimensions={columnDimensions}
            rowDimensions={rowDimensions}
            height={height}
            width={width}
          />
        )}
      </Stage>
    </>
  );
};

export default Story;
