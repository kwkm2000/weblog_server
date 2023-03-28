import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/interface";
import { ValidateUser } from "./dto";

const mockUsersService = () => ({
  findOne: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  const user: User = {
    id: 1,
    username: "test",
    password: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("validateUser", () => {
    it("引数のユーザーが有効のときパスワードなしでユーザーを返す", async () => {
      const validateUser: ValidateUser = {
        username: "test",
        password: "123456",
      };

      usersService.findOne = jest.fn().mockResolvedValue(user);

      const result = await authService.validateUser(validateUser);
      expect(result).toEqual({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it("引数で与えられたユーザーが無効のときnullを返す", async () => {
      const validateUser: ValidateUser = {
        username: "test",
        password: "wrongpassword",
      };

      usersService.findOne = jest.fn().mockResolvedValue(user);

      const result = await authService.validateUser(validateUser);
      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("ログイン成功時にjwtとuserを返す", async () => {
      const jwt = "jwt.token";

      jwtService.sign = jest.fn().mockReturnValue(jwt);

      const result = await authService.login(user);
      expect(result).toEqual({ jwt, user });
    });
  });
});
