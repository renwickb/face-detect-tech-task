import { Inject, Injectable } from "@nestjs/common";

import { CONFIG_DATA } from "./config.constants";
import {
    AuthConfig,
    ConfigData,
    ImageConfig,
    ServiceConfig,
} from "./config.types";

@Injectable()
export class ConfigService {
    private readonly _serviceConfig: ServiceConfig;
    private readonly _authConfig: AuthConfig;
    private readonly _imageConfig: ImageConfig;

    public constructor(
        @Inject(CONFIG_DATA) private readonly config: ConfigData
    ) {
        this._serviceConfig = new ServiceConfig(this.config);
        this._authConfig = new AuthConfig(this.config);
        this._imageConfig = new ImageConfig(this.config);
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
}