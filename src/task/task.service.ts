import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CameraService } from 'src/camera/camera.service';

@Injectable()
export class TaskService {
    private  tasks=[]
    constructor(
      @Inject(forwardRef(() => CameraService))
      private readonly cameraService:CameraService
       ) { }
     getTasks() {
        return this.tasks
      }
      findTask = (id: any) => {
            const task= this.tasks.find(item => item===id)
            return task
     }

    async addTask(id: any) {
       this.tasks.push(id)
       return true
   }

   async killTask(url: string) {
      this.tasks =this.tasks.filter(item =>item.spawnargs.includes(url))
      const task=this.tasks.find(item => item.spawnargs.includes(url))
      if (task) {
        task.kill()
        return true
      }
      else return false
    }
}
