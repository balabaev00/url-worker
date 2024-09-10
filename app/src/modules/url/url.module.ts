import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlModelDefinition } from './url.entity';
import { UrlService } from './url.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            UrlModelDefinition,
        ]),
    ],
    providers: [UrlService],
    exports: [UrlService],
})
export class UrlModule { }
