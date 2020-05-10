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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth.guard");
const user_service_1 = require("../user/user.service");
const camera_service_1 = require("./camera.service");
let CameraController = class CameraController {
    constructor(userService, cameraService) {
        this.userService = userService;
        this.cameraService = cameraService;
    }
    getPublic() {
        return "public content";
    }
    getProtected(req) {
        const userID = req.userID;
        return `private content of ${userID}`;
    }
    async addCamera(body, res, req) {
        const { name = '', rtspUrl = '', ip = '', port = '', username = '', password = '' } = body;
        if (!(body)) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Camera are required!" });
        }
        const userID = req.userID;
        const result = await this.cameraService.addOne(userID, name, password, username, ip, port, rtspUrl);
        if (result) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(result);
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Cannot add camera" });
        }
    }
    async getListByUser(req, res) {
        const userID = req.userID;
        const result = await this.cameraService.getCamerasByUser(userID);
        if (result) {
            return res
                .status(common_1.HttpStatus.OK)
                .json({ result });
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Cannot return camera" });
        }
    }
    async recordFullStream(req, body, res) {
        const { url } = body;
        if (!(body && body.url)) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Rtsp url is required!" });
        }
        if (this.cameraService.recordFullStream(url)) {
            return res
                .status(common_1.HttpStatus.OK)
                .json({ message: "Successful" });
        }
        else {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Fail " });
        }
    }
    async recordPerTime(req, body, res) {
        const { url, time } = body;
        if (this.cameraService.recordStreamPerTime(url, time)) {
            res.send('ok');
        }
        else {
            res.send('fail');
        }
    }
    async turnDetect(req, body, res) {
        const { url } = body;
        const userID = req.userID;
        if (!(body && body.url)) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Rtsp url is required!" });
        }
        const data = await this.cameraService.motionDection(url, userID);
        console.log(data);
        if (data) {
            return res
                .status(common_1.HttpStatus.OK)
                .json({ message: "Successful" });
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Fail " });
        }
    }
    async scannetworkk(req, body, res) {
        const data = await this.cameraService.scanNetwork();
        if (data) {
            return data;
        }
        else {
            return null;
        }
    }
    async testput(req, body, res) {
        const data = this.cameraService.testput();
        if (data) {
            return data;
        }
        else {
            return null;
        }
    }
    async listVideoByUser(req, body, res) {
        const userID = req.userID;
        const { _id } = body;
        if (!(body && body._id)) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Rtsp url is required!" });
        }
        const result = await this.cameraService.listVideoByUSer(userID, _id);
        if (this.userService.findUserByID(userID)) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(result);
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Fail " });
        }
    }
};
__decorate([
    common_1.Get("public"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CameraController.prototype, "getPublic", null);
__decorate([
    common_1.Get("protected"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CameraController.prototype, "getProtected", null);
__decorate([
    common_1.Post('add'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()), __param(1, common_1.Res()), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "addCamera", null);
__decorate([
    common_1.Get("listcam"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "getListByUser", null);
__decorate([
    common_1.Post("recordfull"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "recordFullStream", null);
__decorate([
    common_1.Post("recordpertime"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "recordPerTime", null);
__decorate([
    common_1.Post("turndetect"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "turnDetect", null);
__decorate([
    common_1.Get("scannetwork"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "scannetworkk", null);
__decorate([
    common_1.Post("testput"),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "testput", null);
__decorate([
    common_1.Post("savedvideo"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "listVideoByUser", null);
CameraController = __decorate([
    common_1.Controller('camera'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        camera_service_1.CameraService])
], CameraController);
exports.CameraController = CameraController;
//# sourceMappingURL=camera.controller.js.map