import { Module } from '@nestjs/common';
import { CameraMotionController } from './camera-motion.controller';
import { CameraMotionService } from './camera-motion.service';
import { CameraModule } from 'src/camera/camera.module';

@Module({
  imports:[CameraModule],
  controllers: [CameraMotionController],
  providers: [CameraMotionService],
  exports:[CameraMotionService]
})
export class CameraMotionModule {}
