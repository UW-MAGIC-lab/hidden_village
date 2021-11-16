import ErrorBoundary from "./utilities/ErrorBoundary.js";
import { Container } from "@inlet/react-pixi";
import Pose from "./Pose.js";

const Game = (props) => {
  return (
    <Container
      position={[props.width * 0.75, props.height * 0.5]}
      options={{
        antialias: true,
        autoDensity: true,
        backgroundColor: 0xffd900,
      }}
    >
      <ErrorBoundary>
        <Pose
          poseData={props.poseData}
          width={props.width}
          height={props.height}
        />
      </ErrorBoundary>
    </Container>
  );
};

export default Game;
