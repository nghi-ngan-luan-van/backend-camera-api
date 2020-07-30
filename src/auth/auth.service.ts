import * as jwt from "jsonwebtoken";

import { Injectable, HttpException } from "@nestjs/common";
import { UserService } from "../user/user.service";
const { OAuth2Client } = require('google-auth-library');

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

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
    const user = await this.userService.findUserByID(decoded.userID)
    if (!user) {
      throw new HttpException("Invalid Token", 403);
    }
    return user;
  }

  async googleSignIn(idToken) {
    const client = new OAuth2Client('136433114251-j3plam2goeoqaifnhj2umab2tuib4mts.apps.googleusercontent.com');
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: '136433114251-j3plam2goeoqaifnhj2umab2tuib4mts.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      console.log(userid)
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    }
    verify().catch(console.error);
    return true
  }
}
