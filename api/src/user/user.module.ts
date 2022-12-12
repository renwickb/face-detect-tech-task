import { Module } from "@nestjs/common";

import { UserService } from "./user.service";

@Module({
    providers: [UserService],
    exports: [],
})
export class UserModule {}
