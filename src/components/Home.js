import { Container, Graphics } from "@inlet/react-pixi";
import { useCallback } from "react";

const Home = (props) => {
  // create background design drawing a horizontal line across the top of the Container
  const background = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(4, 0x2080d5, 1);
      // draw horizon
      g.moveTo(0, 0);
      g.lineTo(props.width, 0);
      // draw midline to bottom of screen

      const linesToSide = [0.05, 0.11, 0.175, 0.25, 0.375, 0.6, 1];
      linesToSide.forEach((element) => {
        g.moveTo(props.width / 2, 0);
        g.lineTo(0, props.width * element);
        g.moveTo(props.width / 2, 0);
        g.lineTo(props.width, props.width * element);
      });
      const linesToBottom = [0.375, 0.5, 0.625];
      linesToBottom.forEach((element) => {
        g.moveTo(props.width / 2, 0);
        g.lineTo(props.width * element, props.height);
      });
    },
    [props.height, props.width]
  );

  return (
    <Container position={[0, props.height * 0.55]}>
      <Graphics draw={background} />
    </Container>
  );
};

export default Home;
