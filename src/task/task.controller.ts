import { Controller, Req, Body, Res, Post, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService,
      ) { }
    
      @Post("killtask")
  // @UseGuards(AuthGuard)
    async killTask(@Req() req, @Body() body, @Res() res) {
    const {url} =body
    const data= await this.taskService.killTask(url)
    
     console.log(data)
    if(data)
    {
      res.send(data)
    }
    else {
      res.send('fail')
    }
  }
}
