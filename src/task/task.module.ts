import { Module, forwardRef } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CameraModule } from 'src/camera/camera.module';
import { CameraMotionModule } from 'src/camera-motion/camera-motion.module';
import { TaskSchema } from './task.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[forwardRef(() =>CameraModule),forwardRef(() =>CameraMotionModule),MongooseModule.forFeature([{name:'Task',schema:TaskSchema}])],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService]
})
export class TaskModule {}
