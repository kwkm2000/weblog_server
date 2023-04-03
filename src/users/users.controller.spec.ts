import { Test } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { BasicAuthGuard } from "../auth/basic-auth.guard";
import { User } from "./interface";
import { CreateUserDto } from "./dto";
import { ConfigService } from "@nestjs/config";

const mockUsersService = () => ({
  create: jest.fn(),
});

const mockBasicAuthGuard = () => ({});

const mockConfigService = () => ({
  get: jest.fn(),
});

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useFactory: mockUsersService },
        { provide: BasicAuthGuard, useFactory: mockBasicAuthGuard },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(usersController).toBeDefined();
  });

  describe("create", () => {
    it("ユーザーを生成する", async () => {
      const createUserDto: CreateUserDto = {
        username: "testuser",
        password: "testpass",
      };

      const createdUser: User = {
        id: 1,
        username: "testuser",
        password: "testpass",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersService.create = jest.fn().mockResolvedValue(createdUser);

      const result = await usersController.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
