import { IsNotEmpty } from "class-validator";
import * as uuid from "uuid";

export enum DetectStatus {
    Enqueued = "Enqueued",
    Processing = "Processing",
    Complete = "Complete",
    Failed = "Failed",
}

export class DetectRequest {
    @IsNotEmpty()
    imageAnnotation: string;
}

export class DetectResponse {
    constructor(
        filename?: string,
        imageAnnotation?: string,
        trackingId?: string,
        status?: DetectStatus
    ) {
        this.filename = filename;
        this.imageAnnotation = imageAnnotation;
        this.trackingId = trackingId ?? uuid.v4();
        this.status = status ?? DetectStatus.Enqueued;
    }

    trackingId: string;
    status: DetectStatus;
    filename: string;
    imageAnnotation: string;
}
