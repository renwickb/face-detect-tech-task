import { Inject, Injectable } from "@nestjs/common";

import { CONFIG_DATA } from "./config.constants";
import { ConfigData, ServiceConfig } from "./config.types";

@Injectable()
export class ConfigService {
    private readonly _serviceConfig: ServiceConfig;

    public constructor(
        @Inject(CONFIG_DATA) private readonly config: ConfigData
    ) {
        this._serviceConfig = new ServiceConfig(this.config);
    }

    public serviceConfig(): ServiceConfig {
        return this._serviceConfig;
    }
}
