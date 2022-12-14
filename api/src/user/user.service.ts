import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/config";

import { Role, User, UserServiceException } from "./user.types";

@Injectable()
export class UserService {
    private readonly _userList = new Map<string, User>();

    public constructor(private readonly configService: ConfigService) {
        this._initialiseUserList();
    }

    public getAllUsers(): Array<User> {
        return [...this._userList.values()];
    }

    public findByEmail(email: string): User | undefined {
        return this._userList.get(email.toLowerCase());
    }

    public addUser(email: string, password: string): User | undefined {
        if (this.findByEmail(email)) {
            throw new UserServiceException(
                `user with email ${email} already exists`
            );
        }

        const role = this._getRoleForEmail(email);
        const user = new User(email, password, role);

        this._userList.set(email.toLowerCase(), user);

        return user;
    }

    private _getRoleForEmail(email: string): Role {
        return this._isAdminEmail(email) ? Role.Administrator : Role.Standard;
    }

    private _isAdminEmail(email: string): boolean {
        const adminEmail = this.configService.authConfig().adminUserEmail();
        return email.toLocaleLowerCase() === adminEmail.toLowerCase();
    }

    private _initialiseUserList(): void {
        const config = this.configService.authConfig();
        const email = config.adminUserEmail();
        const password = config.adminPassword();
        this.addUser(email, password);
    }
}
