import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

// TODO 適切な場所に移動
export type User = {
  name: string;
  password: string;
};

export type UserResponse = {
  jwt: string;
  user: User;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<UserResponse> {
    const payload = { username: user.username, sub: user.userId };

    return {
      jwt: this.jwtService.sign(payload),
      user: { name: user.username, password: user.password },
    };
  }
}
