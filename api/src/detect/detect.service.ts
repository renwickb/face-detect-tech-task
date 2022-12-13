import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { JobId, Queue } from "bull";
import * as uuid from "uuid";

import { User } from "../user";
import { DetectTask, DetectStatus } from "./detect.types";

@Injectable()
export class DetectService {
    private readonly detectTasks = new Map<JobId, DetectTask>();

    constructor(
        @InjectQueue("face_detection") private readonly faceDetectQueue: Queue
    ) {}

    public async startDetection(
        user: User,
        filename: string,
        originalFilename: string,
        imageAnnotation: string
    ): Promise<DetectTask> {
        const task: DetectTask = {
            userEmail: user.email.toLowerCase(),
            filename,
            originalFilename,
            imageAnnotation,
            trackingId: uuid.v4(),
            createdDate: new Date(),
            status: DetectStatus.Enqueued,
            statusDate: new Date(),
        };

        const job = await this.faceDetectQueue.add(task);

        task.jobId = job.id;
        this.detectTasks.set(job.id, task);

        return task;
    }

    public getAllTasksForUser(user: User): Array<DetectTask> {
        return [...this.detectTasks.values()].filter(
            (task) => task.userEmail === user.email.toLowerCase()
        );
    }

    public getTaskById(trackingId: string): DetectTask | undefined {
        for (const task of this.detectTasks.values()) {
            if (task.trackingId === trackingId) {
                return task;
            }
        }
    }

    public updateTaskByJobId(jobId: JobId, task: Partial<DetectTask>): void {
        let detectTask = this.detectTasks.get(jobId);
        if (detectTask) {
            if (task.status !== detectTask.status) {
                task.statusDate = new Date();
            }

            detectTask = {
                ...detectTask,
                ...task,
            };
            this.detectTasks.set(jobId, detectTask);
        }
    }
}
