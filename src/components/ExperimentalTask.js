import { useState, useCallback, useEffect } from "react";
import { Graphics, Text, useApp } from "@pixi/react";
import CursorMode from "./CursorMode.js";
import Pose from "./Pose/index";
import { white, darkGray, yellow } from "../utils/colors";

const ExperimentalTask = (props) => {
  const {
    prompt,
    poseData,
    columnDimensions,
    onComplete,
    rowDimensions,
    cursorTimer,
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
