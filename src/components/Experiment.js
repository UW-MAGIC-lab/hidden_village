import { useMachine } from "@xstate/react";
import ExperimentMachine from "../machines/experimentMachine";
import { Graphics } from "@inlet/react-pixi";
import { useCallback, useState, useEffect } from "react";
import { darkGray, yellow } from "../utils/colors";
import PoseMatching from "./PoseMatching";
import oppositeAnglePoseData from "../models/rawPoses/oppositeAnglePoses.json";
import VideoPlayer from "./VideoPlayer";
import ExperimentalTask from "./ExperimentalTask";

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
const Experiment = (props) => {
  const {
    columnDimensions,
    poseData,
    posesToMatch,
    rowDimensions,
    onComplete,
    debugMode,
    conjectureData,
  } = props;
  const [state, send, service] = useMachine(ExperimentMachine);
  const [experimentText, setExperimentText] = useState(
    `QUICK! TRUE or FALSE:\n\n${conjectureData.conjecture} \n\n Tell us your answer OUT LOUD.`
  );
  const [conjecturePoses, setConjecturePoses] = useState("");
  useEffect(() => {
    switch (conjectureData.poseDataFileName) {
      case "oppositeAnglePoses.json":
        console.log(oppositeAnglePoseData);
        setConjecturePoses(oppositeAnglePoseData);
      default:
        return null;
    }
  }, [conjectureData.poseDataFileName]);

  const drawModalBackground = useCallback((g) => {
    g.beginFill(darkGray, 0.9);
    g.drawRect(0, 0, window.innerWidth, window.innerHeight);
    g.endFill();
    const col1 = columnDimensions(1);
    g.beginFill(yellow, 1);
    g.drawRect(col1.x, col1.y, col1.width, col1.height);
    const col3 = columnDimensions(3);
    g.drawRect(col3.x, col3.y, col3.width, col3.height);
    g.endFill();
  }, []);

  useEffect(() => {
    if (state.value === "intuition") {
      setExperimentText(
        `QUICK! TRUE or FALSE:\n\n${conjectureData.conjecture} \n\n Tell us your answer OUT LOUD.`
      );
    } else if (state.value === "insight") {
      setExperimentText(
        `Alright! Now, explain OUT LOUD:\n\nWHY is it TRUE or FALSE that: \n\n ${conjectureData.conjecture.toLowerCase()}?`
      );
    }
  }, [state.value]);

  return (
    <>
      {state.value === "videoPlaying" && (
        <VideoPlayer
          onComplete={() => send("NEXT")}
          columnDimensions={columnDimensions}
          videoPath={conjectureData.videoPath}
        />
      )}
      {state.value === "poseMatching" && (
        <>
          <Graphics draw={drawModalBackground} />
          <PoseMatching
            poseData={poseData}
            posesToMatch={[
              conjecturePoses.poses,
              conjecturePoses.poses,
              conjecturePoses.poses,
            ].flat()}
            columnDimensions={columnDimensions}
            onComplete={() => send("NEXT")}
          />
        </>
      )}
      {state.value === "intuition" && (
        <ExperimentalTask
          prompt={experimentText}
          columnDimensions={columnDimensions}
          poseData={poseData}
          rowDimensions={rowDimensions}
          onComplete={() => send("NEXT")}
          cursorTimer={debugMode ? 1_000 : 10_000}
        />
      )}
      {state.value === "insight" && (
        <ExperimentalTask
          prompt={experimentText}
          columnDimensions={columnDimensions}
          poseData={poseData}
          rowDimensions={rowDimensions}
          onComplete={onComplete}
          cursorTimer={debugMode ? 1_000 : 30_000}
        />
      )}
    </>
  );
};

export default Experiment;
