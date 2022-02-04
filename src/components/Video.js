import { PixiComponent } from '@inlet/react-pixi';

const Video = PixiComponent('Video', {
  create: props => {
    const { path, mp4path, onComplete, x, y } = props;
    
    // these three lines are not functioning as expected
    const videoPath = new URL(`${path}`, import.meta.url)
    const videoPathNoTemplateString = new URL(path, import.meta.url)
    const mp4VideoPath = new URL(mp4path, import.meta.url)
    let ultimatePath = new URL("../assets/animations/oppose_angle.mp4", import.meta.url);
    const otherUrl = new URL("../assets/animations/other_one.webm", import.meta.url)
    // these two lines are functioning as expected
    switch (path) {
      case '../assets/animations/other_one.webm':
        ultimatePath = otherUrl;
        break;
      case '../assets/animations/oppose_angle.mp4':
        ultimatePath = new URL("../assets/animations/oppose_angle.mp4", import.meta.url)
        break;
      default:
        ultimatePath = new URL(path, import.meta.url)
        break;
    }
    // const otherMp4Url = new URL("../assets/animations/oppose_angle.mp4", import.meta.url)
    const texture = PIXI.Texture.from(ultimatePath.href);
    const video = new PIXI.Sprite(texture);
    video.x = x;
    video.y = y;
    const videoController = video.texture.baseTexture.resource.source;
    videoController.addEventListener('ended', onComplete);
    // instantiate something and return it.
    // for instance:
    return video;
  },
  // didMount: (instance, parent) => {
  //   // apply custom logic on mount
  // },
  // willUnmount: (instance, parent) => {
  //   // clean up before removal
  // },
  // applyProps: (instance, oldProps, newProps) => {
  //   // props changed
  //   // apply logic to the instance
  // },
  config: {
    // destroy instance on unmount?
    // default true
    destroy: true,

    /// destroy its children on unmount?
    // default true
    destroyChildren: true,
  },
})

// const  = forwardRef((props, ref) => (
//   <PixiVideoComponent ref={ref} app={useApp()} {...props} />
// ));

// console.log(Video);
export default Video;