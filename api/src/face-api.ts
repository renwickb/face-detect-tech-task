// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as path from "path";

import * as faceapi from "@vladmandic/face-api";
import { Canvas, Image, ImageData } from "canvas";

export const initialiseFaceApi = async () => {
    // patch nodejs environment, we need to provide an implementation of
    // HTMLCanvasElement and HTMLImageElement, additionally an implementation
    // of ImageData is required, in case you want to use the MTCNN

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    console.log(__dirname);

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(
        path.resolve(__dirname, "../weights")
    );
};
