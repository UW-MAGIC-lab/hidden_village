import Tutorial from "./Tutorial.js";
import { Container } from "@inlet/react-pixi";
import Chapter from "./Chapter.js";
import { useState, useEffect } from "react";
import { conjectures } from "../models/conjectures.js";
import Latin from "./utilities/latin_square";
import { useMachine, useSelector } from "@xstate/react";
// import { useSelector } from "@xstate";
import GameMachine from "../machines/gameMachine.js";
import Intervention from "./Intervention.js";
import { writeToDatabase, promiseChecker } from "../firebase/database.js";

const reorder = (array, indices) => {
  return indices.map((idx) => array[idx - 1]);
};

const context = {
  context: {
    conjectures: [0, 1, 2, 3, 4, 5, 6, 7],
    currentConjectureIdx: 0,
    conjectureIdxToIntervention: 4,
  },
};
const selectCurrentConjectureIdx = (state) =>
  state.context.currentConjectureIdx;

const Game = (props) => {
  const { columnDimensions, rowDimensions, poseData, height, width } = props;
  const [chapterConjecture, setChapterConjecture] = useState([]);

  const [performTutorial, setPerformTutorial] = useState(true);
  // const [performTutorial, setPerformTutorial] = useState(false);
  const [allConjectures, setAllConjectures] = useState([]);
  const [state, send, service] = useMachine(GameMachine, context);
  const currentConjectureIdx = useSelector(service, selectCurrentConjectureIdx);

  // Optional URL parameters for whether motion data recording is enabled
  // and what the fps is for recording.
  // Defaults are false and 30.
  const queryParameters = new URLSearchParams(window.location.search);
  // const queryParameters = useSearchParams();
  const recordingUrlParam = queryParameters.get("recording") || "false";
  const fpsUrlParam = parseInt(queryParameters.get("fps")) || 30;

  console.log(recordingUrlParam);
  if (recordingUrlParam.toLowerCase() === "true") {
    useEffect(() => {
      let promises = [];
      // This is done so it can be easier to refactor
      // if something other than url params are ever used
      const frameRate = fpsUrlParam;
      console.log(frameRate);
      const intervalId = setInterval(() => {
        promises.push(writeToDatabase(poseData, currentConjectureIdx));
        promiseChecker(frameRate, promises);
        // Need to clear the promise before it causes memory/storage problem for the user
        console.log("Promise Length: " + promises.length);
      }, 1000 / frameRate);

      return async () => {
        clearInterval(intervalId);
        await Promise.allSettled(promises);
      };
    }, []);
  }

  useEffect(() => {
    const numConjectures = conjectures.length;
    const latinSquare = new Latin(numConjectures);
    const queryParams = new URLSearchParams(window.location.search);
    let condition = 0;
    if (queryParams.has("condition")) {
      condition = parseInt(queryParams.get("condition"));
    }
    const conjectureOrder =
      condition < numConjectures
        ? latinSquare.square[condition]
        : latinSquare.square[0];
    let orderedConjectures = reorder(conjectures, conjectureOrder);
    if (queryParams.has("conjecture")) {
      const conjectureStart = parseInt(queryParams.get("conjecture"));
      setPerformTutorial(false);
      send({
        type: "SET_CURRENT_CONJECTURE",
        currentConjectureIdx: conjectureStart - 1,
      });
    }
    setAllConjectures(orderedConjectures);
  }, []);

  useEffect(() => {
    setChapterConjecture(allConjectures[currentConjectureIdx]);
    // since allConjectures is also set asyncronously, monitor
    // allConjectures and currentConjectureIdx to update chapterConjecture
  }, [allConjectures, currentConjectureIdx]);

  return (
    <Container>
      {performTutorial && (
        <Tutorial
          poseData={poseData}
          columnDimensions={columnDimensions}
          rowDimensions={rowDimensions}
          onComplete={() => {
            setPerformTutorial(false);
            send("NEXT");
          }}
        />
      )}
      {!performTutorial && state.value === "chapter" && (
        <Chapter
          poseData={poseData}
          columnDimensions={props.columnDimensions}
          rowDimensions={props.rowDimensions}
          height={height}
          width={width}
          chapterConjecture={chapterConjecture}
          currentConjectureIdx={state.context.currentConjectureIdx}
          nextChapterCallback={() => send("NEXT")}
        />
      )}
      {!performTutorial && state.value === "intervention" && (
        <Intervention triggerNextChapter={() => send("NEXT")} />
      )}
    </Container>
  );
};

export default Game;
