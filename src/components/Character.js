import { Graphics, Container, Sprite, useApp } from "@inlet/react-pixi";
import { useCallback, useEffect, useState, useRef } from "react";
import Face from "./Face";
import { SCALE_MODES } from "@pixi/constants";

const drawCircle = (g, height) => {
  g.drawCircle(0, 0, height);
  g.endFill();
};

const equilateralTriangle = (g, height) => {
  g.moveTo(height, height / 2);
  g.lineTo(height / 2, -height / 2);
  g.lineTo(0, height / 2);
  g.lineTo(height / 2, height / 2);
  g.endFill();
};

const trapezoid = (g, height) => {
  const shortWidth = 1.75 * height;
  const longWidth = 2.25 * height;
  g.moveTo(0, height);
  g.lineTo(height * 0.5, 0);
  g.lineTo(shortWidth, 0);
  g.lineTo(longWidth, height);
  g.lineTo(0, height);
  g.endFill();
};

const square = (g, height) => {
  g.drawRect(0, 0, height, height);
  g.endFill();
};

const rectangle = (g, height) => {
  g.drawRect(0, 0, height / 2.5, height);
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

const randomScalar = () => {
  return ((min, max) => {
    return Math.random() * (max - min) + min;
  })(-1, 1);
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
  const {
    type,
    color,
    height,
    facePosition,
    placementText,
    colDimensions,
    rowDimensions,
  } = props;
  const characterRef = useRef(null);
  const [texture, setTexture] = useState(null);
  const generatePlacement = useCallback(
    (placementText, colDimensions, rowDimensions) => {
      const [yText, xText] = placementText.split(" ");
      const rowYVariation = rowDimensions.height * 0.05 * randomScalar();
      const colYVariation = colDimensions.height * 0.05 * randomScalar();
      let newPlacement = [];
      switch (yText) {
        case "background":
          newPlacement[1] =
            colDimensions.y + colDimensions.height * 0.45 + colYVariation;
          break;
        case "midground":
          newPlacement[1] =
            colDimensions.y + colDimensions.height * 0.6 + colYVariation;
          break;
        case "foreground":
          newPlacement[1] =
            colDimensions.y + colDimensions.height * 0.75 + colYVariation;
          break;
        case "aboveground":
          newPlacement[1] =
            rowDimensions.y + rowDimensions.height * 0.2 + rowYVariation;
          break;
        default:
          break;
      }
      const colXVariation = colDimensions.width * 0.05 * randomScalar();
      switch (xText) {
        case "left":
          newPlacement[0] =
            colDimensions.x + colDimensions.width * 0.1 + colXVariation;
          break;
        case "center":
          newPlacement[0] =
            colDimensions.x + colDimensions.width * 0.75 + colXVariation;
          break;
        case "right":
          newPlacement[0] =
            colDimensions.x + colDimensions.width + colXVariation;
          break;
        default:
          break;
      }
      // guard against rendering the sprite off screen
      newPlacement[1] = Math.min(
        newPlacement[1],
        colDimensions.y + colDimensions.height - height
      );
      return newPlacement;
    }
  );
  const [placement, setPlacement] = useState(
    props.placement ||
      generatePlacement(placementText, colDimensions, rowDimensions)
  );

  useEffect(() => {
    if (!placement && placementText) {
      // need to add guard for invalid placementText
      setPlacement(
        generatePlacement(placementText, colDimensions, rowDimensions)
      );
    }
  }, [props.placementText]);

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
        <Sprite
          texture={texture}
          x={placement[0]}
          y={placement[1]}
          name="type"
        />
      )}
      {!texture && (
        <Container
          position={placement}
          scale={1}
          ref={characterRef}
          name="type"
        >
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
