import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CameraService } from 'src/camera/camera.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { Task } from './task.model';

@Injectable()
export class TaskService {
    private  tasks=[]
    constructor(
      @InjectModel('Task') private readonly taskModel:Model<Task>,    
      @Inject(forwardRef(() => CameraService))
      private readonly cameraService:CameraService
       ) { }
  
    //  getTasks() {
    //     return this.tasks
    //   }
     async findTask (taskType: any,user:any,idCamera:any) {
            const task= await this.taskModel.findOne({taskType,user,idCamera})
            return task
     }
     async findTaskWithoutUser (taskType: any,idCamera:any) {
      const task= await this.taskModel.findOne({taskType,idCamera})
      return task
}
    async addTask(idCamera: string,pID:number,user:string,taskType:string,active:boolean) {
      try {
        const newTask = new this.taskModel({
         idCamera,
         pID,
         user,
         taskType,
         active
        })
      
        const result = await newTask.save();
        return result
      } catch (error) {
        return null
      }
      
   }

   async killTask(pid: number) {
          const task = await this.taskModel.findOne({pID:pid})
      if (task) {
        if (require('is-running')(pid)) {
            process.kill(pid)
        }
        await this.taskModel.deleteOne({ pID: pid })
        return true
      }
      else return false
    }
}
