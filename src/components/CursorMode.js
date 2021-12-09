import { Rectangle } from "@pixi/math";
import { Container, Sprite } from "@inlet/react-pixi";
import { useState, useEffect, useRef } from "react";

const hitAreasIntersect = (a, b) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

const CursorMode = (props) => {
  const nextButtonRef = useRef(null);
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [cursor] = useState(new URL("../assets/cursor.png", import.meta.url));
  const [nextButton, setNextButton] = useState(
    new URL("../assets/next_button.png", import.meta.url)
  );
  const [cursorCoordinates, setCursorCoordinates] = useState({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
  });
  const [nextButtonCoordinates] = useState({
    x: window.innerWidth * 0.9,
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
        x: window.innerWidth * (props.poseData.poseLandmarks[15].x + 0.15),
        y: window.innerHeight * props.poseData.poseLandmarks[15].y + 0.1,
      });
      if (
        hitAreasIntersect(
          cursorRef.current.hitArea,
          nextButtonRef.current.hitArea
        )
      ) {
        setHovering(true);
        setTimeout(() => {
          props.callback();
          setHovering(false);
        }, 1000);
      }
    }
  }, [props.poseData]);

  return (
    <Container>
      <Sprite
        image={nextButton.href}
        x={nextButtonCoordinates.x}
        y={nextButtonCoordinates.y}
        mouseover={() => setHovering(true)}
        mouseout={() => setHovering(false)}
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
