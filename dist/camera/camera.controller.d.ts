import { UserService } from '../user/user.service';
import { CameraService } from './camera.service';
export declare class CameraController {
    private readonly userService;
    private readonly cameraService;
    constructor(userService: UserService, cameraService: CameraService);
    getPublic(): string;
    getProtected(req: any): string;
    getListByUser(req: any, res: any): Promise<void>;
    recordFullStream(req: any, body: any, res: any): Promise<void>;
    recordPerTime(req: any, body: any, res: any): Promise<void>;
    turnDetect(req: any, body: any, res: any): Promise<void>;
}
