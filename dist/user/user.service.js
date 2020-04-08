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
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findUserByID(id) {
        const user = await this.userModel.findById(id).exec();
        return user;
    }
    async findUserByUsername(username) {
        const user = await this.userModel.findOne({ username: username }).exec();
        return user;
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
    async addOne(username, name, password) {
        const hashpassword = await this.getHash(password);
        const newUser = new this.userModel({
            username,
            name,
            password: hashpassword
        });
        const result = await newUser.save();
        return result;
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