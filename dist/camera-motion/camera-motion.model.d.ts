import * as mongoose from 'mongoose';
export declare const CameraMotionSchema: any;
export interface CameraMotion extends mongoose.Document {
    _id: string;
    cameraUrl: string;
    filePath: string;
    timeStart: string;
    timeEnd: string;
    user: string;
}
