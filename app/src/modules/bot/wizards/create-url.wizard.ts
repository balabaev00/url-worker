import { Injectable } from '@nestjs/common';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { UrlService } from 'src/modules/url/url.service';
import { WizardContext } from 'telegraf/typings/scenes';
import * as validUrl from 'valid-url';

@Injectable()
@Wizard(CreateUrlWizard.name)
export class CreateUrlWizard {
    constructor(private readonly urlService: UrlService) { }

    @WizardStep(1)
    async askForUrl(@Ctx() ctx: WizardContext): Promise<void> {
        await ctx.reply('Пожалуйста, введите ссылку:');
        ctx.wizard.next();
    }

    @WizardStep(2)
    async askForName(
        @Ctx() ctx: WizardContext,
        @Message() msg: { text: string }
    ): Promise<void> {
        if (!validUrl.isUri(msg.text)) {
            await ctx.reply('Это невалидная ссылка. Пожалуйста, введите правильный URL.');
            ctx.wizard.selectStep(1);
            return;
        }

        // Сохраняем ссылку в сессии
        // @ts-expect-error mock state
        ctx.wizard.state['url'] = msg.text;
        await ctx.reply('Введите название для ссылки:');
        ctx.wizard.next();
    }

    @WizardStep(3)
    async saveLink(
        @Ctx() ctx: WizardContext,
        @Message() msg: { text: string },
    ): Promise<void> {
        const userId = ctx.from!.id;

        try {
            // @ts-expect-error mock state
            const url = ctx.wizard.state['url'];
            const savedLink = await this.urlService.create(
                url,
                msg.text,
                userId
            );
            await ctx.reply(`Ссылка сохранена! Ваш уникальный код: ${savedLink.code}`);
        } catch (error) {
            await ctx.reply('Произошла ошибка при сохранении ссылки.');
        }

        return ctx.scene.leave();
    }
}
