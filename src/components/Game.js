import ErrorBoundary from "./utilities/ErrorBoundary.js";
import { Container } from "@inlet/react-pixi";
import Pose from "./Pose.js";

const Game = (props) => {
  return (
    <Container
      position={[props.width, props.height * 0.75]}
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
