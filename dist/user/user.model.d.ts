import * as mongoose from 'mongoose';
export declare const UserSchema: any;
export interface User extends mongoose.Document {
    _id: string;
    username: string;
    name: string;
    password: string;
}
