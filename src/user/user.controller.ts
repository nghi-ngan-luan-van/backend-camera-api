import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  HttpCode,
  Header,
  Param,
  HttpStatus
} from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get(":id")
  getUser(@Param("id") param) {
    return this.userService.findUserByID(param);
  }

  @Post('add')
  addUser(@Body() body, @Res() res) {
    const { user } = body
    if (this.userService.addOne(user.name, user.password,user.email)) {
      res.send('ok')
    }
    else {
      res.send('fail')
    }
  }
  @Post('update:id')
  updateUser(@Param('id') param,@Body() body, @Res() res) {
    const { user } = body
    if (this.userService.updateOne(param,user.name)) {
      res.send('ok')
    }
    else {
      res.send('fail')
    }
  }

  @Post('delete:id')
  deleteUser(@Param('id') param, @Res() res) {
    if (this.userService.deleteOne(param)) {
      res.send('ok')
    }
    else {
      res.send('fail')
    }
  }
  @Post('mailReset')
  mailReset(@Body() body, @Res() res) {
    const { email } = body
    if (this.userService.sendMailReset(email)) {
      return res
      .status(HttpStatus.OK)
      .json(true);
    }
    else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Cannot send email" });
    }
  }
   
  @Post('changePassword')
  changePassword(@Body() body, @Res() res) {
    const { id,newPassword } = body
    if (this.userService.changePassword(id,newPassword)) {
      return res
      .status(HttpStatus.OK)
      .json(true);
    }
    else {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Cannot change password" });
    }
  }

  @Get()
  getAllUser() {
    return this.userService.getUsers();
  }
}
