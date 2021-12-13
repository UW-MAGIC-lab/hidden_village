import { Graphics, Container } from "@inlet/react-pixi";
import { blue } from "../utils/colors";
import { useCallback } from "react";
import Face from "./Face";

const Character = (props) => {
  const draw = useCallback(
    (g) => {
      // start with just the circle character
      g.clear();
      g.beginFill(blue);
      g.drawCircle(0, 0, 85);
      g.endFill();
    },
    [props]
  );
  return (
    <Container position={[200, 200]} scale={1}>
      <Graphics draw={draw} />
      <Face
        position={[-30, -10]}
        height={76}
        width={76}
        eyeSpacing={"large"}
        mouthType={"happy"}
        browType={"angry"}
      />
    </Container>
  );
};

export default Character;
