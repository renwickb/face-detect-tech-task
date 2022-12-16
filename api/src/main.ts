import { ValidationPipe, HttpStatus } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ConfigService } from "./config";
import { initialiseFaceApi } from "./face-api";

async function bootstrap() {
    await initialiseFaceApi();

    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const serviceConfig = configService.serviceConfig();
    const queueConfig = configService.queueConfig();

    const port = serviceConfig.port();
    const corsOrigins = serviceConfig.corsAllowedOrigins();

    app.enableCors({
        origin: corsOrigins.map((origin) => new RegExp(origin)),
        credentials: true,
        optionsSuccessStatus: HttpStatus.OK,
        allowedHeaders: "*",
    });

    app.useGlobalPipes(new ValidationPipe());

    console.log(`🚀 Server started and listening on port ${port}`);
    console.log(
        `👉 Using Redis queues at ${queueConfig.redisHost()}:${queueConfig.redisPort()}`
    );

    await app.listen(port);
}
bootstrap();
