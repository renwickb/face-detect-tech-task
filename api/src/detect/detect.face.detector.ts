import * as faceapi from "@vladmandic/face-api";
import { Canvas, createCanvas, loadImage } from "canvas";

export class FaceDetector {
    constructor(private readonly imageFilename: string) {}

    public async detectFaces(): Promise<FaceDetectionResults> {
        const canvas = await this.loadImageData();

        const detections = await faceapi.detectAllFaces(canvas as any);

        return {
            faces: detections.map(
                ({ box }): FaceDetectionResult => ({
                    rect: {
                        x: box.left,
                        y: box.top,
                        height: box.height,
                        width: box.width,
                    },
                })
            ),
        };
    }

    private async loadImageData(): Promise<Canvas> {
        const image = await loadImage(this.imageFilename);

        const canvas = createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0);

        return canvas;
    }
}

export interface FaceRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface FaceDetectionResult {
    rect: FaceRectangle;
}

export interface FaceDetectionResults {
    faces: Array<FaceDetectionResult>;
}
