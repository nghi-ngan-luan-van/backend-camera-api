import * as mongoose from 'mongoose'
const randomstring= require('randomstring');

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    resetToken:{type:String,default:randomstring.generate(7)},
    resetExpires:{type:Number,default:Date.now()}
})

export interface User  extends mongoose.Document  {
    _id:string;
    email:string;
    name:string;
    password:string;
    resetToken:string,
    resetExpires:number
}
