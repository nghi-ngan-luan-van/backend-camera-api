import { CameraService } from 'src/camera/camera.service';
import { Model } from 'mongoose';
import { Task } from './task.model';
export declare class TaskService {
    private readonly taskModel;
    private readonly cameraService;
    private tasks;
    constructor(taskModel: Model<Task>, cameraService: CameraService);
    addTask(idCamera: string, pID: number, cameraUrl: string, taskType: string, active: boolean): Promise<any>;
    killTask(pid: number): Promise<boolean>;
}
