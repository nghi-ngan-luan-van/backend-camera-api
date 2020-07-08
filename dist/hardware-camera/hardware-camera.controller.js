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
exports.HardwareCameraController = void 0;
const common_1 = require("@nestjs/common");
const hardware_camera_service_1 = require("./hardware-camera.service");
const auth_guard_1 = require("../auth.guard");
let HardwareCameraController = class HardwareCameraController {
    constructor(hardwareCameraService) {
        this.hardwareCameraService = hardwareCameraService;
    }
    async addCamera(body, res, req) {
        const { rtspUrl } = body;
        if (!body) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "RTSP url are required!" });
        }
        const userID = req.userID;
        const result = await this.hardwareCameraService.addOne(rtspUrl);
        if (result) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(result);
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Cannot add hardware camera" });
        }
    }
};
__decorate([
    common_1.Post('add'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()), __param(1, common_1.Res()), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], HardwareCameraController.prototype, "addCamera", null);
HardwareCameraController = __decorate([
    common_1.Controller('hardware-camera'),
    __metadata("design:paramtypes", [hardware_camera_service_1.HardwareCameraService])
], HardwareCameraController);
exports.HardwareCameraController = HardwareCameraController;
//# sourceMappingURL=hardware-camera.controller.js.map