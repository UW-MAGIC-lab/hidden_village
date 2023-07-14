import {
  matchSegmentToLandmarks,
  segmentSimilarity,
} from "./Pose/pose_drawing_utilities";
import { enrichLandmarks } from "./Pose/landmark_utilities";
import ErrorBoundary from "./utilities/ErrorBoundary.js";
import Pose from "./Pose/index.js";
import { useState, useEffect, useMemo } from "react";
import { Text, Container } from "@pixi/react";
import { white } from "../utils/colors";

const PoseMatching = (props) => {
  const { posesToMatch, columnDimensions, onComplete } = props;
  const context = posesToMatch.map((x) => {
    return { text: "Match the pose on the left!" };
  });
  const [text, setText] = useState("Match the pose on the left!");
  const modelColumn = columnDimensions(1);
  const col2Dim = columnDimensions(2);
  const playerColumn = columnDimensions(3);
  const [poses, setPoses] = useState([]);
  const [transition, setTransition] = useState(false);
  const [firstPose, setFirstPose] = useState(true);
  const [currentPose, setCurrentPose] = useState({});
  const [poseMatchData, setPoseMatchData] = useState({});
  const [poseSimilarity, setPoseSimilarity] = useState([]);
  const textColor = white;

  // on mount, create an array of the poses that will be used in the tutorial
  useEffect(() => {
    setPoses(posesToMatch);
    setCurrentPose(posesToMatch[0]);
  }, []);

  // monitor the state value -- when you get to a running state, update the current
  // pose for the model to emulate. If there are no more poses to emulate,
  // update the current pose with nothing
  useEffect(() => {
    if (poses.length > 0 && !transition) {
      if (firstPose) {
        setFirstPose(false);
      }
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
    }
    if (poses.length === 0 && !firstPose) {
      setText("Great!");
      const timer = setTimeout(() => {
        console.log("moved to next step");
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [poses, transition]);

  // if there is a pose to match, calculate the similarity between the player's current
  // pose and the model pose (foreach segment to be matched). Set the similarity scores
  // into a variable to be monitored
  useEffect(() => {
    if (!transition) {
      if (
        poseMatchData &&
        Object.keys(poseMatchData).length > 0 &&
        props.poseData.poseLandmarks
      ) {
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
          const similarityScore = segmentSimilarity(playerSet, modelSet);
          // collect similarity score for comparison in this component
          // collect segment name to use similarity score for visual feedback (color)
          // in player pose
          return { segment: segmentSet.segment, similarityScore };
        });
        setPoseSimilarity(similarityScores);
      } else {
        setPoseSimilarity([{ similarityScore: 0 }]);
      }
    }
  }, [props.poseData]);

  // Every time the pose is updated, check to see whether the player's pose is above
  // the threshold for similarity to the model pose. If it is, then transition to the
  // next state. If not, stay in the same state
  useEffect(() => {
    if (!firstPose) {
      const similarityThreshold = 45;
      const similarityScore = poseSimilarity.reduce(
        (previousValue, currentValue) => {
          // all segments need to be over the threshold -- will only return true if
          // all are over threshold
          return (
            previousValue && currentValue.similarityScore > similarityThreshold
          );
        },
        true
      );
      if (similarityScore) {
        // move to next state and reset pose similarity
        setTransition(true);
        setPoseSimilarity([{ similarityScore: 0 }]);
        setText("Great!");
        setTimeout(() => {
          setText("Match the pose on the left!");
          setTransition(false);
        }, 1000);
      }
    }
  }, [poseSimilarity]);

  return (
    <Container>
      <ErrorBoundary>
        <Pose poseData={currentPose} colAttr={modelColumn} />
        <Text
          text={text}
          y={col2Dim.height / 2}
          x={col2Dim.x + col2Dim.margin}
          style={
            new PIXI.TextStyle({
              align: "center",
              fontFamily: "Futura",
              fontSize: "4em",
              fontWeight: 800,
              fill: [textColor],
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
      </ErrorBoundary>
    </Container>
  );
};

export default PoseMatching;
