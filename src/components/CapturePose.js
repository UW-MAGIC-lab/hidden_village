import { useEffect, useState } from "react";
import EditorCanvas from "./EditorCanvas";
import PoseName from "./PoseName";

const CapturePose = (props) => {
  const { poseData, index, onDelete, onGetPoseData } = props;
  const [open, setOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [counter, setCounter] = useState(0);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [hasSavedPose, setHasSavePose] = useState(false);
  const [capturedPose, setCapturedPose] = useState({}); // object(hash-table): key-value pair
  const [prevPose, setPrevPose] = useState({}); // object(hash-table): key-value pair

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
        setCounter(--countdown);
        // finish capturing
        if (countdown <= 0) {
          clearInterval(timerId);
          button.interactive = true;
          button.buttonMode = true;

          setPrevPose(capturedPose);
          setCapturedPose(poseData);

          setHasSavePose(true);
          setHasCaptured(true);

          setIsCountingDown(false);
          setShowCounter(false);
        }
      }, 1000);
    }
  };

  return (
    <div>
      <div className="font-medium text-lg justify-self-start px-4 py-2">
        <PoseName defaultName={`My Pose ${index}`} index={index}></PoseName>
      </div>
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
            <EditorCanvas width={300} height={200} poseData={poseData} />
            {showCounter && <div className="text-8xl z-10">{counter}</div>}
            <button
              className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
              onClick={(event) => {
                if (!isCountingDown) tryCapture(event);
              }}
            >
              Capture
            </button>
          </div>
          {/* captured pose preview canvas */}
          <div
            className="
            grid grid-cols-2 gap-3 justify-items-center place-content-center"
          >
            {hasSavedPose && (
              <div className="col-start-1 col-span-2">
                <EditorCanvas
                  width={300}
                  height={200}
                  poseData={capturedPose}
                />
              </div>
            )}
            {/* buttons at the bottom */}
            <button
              className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
              onClick={() => {
                setHasCaptured(false);
                onGetPoseData(index, capturedPose);
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
                if (hasCaptured) {
                  setCapturedPose(prevPose); // don't save pose
                }
                setHasCaptured(false);
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
        <div className="grid grid-cols-6 m-3 gap-y-5 gap-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium p-2 rounded"
            onClick={() => setOpen(!open)}
          >
            Edit
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium p-2 rounded"
            onClick={() => {
              onDelete(index);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CapturePose;
