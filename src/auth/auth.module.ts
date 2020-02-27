import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from './auth.controller';
import { UserModule } from "src/user/user.module";

@Module({
  providers: [AuthService],
  imports: [UserModule],
  controllers: [AuthController]
})
export class AuthModule {}
