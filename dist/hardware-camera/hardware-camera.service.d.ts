import { HardwareCamera } from './hardware-camera.model';
import { Model } from 'mongoose';
export declare class HardwareCameraService {
    private readonly hardwareCameraModel;
    constructor(hardwareCameraModel: Model<HardwareCamera>);
    addOne(rtspUrl: string): Promise<any>;
    getCameras(): Promise<any>;
}
