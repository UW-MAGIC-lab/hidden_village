import { useState, useCallback, useEffect } from "react";
import { Graphics, Text, useApp } from "@inlet/react-pixi";
import CursorMode from "./CursorMode.js";
import Pose from "./Pose/index";
import { white, darkGray, yellow } from "../utils/colors";
import { writeToDatabase } from "../firebase/database.js";

const ExperimentalTask = (props) => {
  const {
    prompt,
    poseData,
    columnDimensions,
    onComplete,
    rowDimensions,
    cursorTimer,
    currentConjectureIdx,
  } = props;
  const [showCursor, setShowCursor] = useState(false);

  const drawModalBackground = useCallback((g) => {
    g.beginFill(darkGray, 0.9);
    g.drawRect(0, 0, window.innerWidth, window.innerHeight);
    const col3 = columnDimensions(3);
    g.endFill();
    g.beginFill(yellow, 1);
    g.drawRect(col3.x, col3.y, col3.width, col3.height);
    g.endFill();
  });

  // Database Write Functionality
  // This lives in ExperimentalTask.js so it only runs when the user is participating in a conjecture
  useEffect(() => {
    // Optional URL parameters for whether motion data recording is enabled
    // and what the fps is for recording.
    // Defaults are false and 30.
    const queryParameters = new URLSearchParams(window.location.search);
    const recordingUrlParam = queryParameters.get("recording") || "false";
    // If the recording param is set to true, run the recording functions
    if (recordingUrlParam.toLowerCase() === "true") {
      // Get the query parameter. If empty, set to 30 for a default.
      const fpsUrlParam = parseInt(queryParameters.get("fps")) || 30;
      // Empty array to hold the promise objects.
      // This is important so we can assure that all the promises get settled on component unmount.
      let promises = [];
      // This creates an interval for the writing to the database every n times a second, where n is a variable framerate.
      const intervalId = setInterval(() => {
        // Call the writeToDatabase function
        // Push the resulting promise object to the promises array
        promises.push(
          writeToDatabase(poseData, currentConjectureIdx, fpsUrlParam)
        );
      }, 1000 / fpsUrlParam);

      return async () => {
        // On component unmount:
        // Stop the interval
        clearInterval(intervalId);
        // Wait until all promises are settled so we don't lose data
        await Promise.allSettled(promises);
      };
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setShowCursor(true);
        console.log("done");
      },
      cursorTimer ? cursorTimer : 1000
    );
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Graphics draw={drawModalBackground} />
      <Text
        text={prompt}
        y={columnDimensions(1).y + columnDimensions(1).height / 4}
        x={columnDimensions(1).x + columnDimensions(1).margin}
        style={
          new PIXI.TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: "5em",
            fontWeight: 800,
            fill: [white],
            wordWrap: true,
            wordWrapWidth: columnDimensions(2).width * 2,
          })
        }
      />
      <Pose poseData={poseData} colAttr={columnDimensions(3)} />
      {showCursor && (
        <>
          <CursorMode
            poseData={poseData}
            rowDimensions={rowDimensions}
            callback={onComplete}
          />
          <Text
            text={"When you're ready to move on, click 'Next' to continue"}
            y={columnDimensions(1).y + 7 * (columnDimensions(1).height / 8)}
            x={columnDimensions(1).x + columnDimensions(1).margin}
            style={
              new PIXI.TextStyle({
                align: "center",
                fontFamily: "Futura",
                fontSize: "3.5em",
                fontWeight: 800,
                fill: [white],
                wordWrap: true,
                wordWrapWidth: columnDimensions(1).width * 2,
              })
            }
          />
        </>
      )}
    </>
  );
};

export default ExperimentalTask;
