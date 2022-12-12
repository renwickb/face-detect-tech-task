import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { AppService } from "./app.service";
import {
    AuthService,
    JwtAuthGuard,
    LocalAuthGuard,
    LoginResponse,
    SignupRequest,
} from "./auth";
import { User, UserServiceException } from "./user";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly authService: AuthService
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    public login(@Request() request: Express.Request): LoginResponse {
        return this.authService.login(request.user as User);
    }

    @Post("signup")
    public signup(@Body() signupRequest: SignupRequest): LoginResponse {
        try {
            const user = this.authService.signup(signupRequest);
            return this.authService.login(user);
        } catch (ex) {
            if (ex instanceof UserServiceException) {
                throw new BadRequestException(ex.message);
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    public profile(@Request() request: Express.Request): User {
        return request.user as User;
    }
}
