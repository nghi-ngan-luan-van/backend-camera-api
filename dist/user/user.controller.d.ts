import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(param: any): Promise<import("./user.model").User>;
    addUser(body: any, res: any): void;
    updateUser(param: any, body: any, res: any): void;
    deleteUser(param: any, res: any): void;
    mailReset(body: any, res: any): any;
    changePassword(body: any, res: any): any;
    getAllUser(): Promise<any>;
}
