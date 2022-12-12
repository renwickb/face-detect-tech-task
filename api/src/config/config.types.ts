export type ConfigData = Record<string, string | undefined>;

abstract class BaseConfig {
    public constructor(private readonly config: ConfigData) {}

    protected get<T = string>(key: string, defaultValue?: T): T | undefined {
        const value = this.config[key];
        if (typeof value === "undefined") {
            return defaultValue;
        }

        return value as T;
    }
}

export class ServiceConfig extends BaseConfig {
    public constructor(config: ConfigData) {
        super(config);
    }

    public port(): number {
        return this.get<number>("PORT", 8001);
    }

    public corsAllowedOrigins(): Array<string> {
        return this.get("CORS_ALLOWED_ORIGINS", "*").split(",").filter(Boolean);
    }
}

export class AuthConfig extends BaseConfig {
    public constructor(config: ConfigData) {
        super(config);
    }

    public adminUserEmail(): string {
        return this.get("ADMIN_USER_EMAIL_ADDRESS", "admin@exaple.com");
    }

    public adminPassword(): string {
        return this.get("ADMIN_USER_PASSWORD");
    }

    public defaultPassword(): string {
        return this.get("DEFAULT_USER_PASSWORD");
    }
}
