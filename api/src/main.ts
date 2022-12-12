import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ConfigService } from "./config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const serviceConfig = configService.serviceConfig();

    const port = serviceConfig.port();
    const corsOrigins = serviceConfig.corsAllowedOrigins();

    app.enableCors({
        origin: corsOrigins,
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port);
}
bootstrap();
