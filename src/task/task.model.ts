import * as mongoose from 'mongoose'

export const TaskSchema = new mongoose.Schema({
    idCamera :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camera'
    },
    pID:{type: Number, default: null},
    cameraUrl :{ type: String, default: null },
    taskType: { type: String, default: null },
    active: { type: Boolean, default: null },
})

export interface Task  extends mongoose.Document  {
    _id:string;
    idCamera:string;
    pID:number,
    cameraUrl:string;
    taskType:string;
    active:boolean;
}
