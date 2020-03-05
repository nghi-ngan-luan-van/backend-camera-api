import { Controller, Get, UseGuards, Req, Res, Post, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { UserService } from 'src/user/user.service';
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

  @Get("listcam")
  @UseGuards(AuthGuard)
  async getListByUser(@Req() req, @Res() res) {
    const user= await this.userService.findOneByID(req.userID)
    const listCameras=await this.cameraService.findCamerasByUser(user.username)
    res.send(listCameras)
  }

  @Post("recordfull")
  // @UseGuards(AuthGuard)
  async recordFullStream(@Req() req, @Body() body, @Res() res) {
    const {url}=body
    if(this.cameraService.recordFullStream(url))
    {
      res.send('ok')
    }
    else {
      res.send('fail')
    }
  }
  

  @Post("recordpertime")
  // @UseGuards(AuthGuard)
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
    const data= await this.cameraService.turnMotionDetect(url)
    // console.log(data)
    if(data)
    {
      res.send(data)
    }
    else {
      res.send('fail')
    }
  }
}
