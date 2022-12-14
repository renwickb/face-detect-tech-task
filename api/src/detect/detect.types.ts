import { JobId } from "bull";
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
        userEmail?: string,
        filename?: string,
        imageAnnotation?: string,
        trackingId?: string,
        status?: DetectStatus,
        createdDate?: Date,
        faceCount?: number
    ) {
        this.userEmail = userEmail;
        this.filename = filename;
        this.imageAnnotation = imageAnnotation;
        this.trackingId = trackingId ?? uuid.v4();
        this.status = status ?? DetectStatus.Enqueued;
        this.createdDate = createdDate;
        this.faceCount = faceCount;
    }

    public static fromTask(task: DetectTask): DetectResponse {
        return new DetectResponse(
            task.userEmail,
            task.originalFilename,
            task.imageAnnotation,
            task.trackingId,
            task.status,
            task.createdDate,
            task.faceCount
        );
    }

    userEmail: string;
    trackingId: string;
    status: DetectStatus;
    filename: string;
    imageAnnotation: string;
    createdDate: Date;
    faceCount?: number;
}

export interface DetectTask {
    userEmail: string;
    filename: string;
    originalFilename: string;
    imageAnnotation: string;
    trackingId: string;
    createdDate: Date;
    status: DetectStatus;
    statusDate: Date;
    jobId?: JobId;
    faceCount?: number;
    error?: string;
}

export interface AdminSummaryItem {
    userEmail: string;
    imageCount: number;
    faceCount: number;
}

export interface AdminSummary {
    summary: Array<AdminSummaryItem>;
}
