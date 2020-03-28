import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { User } from "./user.model";
import {InjectModel} from'@nestjs/mongoose'
import {Model} from 'mongoose'

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor(@InjectModel('User') private readonly userModel:Model<User>) { }
    


   async findUserByID(id: string): Promise<User> {
     const user=await this.userModel.findById(id).exec();
      return user
  }
  async findUserByUsername(username: string): Promise<User> {
    const user=await this.userModel.findOne({username:username}).exec()
     return user
 }
  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      username: user.name,
      password: user.password,
    }));
  }


  async addOne(username:string,name:string,password:string) {
    const hashpassword = await this.getHash(password);
    const newUser= new this.userModel({
      username,
      name,
      password:hashpassword
    })
    const result= await newUser.save();
    return result;
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
