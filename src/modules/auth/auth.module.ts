import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { LocalStrategy } from './local-strategy';
import { UserModule } from "../users/user.module";
import { UserSchema } from "../../models/users.model";
import { UsersService } from "../users/users.service";
import { JwtStrategy } from "./jwt.strategy";
import { MailerModule } from "@nestjs-modules/mailer";


@Module({
  imports: [MailerModule.forRoot({
    transport: {
      host: '0.0.0.0',
      port: 1025
    },
    defaults: {
      from: 'from@example.com'
    }
  })
    , UserModule, PassportModule, JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1y' },
    }), MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [UsersService]
})
export class AuthModule { }