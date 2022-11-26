import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GuardAuth } from './guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from "./facebook.strategy";

@Module({
  imports: [ConfigModule.forRoot({
    expandVariables: true,
  }), TypeOrmModule.forFeature([UserEntity]),ConfigModule],
  controllers: [UserController],
  providers: [UserService, GuardAuth, ConfigService,GoogleStrategy,FacebookStrategy],
  exports: [UserService],
})
export class UserModule {}
