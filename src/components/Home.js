import Background from "./Background";
import Button from "./Button";
import { Text } from "@inlet/react-pixi";
import { TextStyle } from "@pixi/text";

const Home = (props) => {
  const { height, width } = props;
  return (
    <>
      <Background height={height} width={width} />
      <Button
        height={height * 0.5}
        width={width * 0.33}
        x={width * 0.5}
        y={height * 0.7}
        color={0x2080d5}
        fontSize={120}
        fontColor={0xfacf5a}
        text={"Start"}
        fontWeight={800}
      />
      <Text
        text={"Hidden Village"}
        x={width * 0.5}
        y={height * 0.25}
        style={
          new TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: 146,
            fontWeight: 800,
            fill: [0x2080d5],
            letterSpacing: -5,
          })
        }
        anchor={0.5}
      />
    </>
  );
};

export default Home;
