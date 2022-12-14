import { httpService } from "../http";

export enum Role {
    Standard = "Standard",
    Administrator = "Administrator",
}

export interface User {
    email: string;
    role: Role;
}

export interface LoginResponse {
    user: User;
    token: string;
}

class AuthService {
    public async login(
        username: string,
        password: string
    ): Promise<LoginResponse> {
        const request = { username, password };
        const response = await httpService.post<LoginResponse>(
            "/login",
            request
        );

        return response.data;
    }

    public async signup(
        username: string,
        password: string
    ): Promise<LoginResponse> {
        const request = { username, password };
        const response = await httpService.post<LoginResponse>(
            "/signup",
            request
        );

        return response.data;
    }
}

export const authService = new AuthService();
