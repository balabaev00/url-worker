import { Module } from '@nestjs/common';

import { UrlModule } from '../url/url.module';

import { InitialUpdate } from './updates/initial.update';
import { UrlBotUpdate } from './updates/url.update';
import { CreateUrlWizard } from './wizards/create-url.wizard';

@Module({
    imports: [UrlModule],
    providers: [
        InitialUpdate,
        UrlBotUpdate,
        CreateUrlWizard,
    ],
    exports: [],
})
export class BotModule { }
