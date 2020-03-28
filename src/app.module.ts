import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CameraModule } from './camera/camera.module';
import {MongooseModule} from '@nestjs/mongoose'

@Module({
  imports: [UserModule, AuthModule, CameraModule,
    MongooseModule.forRoot('mongodb+srv://phuongnghi:iqFKSYmeh4tgmnC4@cluster0-kfdw8.mongodb.net/camera-db?retryWrites=true&w=majority')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
