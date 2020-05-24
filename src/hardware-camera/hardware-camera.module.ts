import { Module } from '@nestjs/common';
import { HardwareCameraController } from './hardware-camera.controller';
import { HardwareCameraService } from './hardware-camera.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HardwareCameraSchema } from './hardware-camera.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule,MongooseModule.forFeature([{name:'HardwareCamera',schema:HardwareCameraSchema}])],
  controllers: [HardwareCameraController],
  providers: [HardwareCameraService],
  exports:[HardwareCameraService]
})
export class HardwareCameraModule {}
