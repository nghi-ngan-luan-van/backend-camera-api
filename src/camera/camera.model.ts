import * as mongoose from 'mongoose'

export const CameraSchema = new mongoose.Schema({
    name:{ type: String, default: null },
    ip:{ type: String, default: null },
    port:{ type: Number, default: null },
    rtspUrl:{
        type: mongoose.Schema.Types.String,
        ref: 'HardwareCamera'
    },
    username:{ type: String, default: null },
    password:{ type: String, default: null },
    backupMode:{ type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },})

export interface Camera  extends mongoose.Document  {
    _id:string;
    name:string,
    ip:string;
    port:number;
    rtspUrl:string;
    username:string;
    password:string;
    backupMode:boolean;
    user:string;
}
