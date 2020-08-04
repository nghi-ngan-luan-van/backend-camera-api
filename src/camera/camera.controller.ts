import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { UserService } from '../user/user.service';
import { CameraService } from './camera.service';
import { HardwareCameraService } from 'src/hardware-camera/hardware-camera.service';

@Controller('camera')
export class CameraController {
  constructor(
    private readonly userService: UserService,
    private readonly cameraService: CameraService,
  ) {}

  @Get('public')
  getPublic() {
    return 'public content';
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  getProtected(@Req() req) {
    const userID = req.userID;
    return `private content of ${userID}`;
  }

  @Post('add')
  @UseGuards(AuthGuard)
  async addCamera(@Body() body, @Res() res, @Req() req) {
    const { name, rtspUrl, ip, port, username, password, thumbnail } = body;
    if (!body) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Camera are required!' });
    }
    const userID = req.userID;
    const found = await this.cameraService.findCameraByRTSPName(
      rtspUrl,
      userID,
    );
    console.log(found);
    if (!found) {
      const result = await this.cameraService.addOne(
        userID,
        username,
        name,
        password,
        ip,
        port,
        rtspUrl,
        thumbnail,
      );
      if (result) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        res.status(HttpStatus.FORBIDDEN).json({ message: 'Cannot add camera' });
      }
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Camera exist' });
    }
  }

  @Post('edit')
  @UseGuards(AuthGuard)
  async editCamera(@Body() body, @Res() res, @Req() req) {
    const {
      _id,
      name,
      rtspUrl,
      ip,
      port,
      username,
      password,
      backupMode,
    } = body;
    if (!body || !body._id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Camera id are required!' });
    }
    const userID = req.userID;
    const result = await this.cameraService.updateOne(
      _id,
      username,
      name,
      password,
      ip,
      port,
      rtspUrl,
      backupMode,
    );
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Cannot edit camera' });
    }
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  async deleteCamera(@Body() body, @Res() res, @Req() req) {
    const { _id } = body;
    if (!body || !body._id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Camera id are required!' });
    }
    const userID = req.userID;
    const result = await this.cameraService.deleteOne(_id);
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Cannot delete camera' });
    }
  }
  @Get('listcam')
  @UseGuards(AuthGuard)
  async getListByUser(@Req() req, @Res() res) {
    const userID = req.userID;
    const result = await this.cameraService.getCamerasByUser(userID);
    if (result) {
      return res.status(HttpStatus.OK).json({ result });
    } else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Cannot return camera' });
    }
  }
  @Get('allcam')
  //@UseGuards(AuthGuard)
  async allCam(@Req() req, @Res() res) {
    const userID = req.userID;
    const result = await this.cameraService.getCameras();
    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Cannot return camera' });
    }
  }
  @Post('recordfull')
  @UseGuards(AuthGuard)
  async recordFullStream(@Req() req, @Body() body, @Res() res) {
    const { url } = body;
    if (!(body && body.url)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Rtsp url is required!' });
    }

    if (this.cameraService.recordFullStream(url)) {
      return res.status(HttpStatus.OK).json({ message: 'Successful' });
    } else {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Fail ' });
    }
  }

  // @Post("recordpertime")
  // @UseGuards(AuthGuard)
  // async recordPerTime(@Req() req, @Body() body, @Res() res) {
  //   const {url,time}=body
  //   if(this.cameraService.recordStreamPerTime(url,time))
  //   {
  //     res.send('ok')
  //   }
  //   else {
  //     res.send('fail')
  //   }
  // }

  @Post('turndetect')
  @UseGuards(AuthGuard)
  async turnDetect(@Req() req, @Body() body, @Res() res) {
    const { _id } = body;
    const userID = req.userID;
    if (!(body && body._id)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: ' _id are required!' });
    }
    const data = await this.cameraService.motionDetection(_id, userID);
    console.log(data);
    if (data) {
      return res.status(HttpStatus.OK).json({ message: 'Successful' });
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Fail ' });
    }
  }

  @Post('recorddetect')
  @UseGuards(AuthGuard)
  async recordDetection(@Req() req, @Body() body, @Res() res) {
    const { _id, time } = body;
    const userID = req.userID;
    if (!(body && body._id && body.time)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: ' _id are required!' });
    }
    const data = await this.cameraService.recordDetection(
      _id,
      userID,
      parseInt(time),
    );
    console.log(data);
    if (data) {
      return res.status(HttpStatus.OK).json({ message: 'Successful' });
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Fail ' });
    }
  }

  @Get('scannetwork')
  @UseGuards(AuthGuard)
  async scannetworkk(@Req() req, @Body() body, @Res() res) {
    const data = await this.cameraService.scanNetwork();
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  @Post('testput')
  // @UseGuards(AuthGuard)
  async testput(@Req() req, @Body() body, @Res() res) {
    const data = this.cameraService.testput();
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  @Post('testhandletask')
  // @UseGuards(AuthGuard)
  async testhandletask(@Req() req, @Body() body, @Res() res) {
    const data = this.cameraService.testHandleTask();
    if (data) {
      return data;
    } else {
      return null;
    }
  }
  @Get('savedvideo/:id')
  @UseGuards(AuthGuard)
  async listVideoByUser(@Req() req, @Param('id') id, @Res() res) {
    const userID = req.userID;
    if (!id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'ID is required!' });
    }

    const result = await this.cameraService.listVideoByUSer(userID, id);
    if (this.userService.findUserByID(userID)) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Fail ' });
    }
  }

  @Get('recordedvideo/:id')
  @UseGuards(AuthGuard)
  async recordedvideoByUser(@Req() req, @Param('id') id, @Res() res) {
    const userID = req.userID;
    console.log(id);
    if (!id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'ID is required!' });
    }

    const result = await this.cameraService.recordedVideoByUser(userID, id);
    if (this.userService.findUserByID(userID)) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Fail ' });
    }
  }

  @Post('testconnection')
  @UseGuards(AuthGuard)
  async testConnection(@Req() req, @Body() body, @Res() res) {
    const userID = req.userID;
    const { rtspUrl } = body;
    if (!(body && body.rtspUrl)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'rtsp url is required!' });
    }

    const result = await this.cameraService.testConnection(rtspUrl, userID);
    console.log(result);
    if (result) {
      return res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Fail ' });
    }
  }
}
