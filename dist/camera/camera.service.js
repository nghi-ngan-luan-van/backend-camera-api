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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("..//user/user.service");
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
            username: cam.username,
            password: cam.password,
            user: this.userService.findUserByID(cam.user)
        }));
    }
    async addOne(username, name, password, ip, port, rtspUrl) {
        const user = this.userService.findUserByEmail('nghinguyen.170498@gmail.com');
        const newCamera = new this.cameraModel({
            username,
            name,
            password,
            ip,
            port,
            rtspUrl,
            user: (await user)._id
        });
        const result = await newCamera.save();
        return result;
    }
    async updateOne(id, username, name, password, ip, port, rtspUrl) {
        const user = await this.cameraModel.updateOne({ _id: id }, { name, username, password, ip, port, rtspUrl });
        return user;
    }
    async deleteOne(id) {
        const result = await this.cameraModel.deleteOne({ _id: id });
        return result;
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
        const command = `ffmpeg -rtsp_transport tcp -i "${url}" -vf select='gte(scene\\,0.05)',metadata=print -an -f null -`;
        console.log("cmd", command);
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
        var e_1, _a;
        const command = `python motion-detect.py --video ${url}`;
        const child = child_process_1.exec(command);
        let data = [];
        try {
            for (var _b = __asyncValues(child.stdout), _c; _c = await _b.next(), !_c.done;) {
                const chunk = _c.value;
                console.log('stdout chunk: ' + chunk);
                data.push(Date.parse(chunk));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log("data", data);
    }
    async scanNetwork() {
        const onvif = require('node-onvif');
        const Stream = require('node-rtsp-stream');
        let camera = [];
        let devices = [];
        let streams = [];
        onvif.startProbe().then((device_info_list) => {
            console.log(device_info_list.length + ' devices were found.');
            const arr = [];
            device_info_list.forEach((info, x) => {
                if (x <= 5) {
                    arr.push(info.xaddrs[0]);
                }
            });
            camera = arr;
            arr.forEach((onCam, i) => {
                let device = new onvif.OnvifDevice({
                    xaddr: onCam,
                    user: 'admin',
                    pass: 'admin'
                });
                devices.push(device);
                device.init().then(() => {
                    let url = device.getUdpStreamUrl();
                    const stream = new Stream({
                        name: 'name',
                        streamUrl: url,
                        wsPort: 9000 + i
                    });
                    streams.push(stream);
                    console.log("URL :" + url);
                }).catch((error) => {
                    console.error(error);
                });
            });
        }).catch((error) => {
            console.error(error);
        });
        console.log('cam', camera, 'streams', streams, 'devs', devices);
        return { camera, streams, devices };
    }
};
CameraService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Camera')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, user_service_1.UserService])
], CameraService);
exports.CameraService = CameraService;
//# sourceMappingURL=camera.service.js.map