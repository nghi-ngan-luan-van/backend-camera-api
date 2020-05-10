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
  import { UserService } from "../user/user.service";
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
      const user = await this.userService.findUserByEmail(body.email);
      if (!user) {
        const result= await this.userService.addOne(body.email,body.name,body.password);
        res.sendStatus(204);
      } else {
        throw new HttpException("Username Exist", 409);
      }
    }
  
    @Post("login")
    async login(@Res() res, @Body() body) {
      if (!(body && body.email && body.password)) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Username and password are required!" });
      }
  
      const user = await this.userService.findUserByEmail(body.email);
  
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

    @Post("verifytoken")
    async verifytoken(@Res() res, @Body() body) {
      if (!(body && body.token)) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Token required!" });
      }
  
      const result = await this.authService.verifyToken(body.token);
  
      if (result) {
        return res
        .status(HttpStatus.OK)
        .json(result);

      }
  
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Token wrong!" });
    }
  }
  