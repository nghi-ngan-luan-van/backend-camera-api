import * as mongoose from 'mongoose'

export const CameraSchema = new mongoose.Schema({
    name:String,
    ip:String,
    port:String,
    rtspUrl:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },})

export interface Camera  extends mongoose.Document  {
    _id:string;
    name:string,
    ip:string;
    port:string;
    rtspUrl:string;
    user:string;
}
