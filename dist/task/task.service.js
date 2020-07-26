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
const camera_service_1 = require("../camera/camera.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TaskService = class TaskService {
    constructor(taskModel, cameraService) {
        this.taskModel = taskModel;
        this.cameraService = cameraService;
        this.tasks = [];
    }
    async findTask(taskType, user, idCamera) {
        const task = await this.taskModel.findOne({ taskType, user, idCamera });
        return task;
    }
    async findTaskWithoutUser(taskType, idCamera) {
        const task = await this.taskModel.findOne({ taskType, idCamera });
        return task;
    }
    async addTask(idCamera, pID, user, taskType, active) {
        try {
            const newTask = new this.taskModel({
                idCamera,
                pID,
                user,
                taskType,
                active
            });
            const result = await newTask.save();
            return result;
        }
        catch (error) {
            return null;
        }
    }
    async killTask(pid) {
        const task = await this.taskModel.findOne({ pID: pid });
        if (task) {
            if (require('is-running')(pid)) {
                process.kill(pid);
            }
            await this.taskModel.deleteOne({ pID: pid });
            return true;
        }
        else
            return false;
    }
};
TaskService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Task')),
    __param(1, common_1.Inject(common_1.forwardRef(() => camera_service_1.CameraService))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, camera_service_1.CameraService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map