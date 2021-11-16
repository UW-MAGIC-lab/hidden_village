import { Text, Graphics } from "@inlet/react-pixi";
import { TextStyle } from "@pixi/text";
import { useCallback } from "react";

const Button = (props) => {
  // return the NineSlicePlane and Text
  const { width, x, y, text, color, fontSize, fontColor, fontWeight } = props;
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(color);
      g.drawCircle(x, y, width * 0.45);
      g.endFill();
    },
    [width]
  );
  const style = new TextStyle({
    fontFamily: "Futura",
    fontSize: fontSize,
    fill: fontColor,
  });
  return (
    <>
      <Graphics draw={draw} />
      <Text
        text={text}
        style={
          new TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: fontSize,
            fontWeight: fontWeight,
            fill: [fontColor], // gradient
            // letterSpacing: 20,
            wordWrap: true,
            // wordWrapWidth: 440,
          })
        }
        x={x}
        y={y}
        anchor={0.5}
      />
    </>
  );
};

export default Button;
