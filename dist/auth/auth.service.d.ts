import { UserService } from "../user/user.service";
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    createToken(id: string): Promise<{
        expires_in: number;
        token: any;
    }>;
    validateUser(signedUser: any): Promise<boolean>;
    verifyToken(token: any): Promise<any>;
}
