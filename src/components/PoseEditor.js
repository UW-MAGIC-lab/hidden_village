import { useState, useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Holistic, POSE_LANDMARKS_LEFT } from '@mediapipe/holistic';
import PoseCapture from "./PoseCapture";
import { enrichLandmarks } from "./Pose/landmark_utilities";
import EditorCanvas from "./EditorCanvas";

const PoseEditor = () => {
    const [poseData, setPoseData] = useState(null);
    const videoElement = document.getElementsByClassName("input-video")[0];
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        console.log(poseData);
    },[poseData]);

    // when PoseEditor get mounted, do it once:
    useEffect(() => {
        const holistic = new Holistic({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }}); // instantiate mediapipe holistic obj
        holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            refineFaceLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        // set up camera
        let camera = new Camera(videoElement, {
            onFrame: async () => {
                await holistic.send({image: videoElement}); // wait for its completion than push to callback queue
            }, // listening to the Frame event
            // async: to handle long standing running func
            // await: a way to yield from the async func
            // js event loop
            width: width,
            height: height,
            facingMode: "environment",
        });
        camera.start();

        const updatePoseResults = (newResults) => {
            setPoseData(enrichLandmarks(newResults));
        };
        holistic.onResults(updatePoseResults); //eventListener (eventHandler function)
    },[])

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
                    poseData={poseData}
                />
            </div>
            <div className="
                bg-white
                w-1/2
                justify-self-center">
                <EditorCanvas
                    width={300}
                    height={300} 
                    poseData={poseData}
                />
            </div>
        </div>
    )
};

export default PoseEditor;