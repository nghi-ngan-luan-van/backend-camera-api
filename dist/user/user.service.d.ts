import { User } from "./user.model";
import { Model } from 'mongoose';
export declare class UserService {
    private readonly userModel;
    private readonly users;
    constructor(userModel: Model<User>);
    findUserByID(id: string): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    getUsers(): Promise<any>;
    addOne(name: string, password: string, email: string): Promise<any>;
    updateOne(id: string, newName: string): Promise<any>;
    deleteOne(id: string): Promise<any>;
    getHash(password: string | undefined): Promise<string>;
    compareHash(password: string | undefined, hash: string | undefined): Promise<boolean>;
}
