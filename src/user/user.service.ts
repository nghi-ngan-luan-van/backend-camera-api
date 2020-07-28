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

  async changePassword (id:string,newPassword:string,oldPassword:string) {
    const user = await this.userModel.findById(id)
    const compareHash=this.compareHash
    const getHash=this.getHash
    return new Promise(async function (resolve, reject) {
    if (user==null) resolve(false)
    const result=await compareHash(oldPassword,user.password)
    console.log('asd',result)
    if (!result) resolve(false)
    const hashpassword = await getHash(newPassword);
    user.password=hashpassword
    await user.save();
    resolve(user)
    })
  }
  async sendMailReset(email:string) {
    const res = await this.findUserByEmail(email)
    const getHash=this.getHash
    const userModel=this.userModel
    return new Promise(async function (resolve, reject) {
      console.log(res)
      if (res===null)  resolve(false)
      else {
        const user = await userModel.findById((await res)._id)
        console.log(user)
        if (user===null) resolve(false)
        else {
          user.resetExpires=Date.now() +108000
          const hashpassword = await getHash(user.resetToken);
          user.password=hashpassword
          user.resetToken=randomstring.generate(7)
          console.log(user.resetExpires,hashpassword)
          const html=`Chào bạn,
          Email đăng nhập của bạn là: ${user.email}       
          Vui lòng nhập đoạn mã sau de reset password: ${user.resetToken}
          Chúc một ngày tốt lành.`;
          sendMail(email,'Reset password Clomera',html,async function(err,data){
              if (err) throw err;
              await user.save()
              resolve(true)
      
          });
        }
      }
     
    //Compose email 
    
  })
}
  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
