import * as mongoose from 'mongoose';
export declare const CameraRecordSchema: any;
export interface CameraRecord extends mongoose.Document {
    _id: string;
    cameraID: string;
    timeStart: string;
    cdnUrl: string;
    user: string;
}
