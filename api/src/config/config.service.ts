import { Inject, Injectable } from "@nestjs/common";

import { CONFIG_DATA } from "./config.constants";
import {
    AuthConfig,
    ConfigData,
    ImageConfig,
    QueueConfig,
    ServiceConfig,
} from "./config.types";

@Injectable()
export class ConfigService {
    private readonly _serviceConfig: ServiceConfig;
    private readonly _authConfig: AuthConfig;
    private readonly _imageConfig: ImageConfig;
    private readonly _queueConfig: QueueConfig;

    public constructor(
        @Inject(CONFIG_DATA) private readonly config: ConfigData
    ) {
        this._serviceConfig = new ServiceConfig(this.config);
        this._authConfig = new AuthConfig(this.config);
        this._imageConfig = new ImageConfig(this.config);
        this._queueConfig = new QueueConfig(this.config);
    }

    public serviceConfig(): ServiceConfig {
        return this._serviceConfig;
    }

    public authConfig(): AuthConfig {
        return this._authConfig;
    }

    public imageConfig(): ImageConfig {
        return this._imageConfig;
    }

    public queueConfig(): QueueConfig {
        return this._queueConfig;
    }
}
