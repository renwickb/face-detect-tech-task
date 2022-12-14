import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigService } from "src/config";
import { UserModule } from "src/user";

import { DetectController } from "./detect.controller";
import { DetectService } from "./detect.service";
import { DetectConsumer } from "./detect.task.consumer";

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
        BullModule.forRootAsync({
            useFactory(configService: ConfigService) {
                const config = configService.queueConfig();

                return {
                    redis: {
                        host: config.redisHost(),
                        port: config.redisPort(),
                    },
                };
            },
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: "face_detection",
        }),
        UserModule,
    ],
    controllers: [DetectController],
    providers: [DetectService, DetectConsumer],
})
export class DetectModule {}
