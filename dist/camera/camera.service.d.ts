import { Model } from 'mongoose';
import { Camera } from './camera.model';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
export declare class CameraService {
    private readonly cameraModel;
    private readonly userService;
    private readonly taskService;
    private readonly cameras;
    constructor(cameraModel: Model<Camera>, userService: UserService, taskService: TaskService);
    findCameraByID(id: string): Promise<Camera>;
    findCameraByName(name: string): Promise<Camera>;
    getCameras(): Promise<any>;
    addOne(userID: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string): Promise<any>;
    updateOne(id: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string): Promise<any>;
    deleteOne(id: string): Promise<any>;
    recordFullStream(url: string): Promise<void>;
    recordStreamPerTime(url: string, time: number): Promise<void>;
    turnMotionDetect(url: string): Promise<any>;
    motionDection(url: string): Promise<any>;
    scanNetwork(): Promise<any>;
}
