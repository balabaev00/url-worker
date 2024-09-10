import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotCommand } from 'telegraf/typings/core/types/typegram';

export class InitialUpdate {
    constructor(
        @InjectBot() private bot: Telegraf<Context>,
    ) {
        this.initializeCommand();
    }

    async initializeCommand(): Promise<void> {
        const BOT_COMMANDS: BotCommand[] = [
            { command: 'start', description: 'Начать работу с ботом' },
            { command: 'create', description: 'Начать сохранение ссылки' },
            { command: 'delete', description: 'Удаление ссылки по введенному коду' },
            { command: 'get', description: 'Получение ссылки по введенному коду' },
            { command: 'list', description: 'Вывести список сохраненных ссылок' },
        ];

        await this.bot.telegram.setMyCommands(BOT_COMMANDS);
    }
}
