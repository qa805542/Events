import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AccessToken', schema: AccessTokenSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
