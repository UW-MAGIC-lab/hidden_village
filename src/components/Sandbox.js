import { Stage } from "@inlet/react-pixi";
import Background from "./Background";
import Face from './Face';
import {  yellow, blue, white, darkGray } from "../utils/colors";
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
      <Face faceColor={blue} eyePosition={[-50/2,0]} eyeSpacing={50} eyeWidth={10} eyeHeight={15} mouthPosition={[-50/2, 35]} mouthWidth={50} mouthHeight={15} browPosition={[-50/2+10/2,-35]} browAngle={0.5} browLength={25}/>
    </Stage>
  );
};

export default Sandbox;
