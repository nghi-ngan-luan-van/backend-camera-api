import { Model } from 'mongoose';
import { Camera } from './camera.model';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { CameraMotionService } from '../camera-motion/camera-motion.service';
export declare class CameraService {
    private readonly cameraModel;
    private readonly userService;
    private readonly taskService;
    private readonly camMotionService;
    private readonly cameras;
    constructor(cameraModel: Model<Camera>, userService: UserService, taskService: TaskService, camMotionService: CameraMotionService);
    findCameraByID(id: string): Promise<Camera>;
    findCameraByName(name: string): Promise<Camera>;
    getCameras(): Promise<any>;
    getCamerasByUser(userID: string): Promise<any>;
    addOne(userID: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string): Promise<any>;
    updateOne(id: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string): Promise<any>;
    deleteOne(id: string): Promise<any>;
    recordFullStream(url: string): Promise<void>;
    recordStreamPerTime(url: string, time: number): Promise<void>;
    turnMotionDetect(url: string): Promise<any>;
    motionDection(url: string, userID: string): Promise<any>;
    scanNetwork(): Promise<any>;
    testput(): boolean;
    listVideoByUSer(userID: string): Promise<any>;
}
