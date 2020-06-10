import * as mongoose from 'mongoose'

export const TaskSchema = new mongoose.Schema({
    idCamera :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camera'
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pID:{type: Number, default: null},
    taskType: { type: String, default: null },
    active: { type: Boolean, default: null },
})

export interface Task  extends mongoose.Document  {
    _id:string;
    idCamera:string;
    user:string;
    pID:number,
    taskType:string;
    active:boolean;
}
