import { Module, MiddlewareConsumer } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccessTokensController } from './tokens/tokens.controller'
import { TokensService } from './tokens/tokens.service'
import { DatabaseModule } from './tokens/database.module';
import { ValidationMiddleware } from './middlewares/validation.middleware'

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGODB_URI),
      DatabaseModule
  ],
  controllers: [
    AppController,
    AccessTokensController
  ],
  providers: [
    AppService,
    TokensService
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidationMiddleware).forRoutes('*');
  }
}
