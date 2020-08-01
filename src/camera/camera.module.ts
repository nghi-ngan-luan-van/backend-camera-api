import { Module, forwardRef } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { UserModule } from 'src/user/user.module';
import { CameraService } from './camera.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CameraSchema } from './camera.model';
import { TaskModule } from 'src/task/task.module';
import { CameraMotionModule } from 'src/camera-motion/camera-motion.module';
import { CameraRecordModule } from 'src/camera-record/camera-record.module';
import { HardwareCameraModule } from 'src/hardware-camera/hardware-camera.module';

@Module({
  imports:[forwardRef(() =>TaskModule),CameraRecordModule,forwardRef(() =>HardwareCameraModule),UserModule,forwardRef(() =>CameraMotionModule),MongooseModule.forFeature([{name:'Camera',schema:CameraSchema}])],
  controllers: [CameraController],
  providers: [CameraService],
  exports:[CameraService]
})
export class CameraModule {}
