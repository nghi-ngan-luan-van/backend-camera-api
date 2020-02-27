import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';

@Controller('camera')
export class CameraController {
    @Get("public")
  getPublic() {
    return "public content";
  }

  @Get("protected")
  @UseGuards(AuthGuard)
  getProtected(@Req() req) {
    const  userID  = req.userID;
    return `private content of ${userID}`;
  }

}
