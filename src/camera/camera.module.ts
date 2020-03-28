import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { UserModule } from 'src/user/user.module';
import { CameraService } from './camera.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CameraSchema } from './camera.model';

@Module({
  imports:[UserModule,MongooseModule.forFeature([{name:'Camera',schema:CameraSchema}])],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
