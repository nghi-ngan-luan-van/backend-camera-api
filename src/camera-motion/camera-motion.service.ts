import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CameraMotion } from './camera-motion.model';
import {Model} from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CameraMotionService {
    private  camMotions=[]
    constructor(
      @InjectModel('CameraMotion') private readonly cameraMotionModel:Model<CameraMotion>,    
       ) { }

       async addOne(userID: string,cameraUrl:string,filePath:string, timeStart:string, timeEnd:string,cdnUrl:string) {
        console.log(userID)
        const newCameraMotion= new this.cameraMotionModel({
          cameraUrl,
          filePath,
          timeStart,
          timeEnd,
          cdnUrl,
          user:userID
        })
        const result= await newCameraMotion.save();
        return result;
      }


}
