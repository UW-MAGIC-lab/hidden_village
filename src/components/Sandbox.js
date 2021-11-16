import { Stage } from "@inlet/react-pixi";
import Background from "./Background";
import { useState } from "react";

const Sandbox = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  return (
    <Stage
      height={height}
      width={width}
      options={{
        antialias: true,
        autoDensity: true,
        backgroundColor: 0xfacf5a,
      }}
    >
      <Background height={height} width={width} />
    </Stage>
  );
};

export default Sandbox;
