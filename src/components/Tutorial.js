import ErrorBoundary from "./utilities/ErrorBoundary.js";
import Pose from "./Pose/index.js";
import { useState, useEffect } from "react";
import { useMachine } from "@xstate/react";
import TutorialMachine from "../machines/tutorialMachine";
import { Text, Container } from "@inlet/react-pixi";
import { blue } from "../utils/colors";
import { TextStyle } from "@pixi/text";
import cursorPoseData from "../models/rawPoses/cursorPose.json";
import tutorialPoseData from "../models/rawPoses/tutorialPoses.json";
import { enrichLandmarks } from "./Pose/landmark_utilities";
import {
  matchSegmentToLandmarks,
  segmentSimilarity,
} from "./Pose/pose_drawing_utilities";

const Tutorial = (props) => {
  const { columnDimensions, _, poseData } = props;
  const [state, send] = useMachine(TutorialMachine);
  const { text } = state.context;
  const modelColumn = columnDimensions(1);
  const col2Dim = columnDimensions(2);
  const playerColumn = columnDimensions(3);
  const [poses, setPoses] = useState([]);
  const [currentPose, setCurrentPose] = useState({});
  const [poseMatchData, setPoseMatchData] = useState({});
  const [poseSimilarity, setPoseSimilarity] = useState([0]);

  // on mount, create an array of the poses that will be used in the tutorial
  useEffect(() => {
    setPoses([...tutorialPoseData.poses, cursorPoseData]);
  }, []);

  // monitor the state value -- when you get to a running state, update the current
  // pose for the model to emulate. If there are no more poses to emulate,
  // update the current pose with nothing
  useEffect(() => {
    if (state.matches("running")) {
      if (poses.length > 0) {
        const currentPoseData = poses.shift();
        const matchData = currentPoseData.matchingConfig.map((config) => {
          return {
            ...config,
            landmarks: matchSegmentToLandmarks(
              config,
              currentPoseData.landmarks,
              modelColumn
            ),
          };
        });
        setCurrentPose(enrichLandmarks(currentPoseData.landmarks));
        setPoseMatchData(matchData);
        setPoses(poses);
      } else {
        setPoses([]);
        setPoseMatchData({});
        setCurrentPose({});
      }
    }
  }, [state.value]);

  // if there is a pose to match, calculate the similarity between the player's current
  // pose and the model pose (foreach segment to be matched). Set the similarity scores
  // into a variable to be monitored
  useEffect(() => {
    if (!state.matches("transition")) {
      if (poseMatchData && Object.keys(poseMatchData).length > 0) {
        // extract segment from the larger player pose dataset
        const convertedLandmarks = poseMatchData.map((segmentSet) => {
          return {
            segment: segmentSet.segment,
            landmarks: matchSegmentToLandmarks(
              segmentSet,
              props.poseData,
              playerColumn
            ),
          };
        });
        // then compare similarity between modelSet and playerSet
        const similarityScores = poseMatchData.map((segmentSet) => {
          const playerSet = convertedLandmarks.filter(
            (convertedLandmarks) =>
              convertedLandmarks.segment === segmentSet.segment
          )[0].landmarks;
          const modelSet = segmentSet.landmarks;
          return segmentSimilarity(playerSet, modelSet);
        });
        setPoseSimilarity(similarityScores);
      }
    }
  }, [props.poseData]);

  // Every time the pose is updated, check to see whether the player's pose is above
  // the threshold for similarity to the model pose. If it is, then transition to the
  // next state. If not, stay in the same state
  useEffect(() => {
    const similarityThreshold = 70;
    const similarityScore = poseSimilarity.reduce(
      (previousValue, currentValue) => {
        // all segments need to be over the threshold -- will only return true if
        // all are over threshold
        return previousValue && currentValue > similarityThreshold;
      },
      true
    );
    if (similarityScore) {
      // move to next state and reset pose similarity
      send("NEXT");
      setPoseSimilarity([0]);
    }
  }, [poseSimilarity]);

  return (
    <Container>
      <ErrorBoundary>
        <Pose poseData={currentPose} colAttr={modelColumn} />
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
        <Pose poseData={poseData} colAttr={playerColumn} />
      </ErrorBoundary>
    </Container>
  );
};

export default Tutorial;
