import { useEffect, useState } from "react";
import EditorCanvas from "./EditorCanvas";

const CapturePose = (props) => {
  const {poseData} =  props;
  const [open, setOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [hasCapturedPose, setHasCapturedPose] = useState(false);
  const [capturedPoses, setCapturedPoses] = useState({}); // object(hash-table): key-value pair

  const tryCapture = () => {
    if (!isCountingDown) {
      setIsCountingDown(true);
      console.log("Capturing!");
      // timer starts counting down
      console.log("3! 2! 1!");
      console.log("Captured!");
      setCapturedPoses(poseData);
      setHasCapturedPose(true);
      setIsCountingDown(false);
    }
  };

  return (
    <div
      className="
        bg-white w-1/2"
    >
    {/* open state */}
    {open && (
      <div
        className="
          grid grid-cols-2 gap-3 justify-items-center place-content-center"
      >
        {/* real-time camera canvas */}
        <div
          className="
            grid grid-cols-1 gap-3 justify-items-center place-content-around"
        >
          <EditorCanvas width={400} height={300} poseData={poseData} />
          <button 
            className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
            onClick={() => { if (!isCountingDown) tryCapture()}}
          >
            Capture
          </button>
          {/* {open && (
            <div
              className="
                "
            >
            </div>
          )}
          {!open && (
            <div>CLOSE STATE</div>
          )} */}
        </div>
        {/* captured pose preview canvas */}
        <div
          className="
            grid grid-cols-1 gap-3 justify-items-center place-content-around"
        >
          {hasCapturedPose &&
            <EditorCanvas width={400} height={300} poseData={capturedPoses} />
          }
          {/* {hasCapturedPose &&
            (console.log(capturedPoses[0]))
          } */}
          <button 
            className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-end"
            onClick={() => setOpen(!open)}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    {/* close state */}
    {!open && (
      <div
        className="
          flex justify-between items-center"
      >
        <div>POSE 1</div>
        <button 
          className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-end"
          onClick={() => setOpen(!open)}
        >
          Edit Pose
        </button>
      </div>
    )}
    </div>
    );
};

export default CapturePose;
