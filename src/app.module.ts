import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CameraModule } from './camera/camera.module';

@Module({
  imports: [UserModule, AuthModule, CameraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
