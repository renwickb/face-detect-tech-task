import { Algorithm } from "jsonwebtoken";
import * as uuid from "uuid";

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

const DEFAULT_JWT_SECRET = uuid.v4();

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

    public jwtTimeToLiveMinutes(): number {
        return this.get("JWT_TTL_MINUTES", 30);
    }

    public jwtAlgorithm(): Algorithm {
        return this.get<Algorithm>("JWT_ALGORITHM", "HS256");
    }

    public jwtSecret(): string {
        return this.get("JWT_SECRET", DEFAULT_JWT_SECRET);
    }
}

export class ImageConfig extends BaseConfig {
    constructor(config: ConfigData) {
        super(config);
    }

    public maxFileSizeMb(): number {
        return this.get("MAX_FILE_SIZE_MB", 100);
    }

    public acceptedFileMimeTypes(): Array<string> {
        return this.get("ACCEPTED_FILE_MIME_TYPES", "image/jpeg")
            .split(",")
            .filter(Boolean);
    }

    public processingDelaySeconds(): number {
        return this.get("PROCESSING_DELAY_SECONDS", 5);
    }
}

export class QueueConfig extends BaseConfig {
    constructor(config: ConfigData) {
        super(config);
    }

    public redisHost(): string {
        return this.get("REDIS_HOST", "localhost");
    }

    public redisPort(): number {
        return this.get("REDIS_PORT", 6379);
    }
}
