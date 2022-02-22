import { PixiComponent } from "@inlet/react-pixi";

const Video = PixiComponent("Video", {
  create: (props) => {
    const { path, mp4path, onComplete, x, y, width, height } = props;

    // HACK: as mentioned in the parcel issue https://github.com/parcel-bundler/parcel/issues/7643
    // there's a weirdness that still exists with how parcel is resolving
    // the URL paths
    let ultimatePath = new URL(
      "../assets/animations/oppose_angle.mp4",
      import.meta.url
    );
    const otherUrl = new URL(
      "../assets/animations/opposite_angle.webm",
      import.meta.url
    );
    // these two lines are functioning as expected
    switch (path) {
      case "../assets/animations/opposite_angle.webm":
        ultimatePath = otherUrl;
        break;
      case "../assets/animations/oppose_angle.mp4":
        ultimatePath = new URL(
          "../assets/animations/oppose_angle.mp4",
          import.meta.url
        );
        break;
      default:
        ultimatePath = new URL(path, import.meta.url);
        break;
    }
    const texture = PIXI.Texture.from(ultimatePath.href);
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

export default Video;
