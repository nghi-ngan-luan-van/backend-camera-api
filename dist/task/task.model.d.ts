import * as mongoose from 'mongoose';
export declare const TaskSchema: any;
export interface Task extends mongoose.Document {
    _id: string;
    idCamera: string;
    user: string;
    pID: number;
    taskType: string;
    active: boolean;
}
