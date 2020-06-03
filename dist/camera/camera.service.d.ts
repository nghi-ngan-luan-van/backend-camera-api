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
    updateOne(id: string, username: string, name: string, password: string, ip: string, port: number, rtspUrl: string, backupMode: boolean): Promise<boolean>;
    deleteOne(_id: string): Promise<boolean>;
    recordFullStream(url: string): Promise<void>;
    recordStreamPerTime(url: string, time: number): Promise<void>;
    turnMotionDetect(url: string): Promise<any>;
    recordDetection(_id: string, url: string, userID: string): Promise<any>;
    motionDetection(_id: string, userID: string): Promise<any>;
    scanNetwork(): Promise<any>;
    getFileSizInByte(filename: any): number;
    uploadVideo(userID: string, cameraID: string, filePath: string): Promise<void>;
    testput(): boolean;
    listVideoByUSer(userID: string, _id: string): Promise<any>;
    testHandleTask(): Promise<boolean>;
}
