import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(body: any, res: any): Promise<void>;
    login(res: any, body: any): Promise<any>;
    verifytoken(res: any, body: any): Promise<any>;
}
