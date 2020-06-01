import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HardwareCamera } from './hardware-camera.model';
import { Model } from 'mongoose'

@Injectable()
export class HardwareCameraService {
    constructor(
        @InjectModel('HardwareCamera') private readonly hardwareCameraModel:Model<HardwareCamera>,    
         ) { }
  
         async addOne(rtspUrl:string) {
             try {
                if(!this.hardwareCameraModel.findbyID({rtspUrl})) {
                    const newCam = new this.hardwareCameraModel({
                        rtspUrl
                      })
                      const result= await newCam.save();
                      return result;
                }
                return false       
             } catch (error) {
                return false
             }        
        }
}
