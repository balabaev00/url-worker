import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'urls', autoIndex: true, timestamps: true })
export class UrlEntity {
    @Prop({ required: true })
    url!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true })
    code!: string;

    @Prop({ required: true })
    userTelegramId!: string;
}

export type UrlDocument = HydratedDocument<UrlEntity>;

export const UrlSchema = SchemaFactory.createForClass(UrlEntity);

export const UrlModelDefinition = {
    name: UrlEntity.name,
    schema: UrlSchema,
};
