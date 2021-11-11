import ErrorBoundary from "./utilities/ErrorBoundary.js";
import { Stage, Container } from "@inlet/react-pixi";
import Pose from "./Pose.js";

const Game = (prop) => {
  return (
    <Stage
      height={props.height}
      width={props.width}
      options={{
        antialias: true,
        autoDensity: true,
        backgroundColor: 0xede4d9,
      }}
    >
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
    </Stage>
  );
};

export default Game;
