import { ValidationPipe, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    const configService = app.get(ConfigService);
    const logger = app.get(Logger);

    app.enableCors();
    app.enableShutdownHooks();

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
    });

    const applicationPort = configService.get('CONTAINER_PORT') || 3000;
    await app.listen(applicationPort);

    logger.log(`Application running on port ${applicationPort}`);
}

bootstrap();
