"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const camera_motion_controller_1 = require("./camera-motion.controller");
const camera_motion_service_1 = require("./camera-motion.service");
const camera_module_1 = require("../camera/camera.module");
let CameraMotionModule = class CameraMotionModule {
};
CameraMotionModule = __decorate([
    common_1.Module({
        imports: [camera_module_1.CameraModule],
        controllers: [camera_motion_controller_1.CameraMotionController],
        providers: [camera_motion_service_1.CameraMotionService],
        exports: [camera_motion_service_1.CameraMotionService]
    })
], CameraMotionModule);
exports.CameraMotionModule = CameraMotionModule;
//# sourceMappingURL=camera-motion.module.js.map