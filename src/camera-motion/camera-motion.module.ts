import { Module, forwardRef } from '@nestjs/common';
import { CameraMotionController } from './camera-motion.controller';
import { CameraMotionService } from './camera-motion.service';
import { CameraModule } from 'src/camera/camera.module';
import { CameraMotionSchema } from './camera-motion.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[forwardRef(() =>CameraModule),MongooseModule.forFeature([{name:'CameraMotion',schema:CameraMotionSchema}])],
  controllers: [CameraMotionController],
  providers: [CameraMotionService],
  exports:[CameraMotionService]
})
export class CameraMotionModule {}
