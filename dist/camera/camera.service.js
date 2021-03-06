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
const camera_record_service_1 = require("../camera-record/camera-record.service");
const schedule_1 = require("@nestjs/schedule");
const fetch = require('node-fetch');
const chokidar = require('chokidar');
require('dotenv').config();
let CameraService = class CameraService {
    constructor(cameraModel, userService, taskService, camMotionService, camRecordService) {
        this.cameraModel = cameraModel;
        this.userService = userService;
        this.taskService = taskService;
        this.camMotionService = camMotionService;
        this.camRecordService = camRecordService;
    }
    async handleCron() {
        const requestOption = {
            method: 'GET',
            redirect: 'follow',
        };
        const cameraModel = this.cameraModel;
        fetch('http://localhost:3000/camera/allcam', requestOption)
            .then(response => response.text())
            .then(result => {
            console.log(result);
            console.log(typeof result);
            result = JSON.parse(result);
            result.map(async (value, index) => {
                try {
                    console.log(value);
                    const { _id, name, rtspUrl, ip, port, thumbnail, username, password, backupMode, } = value;
                    const child = child_process_1.spawn('python', [
                        'src/python-scripts/test-connection.py',
                        rtspUrl,
                        process.env.ASSETS_PATH,
                    ]);
                    console.log('pid', child.pid);
                    child.stdout.on('data', async (data) => {
                        const output = data.toString().trim();
                        console.log('stdout', output);
                        if (output === '0') {
                            console.log('false');
                        }
                        if (output.split('.').pop() === `jpg`) {
                            setTimeout(() => {
                                fs.readFile(`${process.env.ASSETS_PATH}/${output}`, function (err, data) {
                                    if (err) {
                                        console.log('fs error', err);
                                    }
                                    else {
                                        const params = {
                                            Bucket: 'clientapp',
                                            Key: `${rtspUrl}/${output}`,
                                            Body: data,
                                            ACL: 'public-read',
                                            ContentType: 'image/jpeg',
                                        };
                                        auth_1.s3.putObject(params, async function (err, data) {
                                            if (err) {
                                                console.log('Error putting object on S3: ', err);
                                            }
                                            else {
                                                console.log('Placed object on S3: ', data);
                                                const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${rtspUrl}/${output}`;
                                                console.log(typeof _id);
                                                const result = await cameraModel.updateOne({ _id: _id }, { thumbnail: cdnUrl });
                                                setTimeout(() => {
                                                    fs.unlinkSync(`${process.env.ASSETS_PATH}/${output}`);
                                                }, 2000);
                                            }
                                        });
                                    }
                                });
                            }, 2000);
                        }
                    });
                }
                catch (error) {
                    console.log(`error with ${value.rtspUrl}`);
                }
            });
        });
    }
    async findCameraByID(id) {
        const camera = await this.cameraModel.findById(id).exec();
        return camera;
    }
    async findCameraByRTSPName(rtspUrl, user) {
        const camera = await this.cameraModel.findOne({ rtspUrl, user }).exec();
        return camera;
    }
    async findCameraByName(name) {
        const camera = await this.cameraModel
            .findOne({ name: name, deleted: false })
            .exec();
        return camera;
    }
    async getCameras() {
        const cameras = await this.cameraModel.find({ deleted: false }).exec();
        return cameras.map(cam => ({
            _id: cam._id,
            name: cam.name,
            ip: cam.ip,
            port: cam.port,
            rtspUrl: cam.rtspUrl,
            username: cam.username,
            password: cam.password,
            backupMode: cam.backupMode,
            user: cam.user,
        }));
    }
    async getCamerasByUser(userID) {
        const cameras = await this.cameraModel
            .find({ user: userID, deleted: false })
            .exec();
        return cameras.map(cam => ({
            _id: cam._id,
            name: cam.name,
            ip: cam.ip,
            port: cam.port,
            rtspUrl: cam.rtspUrl,
            thumbnail: cam.thumbnail,
            deleted: cam.deleted,
            username: cam.username,
            password: cam.password,
            backupMode: cam.backupMode,
            user: userID,
        }));
    }
    async addOne(userID, username, name, password, ip, port, rtspUrl, thumbnail) {
        console.log(userID);
        const newCamera = new this.cameraModel({
            username,
            name,
            password,
            ip,
            port,
            rtspUrl,
            thumbnail,
            user: userID,
        });
        const result = await newCamera.save();
        try {
            const params1 = {
                Bucket: 'clientapp',
                Key: `${userID}/${result._id}/`,
                ACL: 'public-read',
            };
            auth_1.s3.putObject(params1, function (err, data) {
                if (err) {
                    console.log('Error putting object on S3: ', err);
                }
                else {
                    console.log('Placed object on S3: ', data);
                }
            });
        }
        catch (error) {
            return false;
        }
        return result;
    }
    async updateOne(id, username, name, password, ip, port, rtspUrl, backupMode) {
        try {
            const result = await this.cameraModel.updateOne({ _id: id }, { name, username, password, ip, port, rtspUrl, backupMode });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async deleteOne(_id) {
        try {
            const result = await this.cameraModel.findById({ _id: _id });
            result.deleted = true;
            await result.save();
            return true;
        }
        catch (error) {
            return false;
        }
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
    async recordStreamPerTime(camID, url, userID, time) {
        const arr = [];
        let count = 0;
        if (count === 0) {
            try {
                await child_process_1.execSync(`mkdir -p -v ${process.env.ASSETS_PATH}/${camID}/record`);
            }
            catch (error) { }
        }
        console.log('a', time);
        setTimeout(async () => {
            const watcher = chokidar.watch(`${process.env.ASSETS_PATH}/${camID}/record`, {
                ignored: ['.DS_Store'],
                persistent: true,
                awaitWriteFinish: true,
            });
            const nowTime = Date.now();
            const ffmpeg = child_process_1.spawn('ffmpeg', [
                '-i',
                url,
                '-c:v',
                'copy',
                '-map',
                '0',
                '-f',
                'segment',
                '-segment_time',
                `${time}`,
                '-segment_format',
                'mp4',
                `${process.env.ASSETS_PATH}/${camID}/record/${nowTime.toString()}_%03d.mp4`,
            ]);
            ffmpeg.stdout.on('data', data => { });
            ffmpeg.on('exit', async (code) => {
                console.log('code', code);
                const recordModeTask = await this.taskService.findTask('0', userID, camID);
                const recordedTask = await this.taskService.findTask('3', userID, camID);
                if (recordModeTask && recordedTask) {
                    await this.taskService.killTask(recordModeTask.pID);
                    await this.taskService.killTask(recordedTask.pID);
                    console.log('done');
                }
                try {
                    setTimeout(() => {
                        console.log(`${process.env.ASSETS_PATH}/${camID}/record`);
                        const files = fs.readdirSync(`${process.env.ASSETS_PATH}/${camID}/record`);
                        console.log('files', files);
                        if (files.length !== 0) {
                            const d = new Date();
                            const month = d.getMonth() + 1;
                            const now = d.getDate() + '_' + month + '_' + d.getFullYear();
                            fs.readFile(`${process.env.ASSETS_PATH}/${camID}/record/${files[0]}`, function (err, data) {
                                if (err) {
                                    console.log('fs error', err);
                                }
                                else {
                                    const params = {
                                        Bucket: 'clientapp',
                                        Key: `${camID}/${now}/${files[0]}`,
                                        Body: data,
                                        ContentType: 'video/mp4',
                                        ACL: 'public-read',
                                    };
                                    auth_1.s3.putObject(params, async function (err, data) {
                                        if (err) {
                                            console.log('Error putting object on S3: ', err);
                                        }
                                        else {
                                            const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${camID}/${now}/${files[0]}`;
                                            const timeStart = nowTime + count * time * 1000;
                                            let duration;
                                            child_process_1.exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${cdnUrl}`, async (error, stdout, stderr) => {
                                                duration = stdout;
                                                console.log('stdout', stdout);
                                                const timeEnd = timeStart +
                                                    1000 * Math.round(parseInt(duration) + 1);
                                                console.log(Math.round(parseInt(duration) + 1));
                                                await camRecordServ.addOne(userID, camID, timeStart.toString(), timeEnd.toString(), cdnUrl);
                                                console.log('Placed object on S3: ', data);
                                                fs.unlinkSync(`${process.env.ASSETS_PATH}/${camID}/record/${files[0]}`);
                                                child_process_1.execSync(`rmdir ${process.env.ASSETS_PATH}/${camID}/record`);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }, 5000);
                }
                catch (error) { }
            });
            await this.taskService.addTask(camID, ffmpeg.pid, userID, '3', true);
            const camRecordServ = this.camRecordService;
            watcher.on('add', async function (path) {
                const n = arr.length;
                const d = new Date();
                const month = d.getMonth() + 1;
                const now = d.getDate() + '_' + month + '_' + d.getFullYear();
                console.log(n);
                console.log(now.toString());
                if (n !== 0) {
                    console.log(arr[n - 1]);
                    const filename = arr[n - 1].split(`/`).pop();
                    console.log(filename);
                    fs.readFile(`${arr[n - 1]}`, function (err, data) {
                        if (err) {
                            console.log('fs error', err);
                        }
                        else {
                            const params = {
                                Bucket: 'clientapp',
                                Key: `${camID}/${now}/${filename}`,
                                Body: data,
                                ContentType: 'video/mp4',
                                ACL: 'public-read',
                            };
                            auth_1.s3.putObject(params, async function (err, data) {
                                if (err) {
                                    console.log('Error putting object on S3: ', err);
                                }
                                else {
                                    console.log('Placed object on S3: ', data);
                                    const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${camID}/${now}/${filename}`;
                                    const timeStart = nowTime + count * time * 1000;
                                    const timeEnd = timeStart + time * 1000;
                                    await camRecordServ.addOne(userID, camID, timeStart.toString(), timeEnd.toString(), cdnUrl);
                                    count++;
                                    fs.unlinkSync(`${arr[n - 1]}`);
                                }
                            });
                        }
                    });
                }
                arr.push(path);
            });
        }, 2000);
    }
    async turnMotionDetect(url) {
        const command = `ffmpeg -rtsp_transport tcp -i "${url}" -vf select='gte(scene\\,0.05)',metadata=print -an -f null -`;
        console.log('cmd', command);
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
    async recordDetection(_id, userID, time) {
        console.log('....', process.env.ASSETS_PATH);
        try {
            const camera = await this.cameraModel.findById({ _id });
            const rtspUrl = camera.rtspUrl;
            camera.backupMode = true;
            await camera.save();
            const detectTask = await this.taskService.findTask('1', userID, _id);
            if (detectTask) {
                await this.taskService.killTask(detectTask.pID);
            }
            const recordModeTask = await this.taskService.findTaskWithoutUser('0', _id);
            if (recordModeTask) {
                return true;
            }
            const child = child_process_1.spawn('python', [
                'src/python-scripts/motion-detect.py',
                rtspUrl,
                process.env.ASSETS_PATH,
                '0',
            ]);
            this.recordStreamPerTime(_id, rtspUrl, userID, time);
            console.log('pid', child.pid);
            this.taskService.addTask(_id, child.pid, userID, '0', true);
            let dataToSend = [];
            let timeStart = '', timeEnd = '';
            child.stdout.on('data', async (data) => {
                const output = data.toString().trim();
                console.log('stdout', output);
                dataToSend.push(output);
                if (dataToSend.length === 2) {
                    timeStart = dataToSend[0];
                    timeEnd = dataToSend[1];
                    dataToSend = [];
                    console.log('time: ', timeStart, timeEnd);
                }
                console.log('cam motion:', timeStart, timeEnd);
                if (timeStart !== '' && timeEnd !== '') {
                    await this.camMotionService.addOne(userID, rtspUrl, null, timeStart, timeEnd, null);
                    (timeStart = ''), (timeEnd = '');
                }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async motionDetection(_id, userID) {
        console.log('....', process.env.ASSETS_PATH);
        try {
            const camera = await this.cameraModel.findById({ _id });
            const rtspUrl = camera.rtspUrl;
            camera.backupMode = false;
            await camera.save();
            console.log(rtspUrl, _id);
            let count = 0;
            if (count === 0) {
                try {
                    await child_process_1.execSync(`mkdir -p -v ${process.env.ASSETS_PATH}/${_id}/detect`);
                }
                catch (error) { }
            }
            const motionDetectTask = await this.taskService.findTaskWithoutUser('1', _id);
            const recordTask = await this.taskService.findTask('0', userID, _id);
            const autorecordTask = await this.taskService.findTask('3', userID, _id);
            if (recordTask) {
                await this.taskService.killTask(recordTask.pID);
            }
            if (autorecordTask) {
                await this.taskService.killTask(autorecordTask.pID);
            }
            if (motionDetectTask) {
                return true;
            }
            const child = child_process_1.spawn('python', [
                'src/python-scripts/motion-detect.py',
                rtspUrl,
                `${process.env.ASSETS_PATH}/${_id}/detect`,
                '1',
            ]);
            console.log('pid', child.pid);
            this.taskService.addTask(_id, child.pid, userID, '1', true);
            let dataToSend = [];
            let filePath = '', timeStart = '', timeEnd = '';
            child.stdout.on('data', async (data) => {
                const output = data.toString().trim();
                console.log('stdout', output);
                console.log("data.toString().split('.').pop()", output.split('.').pop());
                if (output.split('.').pop() === `mp4`) {
                    filePath = output;
                    console.log('files: ', filePath);
                }
                else {
                    dataToSend.push(output);
                    console.log('data to send: ', dataToSend);
                }
                if (dataToSend.length === 2) {
                    timeStart = dataToSend[0];
                    timeEnd = dataToSend[1];
                    dataToSend = [];
                    console.log('time: ', timeStart, timeEnd);
                }
                console.log('cam motion:', filePath, timeStart, timeEnd);
                if (filePath !== '' && timeStart !== '' && timeEnd !== '') {
                    const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${_id}/${filePath}`;
                    console.log(userID, _id, cdnUrl);
                    await this.camMotionService.addOne(userID, rtspUrl, filePath, timeStart, timeEnd, cdnUrl);
                    const filePathTemp = filePath;
                    (filePath = ''), (timeStart = ''), (timeEnd = '');
                    this.uploadVideo(userID, _id, filePathTemp);
                }
            });
            const camMotionService = this.camMotionService;
            child.on('exit', async (code) => {
                console.log('code detect', code);
                try {
                    setTimeout(() => {
                        console.log(`${process.env.ASSETS_PATH}/${_id}/detect`);
                        const files = fs.readdirSync(`${process.env.ASSETS_PATH}/${_id}/detect`);
                        console.log('files', files);
                        if (files.length !== 0) {
                            const d = new Date();
                            const month = d.getMonth() + 1;
                            const now = d.getDate() + '_' + month + '_' + d.getFullYear();
                            fs.readFile(`${process.env.ASSETS_PATH}/${_id}/detect/${files[0]}`, function (err, data) {
                                if (err) {
                                    console.log('fs error', err);
                                }
                                else {
                                    const params = {
                                        Bucket: 'clientapp',
                                        Key: `${_id}/${now}/${files[0]}`,
                                        Body: data,
                                        ContentType: 'video/mp4',
                                        ACL: 'public-read',
                                    };
                                    auth_1.s3.putObject(params, async function (err, data) {
                                        if (err) {
                                            console.log('Error putting object on S3: ', err);
                                        }
                                        else {
                                            const cdnUrl = `https://clientapp.sgp1.digitaloceanspaces.com/${_id}/${now}/${files[0]}`;
                                            console.log();
                                            let duration;
                                            child_process_1.exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${cdnUrl}`, async (error, stdout, stderr) => {
                                                duration = stdout;
                                                console.log('stdout', stdout);
                                                const timeStart = parseInt(dataToSend[0]);
                                                const timeEnd = timeStart +
                                                    1000 * Math.round(parseInt(duration) + 1);
                                                console.log(Math.round(parseInt(duration) + 1));
                                                await camMotionService.addOne(userID, rtspUrl, files[0], timeStart.toString(), timeEnd.toString(), cdnUrl);
                                                console.log('Placed object on S3: ', data);
                                                fs.unlinkSync(`${process.env.ASSETS_PATH}/${_id}/detect/${files[0]}`);
                                                child_process_1.execSync(`rmdir ${process.env.ASSETS_PATH}/${_id}/detect`);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }, 5000);
                }
                catch (error) { }
                const motionModeTask = await this.taskService.findTask('1', userID, _id);
                if (motionModeTask) {
                    await this.taskService.killTask(motionModeTask.pID);
                    console.log('done');
                }
            });
            return true;
        }
        catch (error) {
            false;
        }
    }
    async scanNetwork() {
        const onvif = require('node-onvif');
        const Stream = require('node-rtsp-stream');
        let camera = [];
        const devices = [];
        const streams = [];
        onvif
            .startProbe()
            .then(device_info_list => {
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
                    pass: 'admin',
                });
                devices.push(device);
                device
                    .init()
                    .then(() => {
                    const url = device.getUdpStreamUrl();
                    const stream = new Stream({
                        name: 'name',
                        streamUrl: url,
                        wsPort: 9000 + i,
                    });
                    streams.push(stream);
                    console.log('URL :' + url);
                })
                    .catch(error => {
                    console.error(error);
                });
            });
        })
            .catch(error => {
            console.error(error);
        });
        console.log('cam', camera, 'streams', streams, 'devs', devices);
        return { camera, streams, devices };
    }
    getFileSizInByte(filename) {
        const stats = fs.statSync(filename);
        return stats['size'];
    }
    async uploadVideo(userID, cameraID, filePath) {
        fs.readFile(`${process.env.ASSETS_PATH}/${cameraID}/detect/${filePath}`, function (err, data) {
            if (err) {
                console.log('fs error', err);
            }
            else {
                const params = {
                    Bucket: 'clientapp',
                    Key: `${cameraID}/${filePath}`,
                    Body: data,
                    ContentType: 'video/mp4',
                    ACL: 'public-read',
                };
                auth_1.s3.putObject(params, function (err, data) {
                    if (err) {
                        console.log('Error putting object on S3: ', err);
                    }
                    else {
                        console.log('Placed object on S3: ', data);
                        fs.unlinkSync(`${process.env.ASSETS_PATH}/${cameraID}/detect/${filePath}`);
                    }
                });
            }
        });
    }
    testput() {
        this.recordStreamPerTime('5ed3e22848d6943ed70ec47f', 'rtsp://192.168.1.104:7777/h264_ulaw.sdp', '5e9471d6cbeb62504f03bc0b', 10);
        return true;
    }
    async listVideoByUSer(userID, _id) {
        const { rtspUrl } = await this.cameraModel.findById({ _id });
        const result = await this.camMotionService.getMotionByUser(userID, rtspUrl);
        console.log(result);
        return result;
    }
    async recordedVideoByUser(userID, _id) {
        const result = await this.camRecordService.getMotionByUser(userID, _id);
        console.log(result);
        return result;
    }
    async testHandleTask() {
        try {
            const child = child_process_1.spawn('python', [
                'src/python-scripts/motion-detect.py',
                'rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream',
                process.env.ASSETS_PATH,
                '0',
            ]);
            console.log(await this.taskService.addTask('5ed471308a7ad50c437e9768', child.pid, 'rtsp:123', '0', true));
            child.stdout.on('data', data => {
                console.log(data);
                this.taskService.killTask(child.pid);
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async testConnection(rtspUrl, userID) {
        return new Promise(function (resolve, reject) {
            const child = child_process_1.spawn('python', [
                'src/python-scripts/test-connection.py',
                rtspUrl,
                process.env.ASSETS_PATH,
            ]);
            console.log('pid', child.pid);
            child.stdout.on('data', async (data) => {
                const output = data.toString().trim();
                console.log('stdout', output);
                if (output === '0') {
                    resolve(false);
                }
                if (output.split('.').pop() === `jpg`) {
                    setTimeout(() => {
                        fs.readFile(`${process.env.ASSETS_PATH}/${output}`, function (err, data) {
                            if (err) {
                                console.log('fs error', err);
                            }
                            else {
                                const params = {
                                    Bucket: 'clientapp',
                                    Key: `${rtspUrl}/${output}`,
                                    Body: data,
                                    ACL: 'public-read',
                                    ContentType: 'image/jpeg',
                                };
                                auth_1.s3.putObject(params, function (err, data) {
                                    if (err) {
                                        console.log('Error putting object on S3: ', err);
                                    }
                                    else {
                                        console.log('Placed object on S3: ', data);
                                        setTimeout(() => {
                                            fs.unlinkSync(`${process.env.ASSETS_PATH}/${output}`);
                                        }, 2000);
                                        resolve(`https://clientapp.sgp1.digitaloceanspaces.com/${rtspUrl}/${output}`);
                                    }
                                });
                            }
                        });
                    }, 3000);
                }
            });
        });
    }
};
__decorate([
    schedule_1.Cron('0 */30 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CameraService.prototype, "handleCron", null);
CameraService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Camera')),
    __param(1, common_1.Inject(common_1.forwardRef(() => task_service_1.TaskService))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, user_service_1.UserService,
        task_service_1.TaskService,
        camera_motion_service_1.CameraMotionService,
        camera_record_service_1.CameraRecordService])
], CameraService);
exports.CameraService = CameraService;
//# sourceMappingURL=camera.service.js.map