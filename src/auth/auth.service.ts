import * as jwt from "jsonwebtoken";

import { Injectable, HttpException } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(id: string) {
    const expiresIn = 60 * 60;
    const secretOrKey = "secret";
    const user = { userID: id };
    const token = jwt.sign(user, secretOrKey, { expiresIn });

    return { expires_in: expiresIn, token };
  }

  async validateUser(signedUser): Promise<boolean> {
    if (signedUser && signedUser.email) {
      return Boolean(this.userService.findUserByEmail(signedUser.email));
    }
    return false;
  }
  
  async verifyToken(token) {
    const decoded = jwt.verify(token, "secret");
    if (!decoded.userID) {
      throw new HttpException("Invalid Token", 403);
    }
    if (!this.userService.findUserByID(decoded.userID)) {
      throw new HttpException("Invalid Token", 403);
    }
    return decoded.userID;
  }
}
