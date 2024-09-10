import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

import { UrlDocument, UrlEntity } from './url.entity';

@Injectable()
export class UrlService {
    constructor(
        @InjectModel(UrlEntity.name)
        private readonly urlModel: Model<UrlEntity>
    ) { }

    create(url: string, name: string, userTelegramId: number): Promise<UrlDocument> {
        return this.urlModel.create({
            code: v4(),
            name,
            url,
            userTelegramId,
        });
    }

    findOneByCode(code: string): Promise<UrlDocument | null> {
        return this.urlModel.findOne({ code }).exec();
    }

    async deleteOneByCode(code: string): Promise<boolean> {
        const result = await this.urlModel.deleteOne({ code }).exec();
        return Boolean(result.deletedCount);
    }

    findAll(): Promise<UrlDocument[]> {
        return this.urlModel.find().exec();
    }
}
