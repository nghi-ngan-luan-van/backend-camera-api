import * as mongoose from 'mongoose';
export declare const TaskSchema: any;
export interface Task extends mongoose.Document {
    _id: string;
    idCamera: string;
    pID: number;
    cameraUrl: string;
    taskType: string;
    active: boolean;
}
