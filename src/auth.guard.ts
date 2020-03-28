import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException
} from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";
import { decode } from "punycode";

import { UserService } from "./user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      if (req.headers.authorization.split(" ")[0] !== "Bearer") {
        throw new HttpException("Invalid Token", 403);
      }
      const token = req && req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret");
      if (!decoded) {
        throw new HttpException("Invalid Token", 403);
      }
      if (!this.userService.findUserByID(decoded.userID)) {
        throw new HttpException("Invalid Token", 403);
      }
      req.userID = decoded.userID;
      return true;
    
    }
   catch {
    throw new HttpException("Invalid Token", 403);
   }

  }
}
