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
const task_service_1 = require("../task/task.service");
const camera_motion_service_1 = require("../camera-motion/camera-motion.service");
const auth_1 = require("../.aws/auth");
const fs = require("fs");
require('dotenv').config();
let CameraService = class CameraService {
    constructor(cameraModel, userService, taskService, camMotionService) {
        this.cameraModel = cameraModel;
        this.userService = userService;
        this.taskService = taskService;
        this.camMotionService = camMotionService;
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
            backupMode: cam.backupMode,
            user: cam.user
        }));
    }
    async getCamerasByUser(userID) {
        const cameras = await this.cameraModel.find({ user: userID }).exec();
        return cameras.map(cam => ({
            _id: cam._id,
            name: cam.name,
            ip: cam.ip,
            port: cam.port,
            rtspUrl: cam.rtspUrl,
            username: cam.username,
            password: cam.password,
            backupMode: cam.backupMode,
            user: userID
        }));
    }
    async addOne(userID, username, name, password, ip, port, rtspUrl) {
        console.log(userID);
        const newCamera = new this.cameraModel({
            username,
            name,
            password,
            ip,
            port,
            rtspUrl,
            user: userID
        });
        const result = await newCamera.save();
        return result;
    }
    async updateOne(id, username, name, password, ip, port, rtspUrl, backupMode) {
        const result = await this.cameraModel.updateOne({ _id: id }, { name, username, password, ip, port, rtspUrl, backupMode });
        return result.nModified;
    }
    async deleteOne(id) {
        const result = await this.cameraModel.deleteOne({ _id: id });
        return result;
    }
    async recordFullStream(url) {
        const command = `ffmpeg -i ${url} -c:a aac -vcodec copy src/video/test.mp4`;
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
    async motionDection(_id, url, userID) {
        console.log('....', process.env.ASSETS_PATH);
        const child = child_process_1.spawn('python', ["src/python-scripts/motion-detect.py", url, process.env.ASSETS_PATH]);
        console.log('pid', child.pid);
        let dataToSend = [];
        let filePath = '', timeStart = '', timeEnd = '';
        child.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log('stdout', output);
            console.log("data.toString().split('.').pop()", output.split('.').pop());
            if (output.split('.').pop() === `mp4`) {
                filePath = output;
                console.log("files: ", filePath);
            }
            else {
                dataToSend.push(output);
                console.log("data to send: ", dataToSend);
            }
            if (dataToSend.length === 2) {
                timeStart = dataToSend[0];
                timeEnd = dataToSend[1];
                dataToSend = [];
                console.log("time: ", timeStart, timeEnd);
            }
            console.log('cam motion:', filePath, timeStart, timeEnd);
            if (filePath !== '' && timeStart !== '' && timeEnd !== '') {
                this.camMotionService.addOne(userID, url, filePath, timeStart, timeEnd);
                fs.readFile(`${process.env.ASSETS_PATH}/${filePath}`, function (err, data) {
                    if (err) {
                        console.log('fs error', err);
                    }
                    else {
                        var params = {
                            Bucket: 'clientapp',
                            Key: `${userID}/${_id}/` + filePath,
                            Body: data,
                            ContentType: 'video/mp4',
                            ACL: 'public-read'
                        };
                        auth_1.s3.putObject(params, function (err, data) {
                            if (err) {
                                console.log('Error putting object on S3: ', err);
                            }
                            else {
                                console.log('Placed object on S3: ', data);
                            }
                        });
                    }
                });
            }
        });
        filePath = '', timeStart = '', timeEnd = '';
    }
    async scanNetwork() {
        const onvif = require('node-onvif');
        const Stream = require('node-rtsp-stream');
        let camera = [];
        const devices = [];
        const streams = [];
        onvif.startProbe().then((device_info_list) => {
            console.log(device_info_list.length + ' devices were found.');
            console.log(device_info_list);
            const arr = [];
            device_info_list.forEach((info, x) => {
                if (x <= 5) {
                    console.log('- ' + info.urn);
                    console.log('  - ' + info.name);
                    console.log('  - ' + info.xaddrs[0]);
                    arr.push(info.xaddrs[0]);
                }
            });
            camera = arr;
            arr.forEach((onCam, i) => {
                const device = new onvif.OnvifDevice({
                    xaddr: onCam,
                    user: 'admin',
                    pass: 'admin'
                });
                devices.push(device);
                device.init().then(() => {
                    const url = device.getUdpStreamUrl();
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
    testput() {
        fs.readFile(`${process.env.ASSETS_PATH}/2020_05_17_12_13_13_PM.mp4`, function (err, data) {
            if (err) {
                console.log('fs error', err);
            }
            else {
                const params = {
                    Bucket: 'clientapp',
                    Key: 'nghi/axax.mp4',
                    Body: data,
                    ContentType: 'video/mp4',
                    ACL: 'public-read'
                };
                auth_1.s3.putObject(params, function (err, data) {
                    if (err) {
                        console.log('Error putting object on S3: ', err);
                    }
                    else {
                        console.log('Placed object on S3: ', data);
                    }
                });
            }
        });
        const params = {
            Bucket: "clientapp",
            Prefix: 'nghi/'
        };
        auth_1.s3.listObjects(params, function (err, data) {
            if (err)
                console.log(err, err.stack);
            else {
                data['Contents'].forEach(function (obj) {
                    console.log(obj['Key']);
                });
            }
            ;
        });
        return true;
    }
    async listVideoByUSer(userID, _id) {
        const params = {
            Bucket: "clientapp",
            Prefix: `${userID}/${_id}`
        };
        const result = [];
        const s3Response = await auth_1.s3.listObjects(params).promise();
        s3Response['Contents'].forEach(function (obj) {
            if (obj['Key'].split('.').pop() === 'mp4') {
                console.log(obj['Key']);
                const item = {
                    index: result.length + 1,
                    name: 'https://clientapp.sgp1.digitaloceanspaces.com/' + obj['Key']
                };
                result.push(item);
            }
            console.log("res", result);
        });
        return result;
    }
};
CameraService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Camera')),
    __param(1, common_1.Inject(common_1.forwardRef(() => task_service_1.TaskService))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, user_service_1.UserService,
        task_service_1.TaskService,
        camera_motion_service_1.CameraMotionService])
], CameraService);
exports.CameraService = CameraService;
//# sourceMappingURL=camera.service.js.map