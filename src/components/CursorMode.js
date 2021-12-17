import { Rectangle } from "@pixi/math";
import { Container, Sprite } from "@inlet/react-pixi";
import { useState, useEffect, useRef } from "react";
import CursorMachine from "../machines/cursorMachine";
import { useMachine, useSelector } from "@xstate/react";

const hitAreasIntersect = (hitAreaOne, hitAreaTwo) => {
  return (
    hitAreaOne.x < hitAreaTwo.x + hitAreaTwo.width &&
    hitAreaOne.x + hitAreaOne.width > hitAreaTwo.x &&
    hitAreaOne.y < hitAreaTwo.y + hitAreaTwo.height &&
    hitAreaOne.y + hitAreaOne.height > hitAreaTwo.y
  );
};

const selectHovering = (state) => state.context.hovering;

/**
 * @name CursorMode
 * @param {Function} callback what will fire when you hover over the next button with the cursor
 * @param {Function} rowDimensionsCallback layoutFunction to provide position data
 * @param {Object} poseData poseData necessary for controlling the cursor
 *
 * @component
 * @example
 *
 *
 */

const CursorMode = (props) => {
  const nextButtonRef = useRef(null);
  const cursorRef = useRef(null);
  const [state, send, service] = useMachine(CursorMachine, {
    context: { callback: props.callback },
  });
  const hovering = useSelector(service, selectHovering);
  const [rowDimensions] = useState(props.rowDimensions(2));

  const [cursor] = useState(new URL("../assets/cursor.png", import.meta.url));
  const [nextButton, setNextButton] = useState(
    new URL("../assets/next_button.png", import.meta.url)
  );
  const [cursorCoordinates, setCursorCoordinates] = useState({
    x: window.innerWidth * 0.65,
    y: window.innerHeight * 0.5,
  });
  const [nextButtonCoordinates] = useState({
    x: rowDimensions.width - 3 * rowDimensions.margin,
    y: window.innerHeight * 0.85,
  });

  useEffect(() => {
    if (hovering) {
      setNextButton(
        new URL("../assets/next_button_hover.png", import.meta.url)
      );
    } else {
      setNextButton(new URL("../assets/next_button.png", import.meta.url));
    }
  }, [hovering]);

  useEffect(() => {
    if (
      props.poseData.poseLandmarks &&
      props.poseData.poseLandmarks[15] !== undefined
    ) {
      setCursorCoordinates({
        x: window.innerWidth * (props.poseData.poseLandmarks[15].x + 0.2),
        y: window.innerHeight * props.poseData.poseLandmarks[15].y + 0.1,
      });
      if (
        hitAreasIntersect(
          cursorRef.current.hitArea,
          nextButtonRef.current.hitArea
        )
      ) {
        send("TRIGGER");
      }
    }
  }, [props.poseData]);

  return (
    <Container>
      <Sprite
        image={nextButton.href}
        x={nextButtonCoordinates.x}
        y={nextButtonCoordinates.y}
        interactive
        anchor={0}
        ref={nextButtonRef}
        hitArea={
          new Rectangle(
            nextButtonCoordinates.x,
            nextButtonCoordinates.y,
            76,
            76
          )
        }
      ></Sprite>
      <Sprite
        image={cursor.href}
        x={cursorCoordinates.x}
        y={cursorCoordinates.y}
        interactive={true}
        anchor={0.5}
        name={"cursor"}
        ref={cursorRef}
        hitArea={
          new Rectangle(cursorCoordinates.x, cursorCoordinates.y, 76, 76)
        }
      ></Sprite>
    </Container>
  );
};

export default CursorMode;
