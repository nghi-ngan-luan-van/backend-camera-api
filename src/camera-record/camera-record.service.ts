import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CameraRecord } from './camera-record.model';
import {Model} from 'mongoose'

@Injectable()
export class CameraRecordService {
    constructor(
    @InjectModel('CameraRecord') private readonly cameraRecordModel:Model<CameraRecord>,    
       ) { }

       async addOne(userID: string,cameraID:string, timeStart:string,timeEnd:string,cdnUrl:string) {
        console.log(userID)
        const newCameraRecord= new this.cameraRecordModel({
          cameraID,
          timeStart,
          timeEnd,
          cdnUrl,
          user:userID
        })
        const result= await newCameraRecord.save();
        return result;
      }

      async getMotionByUser(userID: string,cameraID:string) {
       try {
         const data= await this.cameraRecordModel.find({user:userID,cameraID})
         console.log(data)
         return data
       } catch (error) {
         return false
       }
      }
}
