import { Container, Graphics, Text } from "@inlet/react-pixi";
import { useCallback, useState } from "react";
import { white, darkGray } from "../utils/colors";
import { TextStyle } from "@pixi/text";

const TextBox = (props) => {
  const { rowDimensionsCallback, text } = props;
  const [rowDimensions, setRowDimensions] = useState(rowDimensionsCallback(2));
  const [textStartX, setTextStartX] = useState(
    rowDimensions.x + 11 * rowDimensions.margin
  );
  const [textStartY, setTextStartY] = useState(
    rowDimensions.y + 3 * rowDimensions.margin
  );
  console.log(rowDimensions);
  // create background design drawing a horizontal line across the top of the Container
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(darkGray, 0.9);
    g.drawRect(
      rowDimensions.x,
      rowDimensions.y + 2 * rowDimensions.margin,
      rowDimensions.width,
      rowDimensions.height - 4 * rowDimensions.margin
    );
    g.endFill();
  }, []);

  return (
    <Container position={[0, rowDimensions.x]}>
      <Graphics draw={draw} />
      <Text
        text={text}
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
            wordWrapWidth: rowDimensions.width - 12 * rowDimensions.margin,
          })
        }
      />
    </Container>
  );
};

export default TextBox;
