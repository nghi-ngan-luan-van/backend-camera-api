import * as mongoose from 'mongoose'

export const CameraMotionSchema = new mongoose.Schema({
    cameraUrl:String,
    filePath:String,
    timeStart:String,
    timeEnd:String,
    cdnUrl:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },})

export interface CameraMotion  extends mongoose.Document  {
    _id:string;
    cameraUrl:string;
    filePath:string,
    timeStart:string,
    timeEnd:string,
    cdnUrl:string,
    user:string;
}
