import Tutorial from "./Tutorial.js";
import { Container } from "@inlet/react-pixi";

const Game = (props) => {
  const { columnDimensions, rowDimensions, poseData } = props;
  return (
    <Container>
      <Tutorial
        poseData={poseData}
        columnDimensions={columnDimensions}
        rowDimensions={rowDimensions}
      />
    </Container>
  );
};

export default Game;
