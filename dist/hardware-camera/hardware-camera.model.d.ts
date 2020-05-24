import * as mongoose from 'mongoose';
export declare const HardwareCameraSchema: any;
export interface HardwareCamera extends mongoose.Document {
    _id: string;
    rtspUrl: string;
}
