import Tutorial from "./Tutorial.js";
import { Container } from "@inlet/react-pixi";
import Chapter from "./Chapter.js";
import { useState, useEffect } from "react";

// create game machine that starts on tutorial, then moves to chapter

const Game = (props) => {
  const { columnDimensions, rowDimensions, poseData, height, width } = props;
  const [performTutorial, setPerformTutorial] = useState(true);
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
        />
      )}
    </Container>
  );
};

export default Game;
