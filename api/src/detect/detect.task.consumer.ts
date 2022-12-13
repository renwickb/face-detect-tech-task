import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from "@nestjs/bull";
import { Job } from "bull";
import { ConfigService } from "src/config";

import { FaceDetector } from "./detect.face.detector";
import { DetectService } from "./detect.service";
import { DetectStatus, DetectTask } from "./detect.types";

@Processor("face_detection")
export class DetectConsumer {
    constructor(
        private readonly detectService: DetectService,
        private readonly configService: ConfigService
    ) {}

    @Process()
    public async detectFaces(job: Job<DetectTask>): Promise<DetectTask> {
        const detector = new FaceDetector(job.data.filename);
        const results = await detector.detectFaces();

        job.data.faceCount = results?.faces?.length ?? 0;

        await this.processingDelay();

        return job.data;
    }

    @OnQueueActive()
    public onActive(job: Job<DetectTask>): void {
        this.detectService.updateTaskByJobId(job.id, { faceCount: 0 });
        this.updateTaskStatus(job, DetectStatus.Processing);
    }

    @OnQueueCompleted()
    public onComplete(job: Job<DetectTask>): void {
        this.updateTaskStatus(job, DetectStatus.Complete);
    }

    @OnQueueFailed()
    public onFailed(job: Job<DetectTask>, error: Error): void {
        this.updateTaskStatus(job, DetectStatus.Failed, error);
        console.error(error);
    }

    private updateTaskStatus(
        job: Job<DetectTask>,
        status: DetectStatus,
        error?: Error
    ): void {
        console.log(
            `Job ${job.id} :: ${status.toUpperCase()} :: DATA ${JSON.stringify(
                job.data
            )}`
        );

        this.detectService.updateTaskByJobId(job.id, {
            faceCount: job.data.faceCount,
            status,
            error: error?.message,
        });
    }

    private async processingDelay(): Promise<void> {
        const config = this.configService.imageConfig();
        const delay = config.processingDelaySeconds();

        await this.wait(delay * 1000);
    }

    private wait(timeout: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }
}
