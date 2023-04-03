import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { User } from "./interface";
import { CreateUserDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new UserEntity();
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    return await this.userRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username });
  }
}
