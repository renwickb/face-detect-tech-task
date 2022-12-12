import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { JwtAuthGuard } from "../auth";
import { DetectRequest, DetectResponse } from "./detect.types";

@UseGuards(JwtAuthGuard)
@Controller({
    path: "detect",
})
export class DetectController {
    @UseInterceptors(FileInterceptor("file"))
    @Post()
    public detectFaces(
        @Body() request: DetectRequest,
        @UploadedFile() file: Express.Multer.File
    ): DetectResponse {
        console.log(file);
        return new DetectResponse(file.originalname, request.imageAnnotation);
    }
}
