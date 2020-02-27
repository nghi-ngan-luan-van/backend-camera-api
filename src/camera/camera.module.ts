import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CameraController],
  imports: [UserModule],
})
export class CameraModule {}
