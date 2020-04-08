import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(param: any): Promise<import("./user.model").User>;
    getAllUser(): Promise<any>;
}
