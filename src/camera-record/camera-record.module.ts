import { Module } from '@nestjs/common';
import { CameraRecordController } from './camera-record.controller';
import { CameraRecordService } from './camera-record.service';
import { CameraRecordSchema } from './camera-record.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name:'CameraRecord',schema:CameraRecordSchema}])],
  controllers: [CameraRecordController],
  providers: [CameraRecordService],
  exports:[CameraRecordService]
})
export class CameraRecordModule {}
