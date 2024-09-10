import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from 'nestjs-pino';

export const createMongoConfig = (
    configService: ConfigService,
    logger: Logger,
): MongooseModuleOptions => {
    const host = configService.getOrThrow('MONGODB_HOST');
    const database = configService.getOrThrow('MONGODB_DATABASE');
    const replicaSet = configService.get('MONGODB_REPLICA_SET');
    const uri = `mongodb://${host}/${database}${replicaSet && `?replicaSet=${replicaSet}`}`;

    // Если указать ошибочные данные для коннекта, например при локальной разработке,
    // То приложение выдаст "Found 0 errors. Watching for file changes." и всё. Не будет понятно, где ошибся.
    logger.log(`Created Mongo config for ${uri}`);

    return {
        uri,
        user: configService.getOrThrow('MONGODB_USER'),
        pass: configService.getOrThrow('MONGODB_PASSWORD'),
        autoIndex: false,
    };
};
