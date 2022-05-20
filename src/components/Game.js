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
import db from "../db";

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

function downloadBlob(blob, name = "file.txt") {
  // Convert blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // ********************************
  // Cleanup
  // ********************************

  // Remove link from body
  document.body.removeChild(link);
  // Revoke Blob URL
  URL.revokeObjectURL(blobUrl);
}

const handleUserKeyPress = async (event) => {
  const { _, keyCode } = event;
  const progressCallback = ({ totalRows, completedRows }) => {
    console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
  };
  // keyCode 68 is d
  if (keyCode === 68) {
    try {
      const blob = await db.export({ prettyJson: true, progressCallback });
      downloadBlob(blob, "thv-o-export.json");
    } catch (error) {
      console.error("" + error);
    }
  }
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

    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
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
