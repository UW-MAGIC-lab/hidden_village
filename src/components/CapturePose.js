import { useEffect, useState } from "react";
import { flatten } from "xstate/lib/utils";
import EditorCanvas from "./EditorCanvas";

const CapturePose = (props) => {
  const {poseData} =  props;
  const [open, setOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [counter, setCounter] = useState(0);
  const [hasCapturedPose, setHasCapturedPose] = useState(false);
  const [capturedPose, setCapturedPose] = useState({}); // object(hash-table): key-value pair

  const tryCapture = (event) => {
    if (!isCountingDown) {
      let countdown = 3;
      setCounter(countdown);
      let button = event.currentTarget;
      setIsCountingDown(true);
      setShowCounter(true);
      // timer starts counting down
      const timerId = setInterval((event) => {
        button.interactive = false;
        button.buttonMode = false;
        console.log(countdown);
        setCounter(--countdown);
        // finish capturing
        if (countdown < 0) {
          clearInterval(timerId);
          button.interactive = true;
          button.buttonMode = true;
          setCapturedPose(poseData);
          setHasCapturedPose(true);
          setIsCountingDown(false);
          setShowCounter(false);
        }
      }, 1000);
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
            grid grid-cols-1 gap-3 justify-items-center place-content-center"
        >
          <EditorCanvas width={400} height={300} poseData={poseData} />
          {showCounter && <div className="text-8xl z-10">{counter}</div>}
          <button 
            className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
            onClick={(event) => { if (!isCountingDown) tryCapture(event)}}
          >
            Capture
          </button>
        </div>
        {/* captured pose preview canvas */}
        <div
          className="
            grid grid-cols-2 gap-3 justify-items-center place-content-center"
        >
          {hasCapturedPose &&
            <div className="col-start-1 col-span-2">
              <EditorCanvas width={400} height={300} poseData={capturedPose} />
            </div>
          }
          {/* {hasCapturedPose &&
            (console.log(capturedPoses[0]))
          } */}
          {/* buttons at the bottom */}
          <button 
            className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
            onClick={() => {
              // TODO: save captured pose data
              setOpen(!open);
            }}
          >
            Save
          </button>
          <button 
            className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
            onClick={() => {
              setHasCapturedPose(false); // don't save pose
              setOpen(!open);
            }}
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
