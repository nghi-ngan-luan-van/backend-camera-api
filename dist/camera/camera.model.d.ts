import * as mongoose from 'mongoose';
export declare const CameraSchema: any;
export interface Camera extends mongoose.Document {
    _id: string;
    name: string;
    ip: string;
    port: string;
    rtspUrl: string;
    username: string;
    password: string;
    user: string;
}
