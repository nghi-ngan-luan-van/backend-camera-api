"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const hardware_camera_controller_1 = require("./hardware-camera.controller");
const hardware_camera_service_1 = require("./hardware-camera.service");
const mongoose_1 = require("@nestjs/mongoose");
const hardware_camera_model_1 = require("./hardware-camera.model");
const user_module_1 = require("../user/user.module");
let HardwareCameraModule = class HardwareCameraModule {
};
HardwareCameraModule = __decorate([
    common_1.Module({
        imports: [user_module_1.UserModule, mongoose_1.MongooseModule.forFeature([{ name: 'HardwareCamera', schema: hardware_camera_model_1.HardwareCameraSchema }])],
        controllers: [hardware_camera_controller_1.HardwareCameraController],
        providers: [hardware_camera_service_1.HardwareCameraService],
        exports: [hardware_camera_service_1.HardwareCameraService]
    })
], HardwareCameraModule);
exports.HardwareCameraModule = HardwareCameraModule;
//# sourceMappingURL=hardware-camera.module.js.map