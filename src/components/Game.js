import Pose from './Pose/index';
import { Container } from "@inlet/react-pixi";

const Game = (props) => {
  const { columnDimensions, rowDimensions, poseData } = props;

  return (
    <Container>
      <Pose
        poseData={poseData}
        colAttr={columnDimensions(3)}
      />
    </Container>
  );
};

export default Game;
