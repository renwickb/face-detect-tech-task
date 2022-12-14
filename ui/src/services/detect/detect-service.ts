import { httpService } from "../http";

export enum DetectStatus {
    Enqueued = "Enqueued",
    Processing = "Processing",
    Complete = "Complete",
    Failed = "Failed",
}

export interface DetectTask {
    userEmail: string;
    trackingId: string;
    status: DetectStatus;
    filename: string;
    imageAnnotation: string;
    createdDate: Date;
    faceCount?: number;
}

class DetectService {
    public async getAllTasks(): Promise<Array<DetectTask>> {
        const response = await httpService.get<Array<DetectTask>>("/detect");
        return response.data;
    }

    public async getTaskStatus(trackingId: string): Promise<DetectTask> {
        const url = `/detect/${encodeURIComponent(trackingId)}`;
        const response = await httpService.get<DetectTask>(url);
        return response.data;
    }

    public async createTask(
        image: File,
        imageAnnotation: string
    ): Promise<DetectTask> {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("imageAnnotation", imageAnnotation);

        const headers: Record<string, string> = {
            "content-type": "multipart/form-data",
        };

        const response = await httpService.post<DetectTask>(
            "/detect",
            formData,
            headers
        );

        return response.data;
    }
}

export const detectService = new DetectService();
