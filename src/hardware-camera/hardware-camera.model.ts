import * as mongoose from 'mongoose'

export const HardwareCameraSchema = new mongoose.Schema({
    rtspUrl:{ type: String, default: null },
})

export interface HardwareCamera  extends mongoose.Document  {
    _id:string;
    rtspUrl:string;
}
