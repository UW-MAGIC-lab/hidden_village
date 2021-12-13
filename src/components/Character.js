import { Graphics, Container } from "@inlet/react-pixi";
import { blue } from "../utils/colors";
import { useCallback } from "react";
import Face from "./Face";

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
}

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
  g.lineTo(width/2, 0);
  g.lineTo(width, height);
  g.lineTo(0, height);
  g.endFill();
};

const moodToProps = (mood) => {
  switch (mood) {
    case "happy":
      return {
        mouthType: "happy",
        browType: "angry"
      };
    case "sad":
      return {
        mouthType: "sad",
        browType: "angry"
      };
    case "angry":
      return {
        mouthType: "angry",
        browType: "angry"
      };
    case "neutral":
      return {
        mouthType: "neutral",
        browType: "neutral"
      };
    case "surprised":
      return {
        mouthType: "surprised",
        browType: "neutral"
      };
    default:
      return {
        mouthType: "neutral",
        browType: "neutral"
      };
    }
}

const Character = (props) => {
  const { placement, type, color, height, facePosition } = props;
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


  return (
    <Container position={placement} scale={1}>
      <Graphics draw={draw} />
      <Face
        placement={facePosition}
        height={76}
        width={76}
        {...moodToProps(props.mood)}
        eyeSpacing={type === 'scaleneTriangle' ? "small" : "medium" }
      />
    </Container>
  );
};

export default Character;
