import { useState, useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import { Holistic, POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS } from '@mediapipe/holistic';
import PoseCapture from "./PoseCapture";
import EditorCanvas from "./EditorCanvas";

const PoseEditor = () => {
    // const [height, setHeight] = useState(window.innerHeight);
    // const [width, setWidth] = useState(window.innerWidth);

    // // const videoRef = useRef(null);
    // const canvasRef = useRef(null);

    // will be called when the component PoseEditor gets mounted
    // useEffect(() => {
    //     // const videoElement = videoRef.current;
    //     const videoElement = document.getElementsByClassName("input-video")[0];
    //     const canvasElement = canvasRef.current;
    //     const canvasCtx = canvasElement.getContext('2d');

    //     function onResults(results) {
    //         canvasCtx.save();
    //         canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //         // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //         //                     canvasElement.width, canvasElement.height);
          
    //         // ? not sure what the options for globalCompositeOperation means
    //         // Only overwrite existing pixels.
    //         canvasCtx.globalCompositeOperation = 'source-in'; 
    //         canvasCtx.fillStyle = '#00FF00';
    //         canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
          
    //         // Only overwrite missing pixels.
    //         canvasCtx.globalCompositeOperation = 'destination-atop';
    //         canvasCtx.drawImage(
    //             results.image, 0, 0, canvasElement.width, canvasElement.height);
          
    //         canvasCtx.globalCompositeOperation = 'source-over';
    //         drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
    //                        {color: '#00FF00', lineWidth: 4});
    //         drawLandmarks(canvasCtx, results.poseLandmarks,
    //                       {color: '#FF0000', lineWidth: 2});
    //         drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    //                        {color: '#C0C0C070', lineWidth: 1});
    //         drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
    //                        {color: '#CC0000', lineWidth: 5});
    //         drawLandmarks(canvasCtx, results.leftHandLandmarks,
    //                       {color: '#00FF00', lineWidth: 2});
    //         drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
    //                        {color: '#00CC00', lineWidth: 5});
    //         drawLandmarks(canvasCtx, results.rightHandLandmarks,
    //                       {color: '#FF0000', lineWidth: 2});
    //         canvasCtx.restore();
    //     }

    //     canvasCtx.fillStyle = '#A7D3BD';
    //     canvasCtx.fillRect(0, 0, width, height);
    //     // draw here on canvas ...
        
    //     // ? what is the code doing here 
    //     const holistic = new Holistic({locateFile: (file) => {
    //         return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    //     }}); // instantiate mediapipe holistic obj
    //     holistic.setOptions({
    //         modelComplexity: 1,
    //         smoothLandmarks: true,
    //         enableSegmentation: false,
    //         smoothSegmentation: true,
    //         refineFaceLandmarks: true,
    //         minDetectionConfidence: 0.5,
    //         minTrackingConfidence: 0.5
    //     });

    //     holistic.onResults(onResults); //eventListener (eventHandler function)

    //     let camera = new Camera(videoElement, {
    //         onFrame: async () => {
    //             await holistic.send({image: videoElement}); // wait for its completion than push to callback queue
    //         }, // listening to the Frame event
    //         // async: to handle long standing running func
    //         // await: a way to yield from the async func
    //         // js event loop
    //         width: window.innerWidth,
    //         height: window.innerHeight,
    //         facingMode: "environment",
    //     });
    //     camera.start();

    // }, []) // empty array at 2nd arg tells that func as 1st arg is only executing once

    return (
        <div className="
            bg-slate-100
            grid grid-cols-1 gap-4 
            place-content-center
            w-screen
            h-screen">
            {/* <video ref={videoRef}></video> */}
            {/* <canvas ref={canvasRef} width={width} height={height}></canvas>  */}
            {/* <PoseCapture/>
            <PoseCapture/>
            <PoseCapture/> */}
            <div className="
                bg-white
                w-1/2
                justify-self-center">
                <EditorCanvas
                    width={300}
                    height={300} 
                />
            </div>
            <div className="
                bg-white
                w-1/2
                justify-self-center">
                <EditorCanvas
                    width={300}
                    height={300} 
                />
            </div>
        </div>
    )
};

export default PoseEditor;