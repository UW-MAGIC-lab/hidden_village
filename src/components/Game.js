import Tutorial from "./Tutorial.js";
import { Container } from "@inlet/react-pixi";
import Chapter from "./Chapter.js";
import { useState, useEffect } from "react";
import { conjectures } from "../models/conjectures.js";
import Latin from "./utilities/latin_square";
import { useMachine, useSelector } from "@xstate/react";
// import { useSelector } from "@xstate";
import GameMachine from "../machines/gameMachine.js";

const reorder = (array, indices) => {
  return indices.map((idx) => array[idx]);
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
  const [chapterConjecture, setChapterConjecture] = useState(conjectures[0]);

  const [performTutorial, setPerformTutorial] = useState(true);
  // const [performTutorial, setPerformTutorial] = useState(false);
  const [allConjectures, setAllConjectures] = useState(conjectures);
  const [state, send, service] = useMachine(GameMachine, context);
  const currentConjectureIdx = useSelector(service, selectCurrentConjectureIdx);

  return (
    <Container>
      {performTutorial && (
        <Tutorial
          poseData={poseData}
          columnDimensions={columnDimensions}
          rowDimensions={rowDimensions}
          onComplete={() => setPerformTutorial(false)}
        />
      )}
      {!performTutorial && (
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
    </Container>
  );
};

export default Game;
