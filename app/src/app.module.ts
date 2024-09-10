import { BotModule } from '@bot/bot.module';
import { HealthModule } from '@health/health.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger, LoggerModule } from 'nestjs-pino';
import { TelegrafModule } from 'nestjs-telegraf';

import { createLoggerConfig, createMongoConfig, createTelegrafConfig } from './configs';

@Module({
    imports: [
        ConfigModule.forRoot(
            {
                ignoreEnvFile: process.env.STAGE !== 'local',
                expandVariables: true,
                isGlobal: true,
            }
        ),
        MongooseModule.forRootAsync({
            useFactory: createMongoConfig,
            inject: [ConfigService, Logger],
        }),
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: createLoggerConfig,
        }),
        TelegrafModule.forRootAsync({
            inject: [ConfigService],
            useFactory: createTelegrafConfig,
        }),
        HealthModule,
        BotModule,
    ],
})
export class AppModule { }
