import { Module, forwardRef } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CameraModule } from 'src/camera/camera.module';
import { CameraMotionModule } from 'src/camera-motion/camera-motion.module';

@Module({
  imports:[forwardRef(() =>CameraModule),forwardRef(() =>CameraMotionModule)],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService]
})
export class TaskModule {}
