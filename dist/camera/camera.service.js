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
const child_process_1 = require("child_process");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
let CameraService = class CameraService {
    constructor(cameraModel, userService) {
        this.cameraModel = cameraModel;
        this.userService = userService;
    }
    async findCameraByID(id) {
        const camera = await this.cameraModel.findById(id).exec();
        return camera;
    }
    async findCameraByName(name) {
        const camera = await this.cameraModel.findOne({ name: name }).exec();
        return camera;
    }
    async getCameras() {
        const cameras = await this.cameraModel.find().exec();
        return cameras.map(cam => ({
            _id: cam._id,
            name: cam.name,
            ip: cam.ip,
            port: cam.port,
            rtspUrl: cam.rtspUrl,
            user: this.userService.findUserByID(cam.user)
        }));
    }
    async addOne(camera) {
    }
    async recordFullStream(url) {
        const command = `ffmpeg -i ${url} -acodec copy -vcodec copy D:/test.mp4`;
        child_process_1.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('error', error);
                return false;
            }
            if (stderr) {
                console.log('stderr', stderr);
                return false;
            }
            console.log('stdout', stdout);
            return true;
        });
    }
    async recordStreamPerTime(url, time) {
        const command = `ffmpeg -i ${url} -c copy -map 0 -f segment -segment_time ${time} -segment_format mp4 "D:/demo%03d.mp4"`;
        child_process_1.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('error', error);
                return false;
            }
            if (stderr) {
                console.log('stderr', stderr);
                return false;
            }
            console.log('stdout', stdout);
            return true;
        });
    }
    async turnMotionDetect(url) {
        const command = `ffmpeg -rtsp_transport tcp -i ${url} -vf select='gte(scene\,0.005)',metadata=print -an -f null -`;
        await child_process_1.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('error', error);
                return false;
            }
            if (stderr) {
                console.log('stderr', stderr);
                return stderr;
            }
            console.log('stdout', stdout);
            return stdout;
        });
    }
    async motionDection(url) {
        const command = `python motion-detect.py --video ${url}`;
        await child_process_1.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log('error', error);
                return false;
            }
            if (stderr) {
                console.log('stderr', stderr);
                return stderr;
            }
            console.log('stdout', stdout);
            return stdout;
        });
    }
};
CameraService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Camera')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, user_service_1.UserService])
], CameraService);
exports.CameraService = CameraService;
//# sourceMappingURL=camera.service.js.map