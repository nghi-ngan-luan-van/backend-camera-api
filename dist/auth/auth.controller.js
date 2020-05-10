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
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async register(body, res) {
        const user = await this.userService.findUserByEmail(body.email);
        if (!user) {
            const result = await this.userService.addOne(body.email, body.name, body.password);
            res.sendStatus(204);
        }
        else {
            throw new common_1.HttpException("Username Exist", 409);
        }
    }
    async login(res, body) {
        if (!(body && body.email && body.password)) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Username and password are required!" });
        }
        const user = await this.userService.findUserByEmail(body.email);
        if (user) {
            if (await this.userService.compareHash(body.password, user.password)) {
                return res
                    .status(common_1.HttpStatus.OK)
                    .json(await this.authService.createToken(user._id));
            }
        }
        return res
            .status(common_1.HttpStatus.FORBIDDEN)
            .json({ message: "Username or password wrong!" });
    }
    async verifytoken(res, body) {
        if (!(body && body.token)) {
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ message: "Token required!" });
        }
        const result = await this.authService.verifyToken(body.token);
        if (result) {
            return res
                .status(common_1.HttpStatus.OK)
                .json(result);
        }
        return res
            .status(common_1.HttpStatus.FORBIDDEN)
            .json({ message: "Token wrong!" });
    }
};
__decorate([
    common_1.Post("register"),
    common_1.HttpCode(204),
    common_1.Header("Content-Type", "application/json"),
    __param(0, common_1.Body()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    common_1.Post("login"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.Post("verifytoken"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifytoken", null);
AuthController = __decorate([
    common_1.Controller("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map