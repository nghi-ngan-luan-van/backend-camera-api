import { CameraRecord } from './camera-record.model';
import { Model } from 'mongoose';
export declare class CameraRecordService {
    private readonly cameraRecordModel;
    constructor(cameraRecordModel: Model<CameraRecord>);
    addOne(userID: string, cameraID: string, timeStart: string, timeEnd: string, cdnUrl: string): Promise<any>;
    getMotionByUser(userID: string, cameraID: string): Promise<any>;
}
