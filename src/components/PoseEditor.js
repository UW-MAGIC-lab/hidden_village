import { useState, useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic, POSE_LANDMARKS_LEFT } from "@mediapipe/holistic";
import CapturePose from "./CapturePose";
import { enrichLandmarks } from "./Pose/landmark_utilities";
import ConjecturePreview from "./ConjecturePreview";

const PoseEditor = () => {
  const [poseData, setPoseData] = useState(null);
  const videoElement = document.getElementsByClassName("input-video")[0];
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [capPoseList, setCapPoseList] = useState([0]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [savedPoseData, setSavedPoseData] = useState({});

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
  
  // onGetPoseData in CapturePose
  const getSavedPoseData = (index, poseData) => {
    let prevSavedPoseData = savedPoseData;
    prevSavedPoseData[index.toString()] = poseData;
    setSavedPoseData(prevSavedPoseData);
  };

  const deleteCapPose = (idx) => {
    let newList = [];
    for (i = 0; i < capPoseList.length; i++) {
      if (capPoseList[i] != idx) newList.push(capPoseList[i]);
    }
    if (idx in savedPoseData) {
      let temp = savedPoseData;
      delete temp[idx.toString()];
      setSavedPoseData(temp);
    }
    setCapPoseList(newList);
  };

  // onGetConjecture in ConjecturePreview
  const getSavedConjecture = () => {
    for (i = 0; i < capPoseList.length; i++) {
      console.log(savedPoseData[capPoseList[i].toString()]);
    }
    return savedPoseData;
  };

  return (
    <div className={(height < document.documentElement.scrollHeight)?"bg-slate-100 w-screen h-full flex flex-col gap-6":"bg-slate-100 w-screen h-screen flex flex-col gap-6"}>
      <div className="bg-white self-start font-bold text-2xl w-screen p-3">
        <label className="flex justify-center">My Conjecture</label>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {/* dynamically render capturePose components */}
          {capPoseList.map((idx) => (
            <div className="bg-white self-center rounded w-3/4" key={idx} id={`cap-pose-${idx}`}>
              <CapturePose
                poseData={poseData}
                onDelete={deleteCapPose}
                onGetPoseData={getSavedPoseData}
                index={idx}
              />
            </div>
          ))}
          {/* Add capturePose */}
          <div
            className="bg-slate-100 self-center rounded w-3/4
            text-2xl text-slate-400 p-3 
            border-2 border-dashed border-slate-400
            hover:border-blue-400 hover:text-blue-400"
          >
            <label
              className="flex justify-center"
              onClick={() => {
                setCapPoseList([...capPoseList, keyCounter + 1]);
                setKeyCounter(keyCounter+ 1);
              }}
            >
              + Add a pose
            </label>
          </div>
        </div>
        {/* Conjecture Preview */}
        <div className="bg-white self-start rounded w-3/4">
          <ConjecturePreview
            onGetConjecture={getSavedConjecture}
          />
        </div>
      </div>
    </div>
  );
};

export default PoseEditor;
