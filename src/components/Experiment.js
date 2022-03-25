import { useMachine } from "@xstate/react";
import ExperimentMachine from "../machines/experimentMachine";
import { Graphics } from "@inlet/react-pixi";
import { useCallback, useState, useEffect } from "react";
import { darkGray, yellow } from "../utils/colors";
import PoseMatching from "./PoseMatching";
import oppositeAnglePoseData from "../models/rawPoses/oppositeAnglePoses.json";
import parallelogramPoseData from "../models/rawPoses/area_parallelogram.json";
import VideoPlayer from "./VideoPlayer";
import ExperimentalTask from "./ExperimentalTask";

const Experiment = (props) => {
  const {
    columnDimensions,
    poseData,
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
        break;
      case "area_parallelogram.json":
        console.log(parallelogramPoseData);
        setConjecturePoses(parallelogramPoseData);
        break;
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
        `QUICK! TRUE or FALSE:\n\n${conjectureData.conjecture}. \n\n Tell us your answer OUT LOUD.`
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
