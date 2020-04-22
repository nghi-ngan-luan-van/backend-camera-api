import { CameraService } from 'src/camera/camera.service';
export declare class TaskService {
    private readonly cameraService;
    private tasks;
    constructor(cameraService: CameraService);
    getTasks(): any[];
    findTask: (id: any) => any;
    addTask(id: any): Promise<boolean>;
    killTask(url: string): Promise<boolean>;
}
