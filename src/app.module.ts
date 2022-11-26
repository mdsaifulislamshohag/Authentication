/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [ConfigModule.forRoot({
    expandVariables: true,
  }), TypeOrmModule.forRoot(),UserModule,ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
