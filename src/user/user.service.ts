import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as uuid from "uuid";
import { User } from "./user.model";
import {InjectModel} from'@nestjs/mongoose'
import {Model} from 'mongoose'
import { async } from "rxjs/internal/scheduler/async";
const randomstring= require('randomstring');

const sendMail= require('../misc/mailer')
@Injectable()
export class UserService {
  private readonly users: User[];

  constructor(@InjectModel('User') private readonly userModel:Model<User>) { }
    


   async findUserByID(id: string): Promise<User> {
     const user=await this.userModel.findById(id).exec();
      return user
  }
  async findUserByEmail(email: string): Promise<User> {
    const user=await this.userModel.findOne({email:email}).exec()
     return user
 }
  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    }));
  }


  async addOne(name:string,password:string,email:string,) {
    const hashpassword = await this.getHash(password);
    const newUser= new this.userModel({
      email,
      name,
      password:hashpassword
    })
    const result= await newUser.save();
    return result;
  }

  async updateOne(id:string, newName:string) {
    const user= await this.userModel.updateOne({_id:id},{name:newName})
    return user
  }   

  async deleteOne(id:string) {
      const result= await this.userModel.deleteOne({_id:id})
      return result
  }  

  async changePassword (id:string,newPassword:string) {
    const user = await this.userModel.findById(id)
    if (!user) return false
    const hashpassword = await this.getHash(newPassword);
    user.password=hashpassword
    await user.save();
    return user

  }
  async sendMailReset(email:string) {
    //Compose email 
    const res=this.findUserByEmail(email)
    const user = await this.userModel.findById((await res)._id)
    if (!user) return false
    user.resetExpires=Date.now() +108000
    console.log(user.resetExpires)
    const html=`Chào bạn,
    Email đăng nhập của bạn là: ${user.email}       
    Vui lòng nhập đoạn mã sau de reset password:  ${user.resetToken}
    Chúc một ngày tốt lành.`;
    sendMail(email,'Reset password Clomera',html,async function(err,data){
        if (err) throw err;
        user.resetToken=randomstring.generate(7)
        await user.save()
        return true

    });
  }
  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
