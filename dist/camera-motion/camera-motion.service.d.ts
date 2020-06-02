import { CameraMotion } from './camera-motion.model';
import { Model } from 'mongoose';
export declare class CameraMotionService {
    private readonly cameraMotionModel;
    private camMotions;
    constructor(cameraMotionModel: Model<CameraMotion>);
    addOne(userID: string, cameraUrl: string, filePath: string, timeStart: string, timeEnd: string, cdnUrl: string): Promise<any>;
    getMotionByUser(userID: string, cameraUrl: string): Promise<any>;
}
