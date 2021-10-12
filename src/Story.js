import { useEffect, useState, Fragment } from "react";
import { useSetState } from "react-use";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic, POSE_LANDMARKS } from "@mediapipe/holistic/holistic";
import Loader from "./components/utilities/Loader.js";
import ErrorBoundary from "./components/utilities/ErrorBoundary.js";
import { Stage, Container } from "@inlet/react-pixi";
import Pose from "./components/Pose.js";

POSE_LANDMARKS.PELVIS = 34;
POSE_LANDMARKS.SOLAR_PLEXIS = 33;

const Story = () => {
  let holistic;
  const [loading, setLoading] = useState(true);
  const [poseData, setPoseData] = useSetState({});
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    })
    holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    async function poseDetectionFrame() {
      await holistic.send({ image: videoElement });
      if (loading) {
        setLoading(false);
      }
    }

    const videoElement = document.getElementsByClassName("input-video")[0];
    let camera = new Camera(videoElement, {
      onFrame: poseDetectionFrame,
      width: window.innerWidth,
      height: window.innerHeight,
      facingMode: "user",
    });
    camera.start();
    const updatePoseResults = (newResults) => {
      const abdomenLandmarks = (({ RIGHT_HIP, LEFT_HIP, RIGHT_SHOULDER }) => ({ RIGHT_HIP, LEFT_HIP, RIGHT_SHOULDER }))(POSE_LANDMARKS);
      let solarPlexis = {}
      let pelvis = {};
      if (newResults.poseLandmarks) {
        pelvis.x = (newResults.poseLandmarks[abdomenLandmarks.RIGHT_HIP].x + newResults.poseLandmarks[abdomenLandmarks.LEFT_HIP].x)/2;
        pelvis.y = (newResults.poseLandmarks[abdomenLandmarks.RIGHT_HIP].y + newResults.poseLandmarks[abdomenLandmarks.LEFT_HIP].y)/2;
        solarPlexis.x = pelvis.x;
        solarPlexis.y = (newResults.poseLandmarks[abdomenLandmarks.RIGHT_SHOULDER].y + newResults.poseLandmarks[abdomenLandmarks.RIGHT_HIP].y)*.6;
        newResults.poseLandmarks[POSE_LANDMARKS.PELVIS] = pelvis;
        newResults.poseLandmarks[POSE_LANDMARKS.SOLAR_PLEXIS] = solarPlexis;
      }
      setPoseData(prevState => {
        return { ...prevState, ...newResults };
      });
    };
    holistic.onResults(updatePoseResults);
  }, []);


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
          <Stage height={height} width={width} options={{ antialias: true, autoDensity: true, backgroundColor: 0xEDE4D9 }}>
            <Container position={[width * 0.75, height * 0.5]} options={{ antialias: true, autoDensity: true, backgroundColor: 0xffd900 }}>

            </Container>
        </Stage>
      )}
    </Fragment>
  );
};

export default Story;
