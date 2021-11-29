import { Container, Graphics, Sprite, Text } from "@inlet/react-pixi";
import { useCallback, useEffect, useState } from "react";
import { white, darkGray } from "../utils/colors";
import { TextStyle } from "@pixi/text";

const TextBox = (props) => {
  const { rowDimensionsCallback, text } = props;
  const [rowDimensions] = useState(rowDimensionsCallback(2));
  const [hovering, setHovering] = useState(false);
  const [textStartX] = useState(
    12 * rowDimensions.margin
  );
  const [textStartY] = useState(
    4 * rowDimensions.margin
  );
  const [displayText, setDisplayText] = useState(text[0]);
  const [nextButton, setNextButton] = useState(new URL('../assets/next_button.png', import.meta.url))
  useEffect(() => {
    if (hovering) {
      setNextButton(new URL('../assets/next_button_hover.png', import.meta.url))
    } else {
      setNextButton(new URL('../assets/next_button.png', import.meta.url))
    }
  }, [hovering])
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

  return (
    // Position the Container to the top of the row -- this will set all x, y coordinates _RELATIVE_ to the Container
    // e.g. (0,0) will be the top left corner of the container.
    <Container position={[rowDimensions.x, rowDimensions.y]}>
      <Graphics draw={draw} />
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
      <Sprite
        image={nextButton.href}
        x={rowDimensions.width - (3*rowDimensions.margin)}
        y={rowDimensions.height - (4*rowDimensions.margin)}
        mouseover={() => setHovering(true)}
        mouseout={() => setHovering(false)}
        mouseup={() => {
          text.shift();
          setDisplayText(text[0]);
        }}
        interactive={true}
        anchor={0.5}
      ></Sprite>
    </Container>
  );
};

export default TextBox;
