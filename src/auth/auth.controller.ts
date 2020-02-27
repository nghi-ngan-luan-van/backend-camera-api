import {
    Controller,
    Get,
    Req,
    Res,
    Post,
    Body,
    HttpCode,
    Header,
    HttpException,
    HttpStatus,
    Param
  } from "@nestjs/common";
  import { UserService } from "src/user/user.service";
  import { AuthService } from "./auth.service";
  
  @Controller("auth")
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService
    ) {}
  
    @Post("register")
    @HttpCode(204)
    @Header("Content-Type", "application/json")
    async register(@Body() body, @Res() res) {
      const user = await this.userService.findOne(body.username);
      console.log(user);
      console.log(body)
      if (!user) {
        this.userService.addOne(body);
        res.sendStatus(204);
      } else {
        throw new HttpException("Username Exist", 409);
      }
    }
  
    @Post("login")
    async login(@Res() res, @Body() body) {
      if (!(body && body.username && body.password)) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Username and password are required!" });
      }
  
      const user = await this.userService.findOne(body.username);
  
      if (user) {
        if (await this.userService.compareHash(body.password, user.password)) {
          return res
            .status(HttpStatus.OK)
            .json(await this.authService.createToken(user._id));
        }
      }
  
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Username or password wrong!" });
    }
  }
  