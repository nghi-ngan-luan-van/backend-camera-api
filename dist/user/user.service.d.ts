import { User } from "./user.model";
import { Model } from 'mongoose';
export declare class UserService {
    private readonly userModel;
    private readonly users;
    constructor(userModel: Model<User>);
    findUserByID(id: string): Promise<User>;
    findUserByUsername(username: string): Promise<User>;
    getUsers(): Promise<any>;
    addOne(username: string, name: string, password: string): Promise<any>;
    getHash(password: string | undefined): Promise<string>;
    compareHash(password: string | undefined, hash: string | undefined): Promise<boolean>;
}
