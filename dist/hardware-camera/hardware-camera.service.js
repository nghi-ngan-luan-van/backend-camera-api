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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HardwareCameraService = class HardwareCameraService {
    constructor(hardwareCameraModel) {
        this.hardwareCameraModel = hardwareCameraModel;
    }
    async addOne(rtspUrl) {
        try {
            if (!this.hardwareCameraModel.findbyID({ rtspUrl })) {
                const newCam = new this.hardwareCameraModel({
                    rtspUrl
                });
                const result = await newCam.save();
                return result;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async getCameras() {
        const cameras = await this.hardwareCameraModel.find().exec();
        return cameras.map(cam => ({
            _id: cam._id,
            rtspUrl: cam.rtspUrl,
        }));
    }
};
HardwareCameraService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('HardwareCamera')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], HardwareCameraService);
exports.HardwareCameraService = HardwareCameraService;
//# sourceMappingURL=hardware-camera.service.js.map