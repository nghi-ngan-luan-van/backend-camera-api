import { TaskService } from './task.service';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    killTask(req: any, body: any, res: any): Promise<void>;
}
