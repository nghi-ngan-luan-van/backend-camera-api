import * as mongoose from 'mongoose'

export const CameraRecordSchema = new mongoose.Schema({
    cameraID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeStart:String,
    cdnUrl:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },})

export interface CameraRecord  extends mongoose.Document  {
    _id:string;
    cameraID:string;
    timeStart:string,
    cdnUrl:string,
    user:string;
}
