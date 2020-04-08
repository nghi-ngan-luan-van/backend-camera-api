import { Model } from 'mongoose';
import { Camera } from './camera.model';
import { UserService } from 'src/user/user.service';
export declare class CameraService {
    private readonly cameraModel;
    private readonly userService;
    private readonly cameras;
    constructor(cameraModel: Model<Camera>, userService: UserService);
    findCameraByID(id: string): Promise<Camera>;
    findCameraByName(name: string): Promise<Camera>;
    getCameras(): Promise<any>;
    addOne(camera: Camera): Promise<void>;
    recordFullStream(url: string): Promise<void>;
    recordStreamPerTime(url: string, time: number): Promise<void>;
    turnMotionDetect(url: string): Promise<any>;
    motionDection(url: string): Promise<any>;
}
