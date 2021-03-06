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
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUser(param) {
        return this.userService.findUserByID(param);
    }
    addUser(body, res) {
        const { user } = body;
        if (this.userService.addOne(user.name, user.password, user.email)) {
            res.send('ok');
        }
        else {
            res.send('fail');
        }
    }
    updateUser(param, body, res) {
        const { user } = body;
        if (this.userService.updateOne(param, user.name)) {
            res.send('ok');
        }
        else {
            res.send('fail');
        }
    }
    deleteUser(param, res) {
        if (this.userService.deleteOne(param)) {
            res.send('ok');
        }
        else {
            res.send('fail');
        }
    }
    async mailReset(body, res) {
        const { email } = body;
        const result = await this.userService.sendMailReset(email);
        if (result) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(true);
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Cannot send email" });
        }
    }
    async resetPassword(body, res) {
        const { token, newPassword } = body;
        if (await this.userService.checkTokenReset(token, newPassword)) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(true);
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Cannot reset password" });
        }
    }
    async changePassword(body, res) {
        const { id, newPassword, oldPassword } = body;
        if (await this.userService.changePassword(id, newPassword, oldPassword)) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(true);
        }
        else {
            res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Cannot change password" });
        }
    }
    getAllUser() {
        return this.userService.getUsers();
    }
};
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    common_1.Post('add'),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "addUser", null);
__decorate([
    common_1.Post('update:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUser", null);
__decorate([
    common_1.Post('delete:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    common_1.Post('mailReset'),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "mailReset", null);
__decorate([
    common_1.Post('resetPassword'),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    common_1.Post('changePassword'),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAllUser", null);
UserController = __decorate([
    common_1.Controller("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map