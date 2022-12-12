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
