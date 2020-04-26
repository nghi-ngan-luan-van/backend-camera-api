import { Controller, Get, UseGuards, Req, Res, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { UserService } from '../user/user.service';
import { CameraService } from './camera.service';


@Controller('camera')
export class CameraController {

  constructor(private readonly userService: UserService,
    private readonly cameraService: CameraService
  ) { }

  @Get("public")
  getPublic() {
    return "public content";
  }

  @Get("protected")
  @UseGuards(AuthGuard)
  getProtected(@Req() req) {
    const userID = req.userID;
    return `private content of ${userID}`;
  }

  @Post('add')
  @UseGuards(AuthGuard)
  async addCamera(@Body() body, @Res() res,@Req() req) {
    const { camera } = body
    if (!(body && body.camera)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Camera are required!" });
    }
    const userID = req.userID;
    const result= await this.cameraService.addOne(userID,camera.name, camera.password, camera.username, camera.ip, camera.port, camera.rtspUrl)
    if (result) {
      return res
      .status(HttpStatus.OK)
      .json(result);
    }
    else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Cannot add camera" });
    }
  }

  @Get("listcam")
  @UseGuards(AuthGuard)
  async getListByUser(@Req() req, @Res() res) {
    const userID = req.userID;
    const result= await this.cameraService.getCamerasByUser(userID)
    if (result) {
      return res
      .status(HttpStatus.OK)
      .json(result);
    }
    else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Cannot return camera" });
    }
  }

  @Post("recordfull")
  @UseGuards(AuthGuard)
  async recordFullStream(@Req() req, @Body() body, @Res() res) {
    const {url}=body
    if (!(body && body.url)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Rtsp url is required!" });
    }

    if(this.cameraService.recordFullStream(url))
    {
      return res
      .status(HttpStatus.OK)
      .json({ message: "Successful" });
    }
    else {
      return res
      .status(HttpStatus.FORBIDDEN)
      .json({ message: "Fail " });
    }
  }
  

  @Post("recordpertime")
  @UseGuards(AuthGuard)
  async recordPerTime(@Req() req, @Body() body, @Res() res) {
    const {url,time}=body
    if(this.cameraService.recordStreamPerTime(url,time))
    {
      res.send('ok')
    }
    else {
      res.send('fail')
    }
  }

  @Post("turndetect")
  // @UseGuards(AuthGuard)
  async turnDetect(@Req() req, @Body() body, @Res() res) {
    const {url}=body
    if (!(body && body.url)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Rtsp url is required!" });
    }
    const data= await this.cameraService.motionDection(url)
     console.log(data)
    if(data)
    {
      return res
      .status(HttpStatus.OK)
      .json({ message: "Successful" });
    }
    else {
      res
      .status(HttpStatus.FORBIDDEN)
      .json({ message: "Fail " });
    }
  }

  @Get("scannetwork")
  @UseGuards(AuthGuard)
  async scannetworkk(@Req() req, @Body() body, @Res() res) {
    const data= await this.cameraService.scanNetwork()
    if(data)
    {
     return data
    }
    else {
      return null
    }
  }
}
