import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";

export type User = any;

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        _id: uuid.v4(),
        name: "john wick",
        username: "john",
        password: "changeme"
      },
      {
        _id: uuid.v4(),
        name: "chris evans",
        username: "chris",
        password: "secret"
      },
      {
        _id: uuid.v4(),
        name: "tony stark",
        username: "tony",
        password: "guess"
      }
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async findOneByID(id: string): Promise<User | undefined> {
    return this.users.find(user => user._id === id);
  }

  async findAll() {
    return this.users;
  }

  async addOne(user: User): Promise<User> {
    user._id =uuid.v4(),
    user.password = await this.getHash(user.password);
    return this.users.push(user);
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
