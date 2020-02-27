import {
    Controller,
    Get,
    Req,
    Res,
    Post,
    Body,
    HttpCode,
    Header,
    Param
  } from "@nestjs/common";
  import { UserService } from "./user.service";
  
  @Controller("user")
  export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get(":username")
    getUser(@Param("username") param) {
      return this.userService.findOne(param);
    }
    @Get()
    getAllUser() {
      return this.userService.findAll();
    }
  }
  