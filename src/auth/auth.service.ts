import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/interface";
import { ValidateUser } from "./dto";
import { UserResponse } from "./interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(validateUser: ValidateUser): Promise<any> {
    const user = await this.usersService.findOne(validateUser.username);

    if (user && user.password === validateUser.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<UserResponse> {
    const payload = { username: user.username, sub: user.id };

    return {
      jwt: this.jwtService.sign(payload),
      user: user,
    };
  }
}
