import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "src/config";

import { User, UserService } from "../user";
import { AuthPayload, LoginResponse, SignupRequest } from "./auth.types";

@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    public validateUser(email: string, password: string): User | undefined {
        const user = this.userService.findByEmail(email);
        if (user?.password === password) {
            return user;
        }
    }

    public login(user: User): LoginResponse {
        const config = this.configService.authConfig();

        const signPayload: AuthPayload = {
            email: user.email,
            role: user.role,
        };

        const signOptions: JwtSignOptions = {
            algorithm: config.jwtAlgorithm(),
            expiresIn: config.jwtTimeToLiveMinutes() * 60,
            secret: config.jwtSecret(),
        };

        const token = this.jwtService.sign(signPayload, signOptions);

        return new LoginResponse(user, token);
    }

    public signup(request: SignupRequest): User | undefined {
        return this.userService.addUser(request.username, request.password);
    }
}
