export enum Role {
    Standard = "Standard",
    Administrator = "Administrator",
}

export class User {
    public constructor(email?: string, password?: string, role?: Role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public email: string;
    public password: string;
    public role: Role;
}

export class UserServiceException extends Error {
    public constructor(message?: string) {
        super(message);
    }
}
