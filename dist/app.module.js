"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const camera_module_1 = require("./camera/camera.module");
const mongoose_1 = require("@nestjs/mongoose");
const task_module_1 = require("./task/task.module");
const camera_motion_module_1 = require("./camera-motion/camera-motion.module");
const hardware_camera_module_1 = require("./hardware-camera/hardware-camera.module");
const camera_record_module_1 = require("./camera-record/camera-record.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [user_module_1.UserModule, auth_module_1.AuthModule, camera_module_1.CameraModule,
            mongoose_1.MongooseModule.forRoot(process.env.MONGOLAB_URI || 'mongodb+srv://phuongnghi:r23AQLOpXter29tn@cluster0-kfdw8.mongodb.net/camera-db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }),
            task_module_1.TaskModule,
            camera_motion_module_1.CameraMotionModule,
            hardware_camera_module_1.HardwareCameraModule,
            camera_record_module_1.CameraRecordModule,
            schedule_1.ScheduleModule.forRoot()
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map