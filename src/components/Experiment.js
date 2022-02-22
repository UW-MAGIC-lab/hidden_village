import { useMachine } from '@xstate/react';
import ExperimentMachine from '../machines/experimentMachine';
import { Graphics, Text } from "@inlet/react-pixi";
import Video from './Video';
import { useCallback } from 'react';
import { white, darkGray, yellow } from "../utils/colors";

const VideoPlayer  = (props) => {
  const { columnDimensions, onComplete } = props;
  const drawModalBackground = useCallback((g) => {
    g.beginFill(darkGray, 0.9);
    g.drawRect(0, 0, window.innerWidth, window.innerHeight);
    const col1 = columnDimensions(1);
    const col3 = columnDimensions(3);
    g.endFill();
    g.beginFill(yellow, 1);
    g.drawRect(col1.x, col1.y, col1.width, col1.height);
    g.endFill();
  }, []);
  return(
    <>
      <Graphics draw={drawModalBackground} />
      <Text
        text={"Watch this video,\nthen match the movements!"}
        x={columnDimensions(2).x + columnDimensions(2).width / 2}
        y={columnDimensions(2).height / 2}
        style={
          new PIXI.TextStyle({
            align: "center",
            fontFamily: '"Futura", Helvetica, sans-serif',
            fontSize: 50,
            fontWeight: 400,
            fill: [white],
          })
        }
      />
      <Video 
        path={"../assets/animations/opposite_angle.webm"}
        x={columnDimensions(1).x}
        y={columnDimensions(1).y}
        width={columnDimensions(1).width}
        height={columnDimensions(1).height}
        onComplete={onComplete}
      />
    </>
  )
}



const Experiment = (props) => {
  const { columnDimensions, poseData, posesToMatch, rowDimensions } = props;
  const [state, send, service] = useMachine(ExperimentMachine);
  return (
    <>
      {
        state.value === 'videoPlaying' && 
        <VideoPlayer onComplete={() => send('NEXT')} columnDimensions={columnDimensions} />
      }
      {/* <Pose poseData={currentPose} colAttr={modelColumn} />
      <Text
        text={text}
        y={col2Dim.y + col2Dim.height / 4}
        x={col2Dim.x}
        style={
          new TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: "5em",
            fontWeight: 800,
            fill: [blue],
            wordWrap: true,
            wordWrapWidth: col2Dim.width,
          })
        }
      />
      <Pose
        poseData={props.poseData}
        colAttr={playerColumn}
        similarityScores={poseSimilarity}
      />
      {state.context.currentStepIndex === 6 && (
        <CursorMode
          poseData={props.poseData}
          rowDimensions={props.rowDimensions}
          callback={() => send("NEXT")}
        />
      )} */}
    </>
  );
};

export default Experiment;