import { Controller, Post, UseGuards, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { HardwareCameraService } from './hardware-camera.service';
import { AuthGuard } from '../auth.guard';

@Controller('hardware-camera')
export class HardwareCameraController {

    constructor(private readonly hardwareCameraService: HardwareCameraService,
      ) { }

    @Post('add')
    @UseGuards(AuthGuard)
    async addCamera(@Body() body, @Res() res,@Req() req) {
      const { rtspUrl} = body
      if (!body) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "RTSP url are required!" });
      }
      const userID = req.userID;
      const result= await this.hardwareCameraService.addOne(rtspUrl)
      if (result) {
        return res
        .status(HttpStatus.OK)
        .json(result);
      }
      else {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Cannot add hardware camera" });
      }
    }
}
