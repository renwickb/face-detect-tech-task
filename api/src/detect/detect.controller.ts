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
import { Role, User, UserService } from "src/user";

import { JwtAuthGuard, Roles, RolesGuard } from "../auth";
import { DetectService } from "./detect.service";
import {
    AdminSummary,
    AdminSummaryItem,
    DetectRequest,
    DetectResponse,
    DetectStatus,
} from "./detect.types";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
    path: "detect",
})
export class DetectController {
    constructor(
        private readonly detectService: DetectService,
        private readonly userService: UserService
    ) {}

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

    @Get("/track/:trackingId")
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

    @Get("/admin-summary")
    @Roles(Role.Administrator)
    public getAdminSummary(): AdminSummary {
        const users = this.userService.getAllUsers();

        return {
            summary: users.map((user): AdminSummaryItem => {
                const tasks = this.detectService.getAllTasksForUser(user);

                return {
                    userEmail: user.email,
                    imageCount: tasks.length,
                    faceCount: tasks
                        .filter((task) => task.status === DetectStatus.Complete)
                        .reduce(
                            (faceCount, task) =>
                                faceCount + task.faceCount ?? 0,
                            0
                        ),
                };
            }),
        };
    }
}
