import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import { BasicAuthGuard } from "../auth/basic-auth.guard";
import { UsersService } from "./users.service";
import { User } from "./interface";
import { CreateUserDto } from "./dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
