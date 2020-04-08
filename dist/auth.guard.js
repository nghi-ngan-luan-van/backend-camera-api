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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const user_service_1 = require("./user/user.service");
let AuthGuard = class AuthGuard {
    constructor(userService) {
        this.userService = userService;
    }
    canActivate(context) {
        try {
            const req = context.switchToHttp().getRequest();
            if (req.headers.authorization.split(" ")[0] !== "Bearer") {
                throw new common_1.HttpException("Invalid Token", 403);
            }
            const token = req && req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "secret");
            if (!decoded) {
                throw new common_1.HttpException("Invalid Token", 403);
            }
            if (!this.userService.findUserByID(decoded.userID)) {
                throw new common_1.HttpException("Invalid Token", 403);
            }
            req.userID = decoded.userID;
            return true;
        }
        catch (_a) {
            throw new common_1.HttpException("Invalid Token", 403);
        }
    }
};
AuthGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map