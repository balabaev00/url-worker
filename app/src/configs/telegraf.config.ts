import { BotModule } from '@bot/bot.module';
import { sessionMiddleware } from '@common/middlewares/session.middleware';
import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';

export const createTelegrafConfig = (configService: ConfigService): TelegrafModuleOptions => ({
    token: configService.getOrThrow('BOT_TOKEN'),
    middlewares: [sessionMiddleware],
    include: [BotModule],
});
