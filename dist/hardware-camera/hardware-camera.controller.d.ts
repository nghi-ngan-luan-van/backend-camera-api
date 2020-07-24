import { HardwareCameraService } from './hardware-camera.service';
export declare class HardwareCameraController {
    private readonly hardwareCameraService;
    constructor(hardwareCameraService: HardwareCameraService);
    addCamera(body: any, res: any, req: any): Promise<any>;
    allCam(req: any, res: any): Promise<any>;
}
