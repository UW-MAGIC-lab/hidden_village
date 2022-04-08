import { PixiComponent } from "@inlet/react-pixi";
import { Graphics, Text } from "@inlet/react-pixi";
import { useCallback } from "react";
import { white, darkGray, yellow } from "../utils/colors";
import { getVideoFromPath } from "../models/conjectures";

const Video = PixiComponent("Video", {
  create: (props) => {
    const { path, onComplete, x, y, width, height } = props;

    const texture = PIXI.Texture.from(getVideoFromPath(path).href);
    const video = new PIXI.Sprite(texture);
    video.x = x;
    video.y = y;
    video.width = width;
    video.height = height;
    const videoController = video.texture.baseTexture.resource.source;
    videoController.addEventListener("ended", onComplete);
    return video;
  },
  config: {
    destroy: true,
    destroyChildren: true,
  },
});

const VideoPlayer = (props) => {
  const { columnDimensions, onComplete, videoPath } = props;
  const drawModalBackground = useCallback((g) => {
    g.beginFill(darkGray, 0.9);
    g.drawRect(0, 0, window.innerWidth, window.innerHeight);
    const col1 = columnDimensions(1);
    g.endFill();
    g.beginFill(yellow, 1);
    g.drawRect(col1.x, col1.y, col1.width, col1.height);
    g.endFill();
  }, []);
  return (
    <>
      <Graphics draw={drawModalBackground} />
      <Text
        text={"Watch this video. \nAfter it finishes, you'll be asked to match the movements!"}
        x={columnDimensions(2).x + columnDimensions(2).margin}
        y={columnDimensions(2).height / 2}
        style={
          new PIXI.TextStyle({
            align: "center",
            fontFamily: "Futura",
            fontSize: "4em",
            fontWeight: 800,
            fill: [white],
            wordWrap: true,
            wordWrapWidth: columnDimensions(2).width,
          })
        }
      />
      <Video
        path={videoPath}
        x={columnDimensions(1).x}
        y={columnDimensions(1).y}
        width={columnDimensions(1).width}
        height={columnDimensions(1).height}
        onComplete={onComplete}
      />
    </>
  );
};

export default VideoPlayer;
