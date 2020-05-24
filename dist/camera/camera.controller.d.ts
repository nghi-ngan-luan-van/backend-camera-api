import { UserService } from '../user/user.service';
import { CameraService } from './camera.service';
export declare class CameraController {
    private readonly userService;
    private readonly cameraService;
    constructor(userService: UserService, cameraService: CameraService);
    getPublic(): string;
    getProtected(req: any): string;
    addCamera(body: any, res: any, req: any): Promise<any>;
    editCamera(body: any, res: any, req: any): Promise<any>;
    getListByUser(req: any, res: any): Promise<any>;
    recordFullStream(req: any, body: any, res: any): Promise<any>;
    recordPerTime(req: any, body: any, res: any): Promise<void>;
    turnDetect(req: any, body: any, res: any): Promise<any>;
    scannetworkk(req: any, body: any, res: any): Promise<any>;
    testput(req: any, body: any, res: any): Promise<true>;
    listVideoByUser(req: any, body: any, res: any): Promise<any>;
}
