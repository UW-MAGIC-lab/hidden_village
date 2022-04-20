import { useState, useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic, POSE_LANDMARKS_LEFT } from "@mediapipe/holistic";
import CapturePose from "./CapturePose";
import { enrichLandmarks } from "./Pose/landmark_utilities";
import EditorCanvas from "./EditorCanvas";

const PoseEditor = () => {
  const [poseData, setPoseData] = useState(null);
  const videoElement = document.getElementsByClassName("input-video")[0];
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [capPoseList, setCapPoseList] = useState([0]);

  // when PoseEditor get mounted, do it once:
  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    }); // instantiate mediapipe holistic obj
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    // set up camera
    let camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement }); // wait for its completion than push to callback queue
      }, // listening to the Frame event
      // async: to handle long standing running func
      // await: a way to yield from the async func
      // js event loop
      width: width,
      height: height,
      facingMode: "environment",
    });
    camera.start();

    const updatePoseResults = (newResults) => {
      setPoseData(enrichLandmarks(newResults));
    };
    holistic.onResults(updatePoseResults); //eventListener (eventHandler function)
  }, []);

  const deleteCapPose = (idx) => {
    let newList =[];
    for (i=0; i<capPoseList.length; i++) {
      if (capPoseList[i] != idx)
        newList.push(capPoseList[i]);
    }
    console.log("new list:")
    console.log(newList);
    setCapPoseList(newList);
  };

  return (
    <div className="bg-slate-100 grid grid-cols-6 grid-rows-6 gap-6 w-screen h-screen">
      <div className="bg-white col-start-1 col-span-6 self-start font-bold text-2xl w-screen p-3">
        <label className="flex justify-center">My Conjecture</label>
      </div>
      {/* dynamically render capturePose components */}
      { capPoseList.map(idx => 
        <div className="bg-white col-start-2 col-span-2 self-start rounded">
          <CapturePose poseData={poseData} index={idx} onDelete={deleteCapPose}/>
        </div>) }
      {/* Add capturePose */}
      <div className="bg-slate-100 col-start-2 col-span-2 self-start rounded
        text-2xl text-slate-400 p-3 
        border-2 border-dashed border-slate-400
        hover:border-blue-400 hover:text-blue-400">
        <label className="flex justify-center"
          onClick={() => {
            setCapPoseList([...capPoseList, capPoseList.length]);
        }}>+ Add a pose</label>
      </div>
    </div>
  );
};

export default PoseEditor;
