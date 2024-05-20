import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'AccessTokens', timestamps: true })
export class AccessToken extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    role: string;

    @Prop({ default: 0 })
    rateLimiter: number;

    @Prop({ required: true })
    expiry: Date;

    @Prop({ default: false })
    isDeleted: boolean

    @Prop({ default: Date.now })
    issuedAt: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
