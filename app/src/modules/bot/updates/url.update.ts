/* eslint-disable camelcase */
import { CreateUrlWizard } from '@bot/wizards/create-url.wizard';
import { Command, Ctx, Message, Start, Update } from 'nestjs-telegraf';
import { UrlService } from 'src/modules/url/url.service';
import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Update()
export class UrlBotUpdate {
    constructor(
        private readonly urlService: UrlService,
    ) { }

    @Start()
    async start(@Ctx() ctx: Context): Promise<void> {
        const message =
            // @todo вынести команды в enum
            'Привет! Я бот для управления ссылками. Вот что я могу сделать:' + '\n\n' +
            '/create - Начать сохранение новой ссылки' + '\n' +
            '/list - Вывести список всех сохраненных ссылок' + '\n' +
            '/get - Получить ссылку по введенному коду' + '\n' +
            '/delete - Удалить ссылку по введенному коду' + '\n' +
            '/help - Получить помощь по командам' + '\n\n' +
            'Просто выбери нужную команду из меню или введи её вручную. Давай начнем! 🚀';
        ;

        await ctx.reply(message, {
            reply_markup: {
                keyboard: [
                    // @todo command enum
                    [{ text: '/create' }, { text: '/list' }],
                    [{ text: '/get' }, { text: '/delete' }],
                ],
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        });
    }

    @Command('save')
    save(@Ctx() ctx: SceneContext): void {
        ctx.scene.enter(CreateUrlWizard.name);
    }

    @Command('list')
    async findAll(@Ctx() ctx: Context): Promise<void> {
        const urls = await this.urlService.findAll();

        if (urls.length === 0) {
            await ctx.reply('Нет сохранённых ссылок.');
            return;
        }

        let response = 'Сохранённые ссылки:\n\n';
        urls.forEach((url, index) => {
            response += `${++index}) Код: ${url.code}\nСсылка: ${url.url} \n`;
        });

        await ctx.reply(response);
    }

    @Command('get')
    async findOneByCode(
        @Ctx() ctx: Context,
        @Message() msg: { text: string },
    ): Promise<void> {
        const [, code] = msg.text
            .trim()
            .split(' ')
            .filter(Boolean);

        if (!code) {
            await ctx.reply('Введите код ссылки в формате: /get <код>');
            return;
        }

        const url = await this.urlService.findOneByCode(code);
        if (url) {
            await ctx.reply(`Ссылка: ${url.url} `);
        } else {
            await ctx.reply('Ссылка не найдена.');
        }
    }

    @Command('delete')
    async deleteOneByCode(
        @Ctx() ctx: Context,
        @Message() msg: { text: string },
    ): Promise<void> {
        const [, code] = msg.text
            .trim()
            .split(' ')
            .filter(Boolean);

        if (!code) {
            await ctx.reply('Введите код ссылки в формате: /delete <код>');
            return;
        }

        const userId = ctx.from!.id;
        const isDeleted = await this.urlService.deleteOneByCodeAndUserId(code, userId);
        if (isDeleted) {
            await ctx.reply('Ссылка удалена.');
        } else {
            await ctx.reply('Ссылка не найдена.');
        }
    }
}
