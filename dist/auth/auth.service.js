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
exports.AuthService = void 0;
const jwt = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userService) {
        this.userService = userService;
    }
    async createToken(id) {
        const expiresIn = 60 * 60;
        const secretOrKey = "secret";
        const user = { userID: id };
        const token = jwt.sign(user, secretOrKey, { expiresIn });
        return { expires_in: expiresIn, token };
    }
    async validateUser(signedUser) {
        if (signedUser && signedUser.email) {
            return Boolean(this.userService.findUserByEmail(signedUser.email));
        }
        return false;
    }
    async verifyToken(token) {
        const decoded = jwt.verify(token, "secret");
        if (!decoded.userID) {
            throw new common_1.HttpException("Invalid Token", 403);
        }
        const user = await this.userService.findUserByID(decoded.userID);
        if (!user) {
            throw new common_1.HttpException("Invalid Token", 403);
        }
        return user;
    }
    async googleSignIn(idToken) {
        return true;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map