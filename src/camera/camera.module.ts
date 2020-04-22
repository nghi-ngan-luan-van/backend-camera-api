import { Module, forwardRef } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { UserModule } from 'src/user/user.module';
import { CameraService } from './camera.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CameraSchema } from './camera.model';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports:[forwardRef(() =>TaskModule),UserModule,MongooseModule.forFeature([{name:'Camera',schema:CameraSchema}])],
  controllers: [CameraController],
  providers: [CameraService],
  exports:[CameraService]
})
export class CameraModule {}
