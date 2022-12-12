import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigService } from "src/config";

import { DetectController } from "./detect.controller";

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory(configService: ConfigService) {
                const config = configService.imageConfig();
                const acceptedMimeTypes = config.acceptedFileMimeTypes();

                return {
                    dest: "./tmp",
                    limits: {
                        fileSize: config.maxFileSizeMb() * 1024 * 1024,
                    },
                    fileFilter(_request, file, callback) {
                        const accepted = acceptedMimeTypes.some(
                            (mimeType) =>
                                mimeType.toLowerCase() ===
                                file.mimetype.toLowerCase()
                        );
                        callback(null, accepted);
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [DetectController],
})
export class DetectModule {}
