import { Module, forwardRef } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CameraModule } from 'src/camera/camera.module';

@Module({
  imports:[forwardRef(() =>CameraModule)],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService]
})
export class TaskModule {}
