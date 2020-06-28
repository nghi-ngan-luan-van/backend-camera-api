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
exports.CameraRecordService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CameraRecordService = class CameraRecordService {
    constructor(cameraRecordModel) {
        this.cameraRecordModel = cameraRecordModel;
    }
    async addOne(userID, cameraID, timeStart, timeEnd, cdnUrl) {
        console.log(userID);
        const newCameraRecord = new this.cameraRecordModel({
            cameraID,
            timeStart,
            timeEnd,
            cdnUrl,
            user: userID
        });
        const result = await newCameraRecord.save();
        return result;
    }
    async getMotionByUser(userID, cameraID) {
        try {
            const data = await this.cameraRecordModel.find({ user: userID, cameraID });
            console.log(data);
            return data;
        }
        catch (error) {
            return false;
        }
    }
};
CameraRecordService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('CameraRecord')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CameraRecordService);
exports.CameraRecordService = CameraRecordService;
//# sourceMappingURL=camera-record.service.js.map