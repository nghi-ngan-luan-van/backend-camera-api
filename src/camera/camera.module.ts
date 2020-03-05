import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { UserModule } from 'src/user/user.module';
import { CameraService } from './camera.service';

@Module({
  controllers: [CameraController],
  imports: [UserModule],
  providers: [CameraService],
})
export class CameraModule {}
