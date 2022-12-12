import * as fs from "fs";
import * as path from "path";

import { DynamicModule, Module } from "@nestjs/common";
import * as dotenv from "dotenv";

import { CONFIG_DATA } from "./config.constants";
import { ConfigService } from "./config.service";
import { ConfigData } from "./config.types";

export interface ConfigModuleOptions {
    global?: boolean;
}

@Module({})
export class ConfigModule {
    public static forRoot({ global }: ConfigModuleOptions): DynamicModule {
        const config = ConfigModule.loadConfig();

        return {
            module: ConfigModule,
            providers: [
                {
                    provide: CONFIG_DATA,
                    useValue: config,
                },
                ConfigService,
            ],
            exports: [ConfigService],
            global,
        };
    }

    private static loadConfig(): ConfigData {
        const configFilePath = path.resolve(__dirname, "../../", ".env");
        return dotenv.parse(fs.readFileSync(configFilePath));
    }
}
