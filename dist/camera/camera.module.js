"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const camera_controller_1 = require("./camera.controller");
const user_module_1 = require("../user/user.module");
const camera_service_1 = require("./camera.service");
const mongoose_1 = require("@nestjs/mongoose");
const camera_model_1 = require("./camera.model");
const task_module_1 = require("../task/task.module");
let CameraModule = class CameraModule {
};
CameraModule = __decorate([
    common_1.Module({
        imports: [common_1.forwardRef(() => task_module_1.TaskModule), user_module_1.UserModule, mongoose_1.MongooseModule.forFeature([{ name: 'Camera', schema: camera_model_1.CameraSchema }])],
        controllers: [camera_controller_1.CameraController],
        providers: [camera_service_1.CameraService],
        exports: [camera_service_1.CameraService]
    })
], CameraModule);
exports.CameraModule = CameraModule;
//# sourceMappingURL=camera.module.js.map