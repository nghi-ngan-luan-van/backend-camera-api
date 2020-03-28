import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
})

export interface User  extends mongoose.Document  {
    _id:string;
    username:string;
    name:string;
    password:string
}
