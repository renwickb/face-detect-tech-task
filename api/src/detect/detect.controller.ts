import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "src/user";

import { JwtAuthGuard } from "../auth";
import { DetectService } from "./detect.service";
import { DetectRequest, DetectResponse } from "./detect.types";

@UseGuards(JwtAuthGuard)
@Controller({
    path: "detect",
})
export class DetectController {
    constructor(private readonly detectService: DetectService) {}

    @UseInterceptors(FileInterceptor("file"))
    @Post()
    public async detectFaces(
        @Request() request: Express.Request,
        @Body() detectRequest: DetectRequest,
        @UploadedFile() file: Express.Multer.File
    ): Promise<DetectResponse> {
        const user = request.user as User;
        const { path, originalname } = file;
        const { imageAnnotation } = detectRequest;

        const task = await this.detectService.startDetection(
            user,
            path,
            originalname,
            imageAnnotation
        );

        return DetectResponse.fromTask(task);
    }

    @Get("/:trackingId")
    public getTaskStatus(
        @Param("trackingId") trackingId: string
    ): DetectResponse {
        const task = this.detectService.getTaskById(trackingId);
        if (!task) {
            throw new NotFoundException();
        }

        return DetectResponse.fromTask(task);
    }

    @Get()
    public getAllTasks(
        @Request() request: Express.Request
    ): Array<DetectResponse> {
        const user = request.user as User;
        const tasks = this.detectService.getAllTasksForUser(user);

        return tasks.map(DetectResponse.fromTask);
    }
}
