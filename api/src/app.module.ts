import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config";
import { DetectModule } from "./detect";
import { UserModule } from "./user";

@Module({
    imports: [
        ConfigModule.forRoot({
            global: true,
        }),
        UserModule,
        AuthModule,
        DetectModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
