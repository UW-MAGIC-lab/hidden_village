import { useEffect, useState } from "react";
import EditorCanvas from "./EditorCanvas";
import PoseName from "./PoseName";

const CapturePose = (props) => {
  const { poseData, index, onDelete, onGetPoseData } = props;
  const [open, setOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [counter, setCounter] = useState(0);
  const [hasSavedPose, setHasSavePose] = useState(false);
  const [capturedPose, setCapturedPose] = useState({}); // object(hash-table): key-value pair

  const tryCapture = (event) => {
    if (!isCountingDown) {
      let countdown = 3;
      setCounter(countdown);
      let button = event.currentTarget;
      setIsCountingDown(true);
      // timer starts counting down
      const timerId = setInterval(() => {
        button.interactive = false;
        button.buttonMode = false;
        setCounter(--countdown);
        // finish capturing
        if (countdown <= 0) {
          clearInterval(timerId);
          setCapturedPose(poseData);

          button.interactive = true;
          button.buttonMode = true;
          setIsCountingDown(false);
          setHasSavePose(true);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    onGetPoseData(index, capturedPose);
  }, [capturedPose]);

  return (
    <div className="relative">
      <div className="font-medium text-lg justify-self-start px-4 py-2">
        <PoseName defaultName={`My Pose ${index}`} index={index}></PoseName>
      </div>
      {/* open state */}
      {open && (
        <div
          className="
          grid grid-cols-2 gap-3 m-3 justify-items-center place-content-center"
        >
          {/* real-time camera canvas */}
          <div
            className="
            grid grid-cols-1 gap-3 justify-items-center place-content-center relative"
          >
            <EditorCanvas width={280} height={260} poseData={poseData} />
            <div className="absolute bottom-12">
              {isCountingDown && <div className="text-slate-500 text-8xl z-10 p-6">{counter}</div>}
            </div>
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
            grid grid-cols-1 gap-3 justify-items-center place-content-center"
          >
            {hasSavedPose && (
              <EditorCanvas width={280} height={260} poseData={capturedPose}/>
            )}
            {/* button at the bottom */}
            <button
              className="
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            justify-self-center"
              onClick={() => {
                setOpen(!open);
              }}
            >
              Close
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
          {/* Saved Pose Preview */}
          {hasSavedPose && (
            <div className="col-start-3 col-span-4 justify-self-end absolute bottom-0">
              <EditorCanvas width={100} height={80} poseData={capturedPose}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapturePose;
