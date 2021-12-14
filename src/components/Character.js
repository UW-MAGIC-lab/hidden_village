import { Graphics, Container, Sprite, useApp } from "@inlet/react-pixi";
import { useCallback, useEffect, useState, useRef } from "react";
import { blue, pink, green } from "../utils/colors";
import Face from "./Face";
import PropTypes from "prop-types";
import { SCALE_MODES } from "@pixi/constants";

const drawCircle = (g, height) => {
  g.drawCircle(0, 0, height);
  g.endFill();
};

const equilateralTriangle = (g, height) => {
  g.moveTo(height * 2, height);
  g.lineTo(height, -height);
  g.lineTo(0, height);
  g.lineTo(height, height);
  g.endFill();
};

const trapezoid = (g, height) => {
  g.moveTo(0, height);
  g.lineTo(height * 0.5, 0);
  g.lineTo(1.75 * height, 0);
  g.lineTo(2.25 * height, height);
  g.lineTo(0, height);
  g.endFill();
};

const square = (g, height) => {
  g.drawRect(0, 0, height, height);
  g.endFill();
};

const rectangle = (g, height) => {
  g.drawRect(0, 0, height, height * 2.5);
  g.endFill();
};

const scaleneTriangle = (g, height) => {
  const width = height * 0.5;
  g.moveTo(0, height);
  g.lineTo(width / 2, 0);
  g.lineTo(width, height);
  g.lineTo(0, height);
  g.endFill();
};

const moodToProps = (mood) => {
  switch (mood) {
    case "happy":
      return {
        mouthType: "happy",
        browType: "angry",
      };
    case "sad":
      return {
        mouthType: "sad",
        browType: "angry",
      };
    case "angry":
      return {
        mouthType: "angry",
        browType: "angry",
      };
    case "neutral":
      return {
        mouthType: "neutral",
        browType: "neutral",
      };
    case "surprised":
      return {
        mouthType: "surprised",
        browType: "neutral",
      };
    default:
      return {
        mouthType: "neutral",
        browType: "neutral",
      };
  }
};

/**
 * @component
 * @example
 * return (
 *   <Character
 *    type={"rectangle"}
 *    height={200}
 *    placement={[200, 200]}
 *    color={blue}
 *    mood={"neutral"}
 *    facePosition={[70, 50]}
 *  />
 * )
 * @description
 * type: String; One of ["circle", "equilateralTriangle", "scaleneTriangle", "square", "trapezoid", "rectangle"]
 *
 * color: String (hex); One of [blue, pink, green]
 *
 * height: Number (in pixels); often a scalar value of the height or other segment length
 *
 * facePosition: Array<Number>; An array with an x and y value, with (0,0) being the top left corner of the character
 *
 * mood: String; One of ["happy", "sad", "angry", "neutral", "surprised"]
 *
 * placement: Array<Number>; An array with an x and y value, with (0,0) being the top left corner of the screen
 *
 */

const Character = (props) => {
  const app = useApp();
  const { placement, type, color, height, facePosition } = props;
  const characterRef = useRef(null);
  const [texture, setTexture] = useState(null);
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(color);
    switch (type) {
      case "circle":
        drawCircle(g, height);
        break;
      case "equilateralTriangle":
        equilateralTriangle(g, height);
        break;
      case "scaleneTriangle":
        scaleneTriangle(g, height);
        break;
      case "square":
        square(g, height);
        break;
      case "trapezoid":
        trapezoid(g, height);
        break;
      case "rectangle":
        rectangle(g, height);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    setTexture(
      app.renderer.generateTexture(characterRef.current, {
        scaleMode: SCALE_MODES.LINEAR,
        resolution: window.innerWidth / window.innerHeight,
      })
    );
  }, []);

  return (
    <>
      {texture && (
        <Sprite texture={texture} x={placement[0]} y={placement[1]} />
      )}
      {!texture && (
        <Container position={placement} scale={1} ref={characterRef}>
          <Graphics draw={draw} />
          <Face
            placement={facePosition}
            height={76}
            width={76}
            {...moodToProps(props.mood)}
            eyeSpacing={type === "scaleneTriangle" ? "small" : "medium"}
          />
        </Container>
      )}
    </>
  );
};

export default Character;
