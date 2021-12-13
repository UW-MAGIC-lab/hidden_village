import { useCallback } from "react";
import { Graphics } from "@inlet/react-pixi";
import { white } from "../utils/colors";

/**
 * @component
 */

// props
// eye-spacing: small, medium, large, None
// brows: angry, neutral, happy, None
// mouth: happy, confused, neutral, sad, None

const Face = (props) => {
  const { eyeSpacing, browType, mouthType, width, height, position } = props;
  const drawEyes = (g) => {
    // eyeshape would manipulate eyeHeight and eyeWidth
    const eyeHeight = height * 0.175;
    const eyeWidth = width * 0.125;
    let [rightEyeCoords, leftEyeCoords, rightPupil, leftPupil] = [];
    switch (eyeSpacing) {
      case "small":
        rightEyeCoords = { x: width * 0.65, y: 0 };
        rightPupil = { x: width * 0.625, y: height * -0.1 };
        leftEyeCoords = { x: width * 0.35, y: 0 };
        leftPupil = { x: width * 0.325, y: height * -0.1 };
        break;
      case "medium":
        rightEyeCoords = { x: width * 0.75, y: 0 };
        leftEyeCoords = { x: width * 0.25, y: 0 };
        rightPupil = { x: width * 0.725, y: height * -0.1 };
        leftPupil = { x: width * 0.225, y: height * -0.1 };
        break;
      case "large":
        rightEyeCoords = { x: width * 0.85, y: 0 };
        rightPupil = { x: width * 0.825, y: height * -0.1 };
        leftEyeCoords = { x: width * 0.15, y: 0 };
        leftPupil = { x: width * 0.125, y: height * -0.1 };
      default:
        break;
    }
    g.beginFill();
    g.drawEllipse(rightEyeCoords.x, rightEyeCoords.y, eyeWidth, eyeHeight);
    g.drawEllipse(leftEyeCoords.x, leftEyeCoords.y, eyeWidth, eyeHeight);
    g.endFill();
    g.beginFill(white);
    g.drawCircle(rightPupil.x, rightPupil.y, eyeWidth * 0.5);
    g.drawCircle(leftPupil.x, leftPupil.y, eyeWidth * 0.5);
    g.endFill();
  };

  const drawMouth = (g) => {
    // TODO: update position based on eyeSpacing
    switch (mouthType) {
      case "happy":
        g.beginFill();
        g.arc(width * 0.45, height * 0.45, width * 0.35, 0, Math.PI);
        g.endFill();
        break;
      case "neutral":
        g.beginFill();
        g.lineStyle(width * 0.1);
        g.moveTo(width * 0.25, height * 0.55);
        g.lineTo(width * 0.65, height * 0.55);
        g.endFill();
        break;
      case "confused":
        g.beginFill();
        g.drawCircle(width * 0.4, height * 0.65, width * 0.1);
        g.endFill();
        break;
      case "sad":
        g.beginFill();
        g.endFill();
        break;
      default:
        break;
    }
  };

  const drawBrows = (g) => {
    return;
    switch (browType) {
      case "angry":
        g.lineStyle(width * 0.1);
        break;
      case "neutral":
        // brows
        break;
      case "happy":
        // brows
        break;
      default:
        break;
    }
  };

  const draw = useCallback(
    (g) => {
      g.clear();
    // g.beginFill(props.faceColor);
    // // outline the face according to props.parentShape and fill with face color
    // // the above should be implemented in higher-up components

    // g.drawCircle(0, 0, 85);

    //     // canvas top left(0,0)
    //     // minimum size
    //     // position, scale of container
    // g.endFill();

    // draw 2 eyes given props.eyeSpacing, .eyePosition
    // g.beginFill();
    // g.drawEllipse(props.eyePosition[0], props.eyePosition[1], props.eyeWidth, props.eyeHeight);
    // g.drawEllipse(props.eyePosition[0]+props.eyeSpacing, props.eyePosition[1], props.eyeWidth, props.eyeHeight);
    // g.endFill();

    // g.beginFill(white);
    // g.drawCircle(props.eyePosition[0]-3, props.eyePosition[1]-8, 4);
    // g.drawCircle(props.eyePosition[0]-3+props.eyeSpacing, props.eyePosition[1]-8, 4);
    // g.endFill();

    // draw 2 eyeBrows given props.browType, .browPosition, .browAngle(in radians), .browLength
    // g.beginFill();
    // g.lineStyle(width=4);
    // // NOTE: FOR NOW ONLY SAD BROWS PART IS WORKING
    // // calculate and line to the end point of the left brow with the given browAngle
    // g.moveTo(props.browPosition[0], props.browPosition[1]); // starting point is the right high end of the left sad brow
    // const sadbrow_left = [props.browPosition[0]-(Math.cos(props.browAngle)*props.browLength), props.browPosition[1]+(Math.sin(props.browAngle)*props.browLength)];
    // angrybrow_left;
    // // angry brows
    // if (props.browAngle < 0) {
    //   g.lineTo(props.browPosition[0]+(Math.cos(-props.browAngle)*props.browLength), props.browPosition[1]+(Math.sin(-props.browAngle)*props.browLength));
    // }
    // // sad brows
    // else if (props.browAngle > 0) {
    //   g.lineTo(sadbrow_left[0],sadbrow_left[1]);
    // }
    // // neutral brows
    // else {
    //   g.lineTo(props.browPosition[0]+props.browLength, props.browPosition[1]);
    // }

    // // symmetrically draw the right brow
    // g.moveTo(-props.browPosition[0], props.browPosition[1]);
    // // angry brows
    // if (props.browAngle < 0) {
    //   g.lineTo(props.browPosition[0]+(Math.cos(-props.browAngle)*props.browLength), props.browPosition[1]+(Math.sin(-props.browAngle)*props.browLength));
    // }
    // // sad brows
    // else if (props.browAngle > 0) {
    //   g.lineTo(-sadbrow_left[0], sadbrow_left[1]);
    // }
    // // neutral brows
    // else {
    //   g.lineTo(props.browPosition[0]+props.browLength, props.browPosition[1]);
    // }

    // //g.drawRect(props.eyebrowPosition[0], props.eyebrowPosition[1], props.eyebrowWidth, props.eyebrowHeight);
    // g.endFill();

    // // draw mouth given props.mouthType, .mouthPosition
    // g.beginFill();
    // g.drawRect(props.mouthPosition[0], props.mouthPosition[1], props.mouthWidth, props.mouthHeight);
    // g.endFill();
      g.clear();
      drawEyes(g);
      drawMouth(g);
      drawBrows(g);
    },
    [props]
  );

  return <Graphics draw={draw} position={position} />;
};

export default Face;
