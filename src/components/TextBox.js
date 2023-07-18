import { Container, Graphics, Text } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { white, darkGray } from "../utils/colors";
import { TextStyle } from "@pixi/text";

const TextBox = (props) => {
  const { rowDimensionsCallback, text } = props;
  const [rowDimensions] = useState(rowDimensionsCallback(2));
  const [textStartX] = useState(12 * rowDimensions.margin);
  const [textStartY] = useState(4 * rowDimensions.margin);
  const [displayText, setDisplayText] = useState(text);
  // create background design drawing a horizontal line across the top of the Container
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(darkGray, 0.9);
    g.drawRect(
      0,
      3 * rowDimensions.margin,
      rowDimensions.width,
      rowDimensions.height - 4 * rowDimensions.margin
    );
    g.endFill();
  }, []);

  useEffect(() => {
    setDisplayText(text);
  }, [props.text]);

  return (
    // Position the Container to the top of the row -- this will set all x, y coordinates _RELATIVE_ to the Container
    // e.g. (0,0) will be the top left corner of the container.
    <Container position={[rowDimensions.x, rowDimensions.y]}>
      <Graphics draw={draw} />
      <Container position={[rowDimensions.margin, 5 * rowDimensions.margin]}>
        {props.speaker}
      </Container>
      <Text
        text={displayText}
        x={textStartX}
        y={textStartY}
        style={
          new TextStyle({
            align: "left",
            fontFamily: "Futura",
            fontSize: "5em",
            fontWeight: 800,
            fill: [white],
            wordWrap: true,
            wordWrapWidth: rowDimensions.width - 18 * rowDimensions.margin,
          })
        }
      />
    </Container>
  );
};

export default TextBox;
