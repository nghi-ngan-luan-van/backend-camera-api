"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const randomstring = require('randomstring');
const sendMail = require('../misc/mailer');
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findUserByID(id) {
        const user = await this.userModel.findById(id).exec();
        return user;
    }
    async findUserByEmail(email) {
        const user = await this.userModel.findOne({ email: email }).exec();
        return user;
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
    async addOne(name, password, email) {
        const hashpassword = await this.getHash(password);
        const newUser = new this.userModel({
            email,
            name,
            password: hashpassword
        });
        const result = await newUser.save();
        return result;
    }
    async updateOne(id, newName) {
        const user = await this.userModel.updateOne({ _id: id }, { name: newName });
        return user;
    }
    async deleteOne(id) {
        const result = await this.userModel.deleteOne({ _id: id });
        return result;
    }
    async changePassword(id, newPassword) {
        const user = await this.userModel.findById(id);
        if (!user)
            return false;
        const hashpassword = await this.getHash(newPassword);
        user.password = hashpassword;
        await user.save();
        return user;
    }
    async sendMailReset(email) {
        const res = this.findUserByEmail(email);
        const user = await this.userModel.findById((await res)._id);
        if (!user)
            return false;
        user.resetExpires = Date.now() + 108000;
        console.log(user.resetExpires);
        const html = `Chào bạn,
    Email đăng nhập của bạn là: ${user.email}       
    Vui lòng nhập đoạn mã sau de reset password:  ${user.resetToken}
    Chúc một ngày tốt lành.`;
        sendMail(email, 'Reset password Clomera', html, async function (err, data) {
            if (err)
                throw err;
            user.resetToken = randomstring.generate(7);
            await user.save();
            return true;
        });
    }
    async getHash(password) {
        return bcrypt.hash(password, 10);
    }
    async compareHash(password, hash) {
        return bcrypt.compare(password, hash);
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map