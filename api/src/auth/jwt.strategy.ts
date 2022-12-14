import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from "../config";
import { User } from "../user";
import { AuthPayload } from "./auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.authConfig().jwtSecret(),
            algorithms: [configService.authConfig().jwtAlgorithm()],
        });
    }

    public validate(payload: AuthPayload): User {
        return new User(payload.email, undefined, payload.role);
    }
}
