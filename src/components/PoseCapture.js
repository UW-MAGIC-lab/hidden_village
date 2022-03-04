import { useEffect, useState } from "react";
import EditorCanvas from "./EditorCanvas";

const PoseCapture = () => {
  return (
    <div
      className="
            bg-white
            w-1/2
            justify-self-center"
    >
      <EditorCanvas width={300} height={300} />
    </div>
  );
};

export default PoseCapture;
