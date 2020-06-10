import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CameraModule } from './camera/camera.module';
import {MongooseModule} from '@nestjs/mongoose'
import { TaskModule } from './task/task.module';
import { CameraMotionModule } from './camera-motion/camera-motion.module';
import { HardwareCameraModule } from './hardware-camera/hardware-camera.module';
import { CameraRecordModule } from './camera-record/camera-record.module';
@Module({
  imports: [UserModule, AuthModule, CameraModule,
    MongooseModule.forRoot(process.env.MONGOLAB_URI ||'mongodb+srv://phuongnghi:r23AQLOpXter29tn@cluster0-kfdw8.mongodb.net/camera-db?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}),
    TaskModule,
    CameraMotionModule,
    HardwareCameraModule,
    CameraRecordModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
