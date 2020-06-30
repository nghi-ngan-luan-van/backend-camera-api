import * as mongoose from 'mongoose';
export declare const CameraSchema: any;
export interface Camera extends mongoose.Document {
    _id: string;
    name: string;
    thumbnail: string;
    ip: string;
    port: number;
    rtspUrl: string;
    username: string;
    password: string;
    backupMode: boolean;
    user: string;
}
