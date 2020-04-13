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
    async getListByUser(req, res) {
    }
    async recordFullStream(req, body, res) {
        const { url } = body;
        if (this.cameraService.recordFullStream(url)) {
            res.send('ok');
        }
        else {
            res.send('fail');
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
        const data = await this.cameraService.motionDection(url);
        console.log(data);
        if (data) {
            res.send(data);
        }
        else {
            res.send('fail');
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
    common_1.Get("listcam"),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "getListByUser", null);
__decorate([
    common_1.Post("recordfull"),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "recordFullStream", null);
__decorate([
    common_1.Post("recordpertime"),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "recordPerTime", null);
__decorate([
    common_1.Post("turndetect"),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "turnDetect", null);
__decorate([
    common_1.Get("scannetwork"),
    __param(0, common_1.Req()), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CameraController.prototype, "scannetworkk", null);
CameraController = __decorate([
    common_1.Controller('camera'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        camera_service_1.CameraService])
], CameraController);
exports.CameraController = CameraController;
//# sourceMappingURL=camera.controller.js.map