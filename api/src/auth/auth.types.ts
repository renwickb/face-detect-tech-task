import { IsEmail, IsNotEmpty } from "class-validator";

import { Role, User } from "../user";

export class LoginResponse {
    constructor(public readonly user: User, public readonly token: string) {}
}

export class SignupRequest {
    @IsEmail()
    public username: string;

    @IsNotEmpty()
    public password: string;
}

export interface AuthPayload {
    email: string;
    role: Role;
}
