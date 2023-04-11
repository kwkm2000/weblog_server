import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "../auth/auth.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserResponse } from "./interface";

jest.mock("../auth/auth.service");
jest.mock("../auth/local-auth.guard");
jest.mock("../auth/jwt-auth.guard");

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, LocalAuthGuard, JwtAuthGuard],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("定義されているか", () => {
    expect(authController).toBeDefined();
  });

  describe("login", () => {
    it("authService.loginをreq.userを使って呼び出す", async () => {
      const req = { user: { username: "testuser", password: "testpass" } };
      const expectedResult: UserResponse = {
        jwt: "hoge",
        user: {
          id: 1,
          username: "test",
          password: "password",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest
        .spyOn(authService, "login")
        .mockImplementation(() => Promise.resolve(expectedResult));

      const result = await authController.login(req);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getProfile", () => {
    it("req.userが返ってくる", () => {
      const req = { user: { username: "testuser", id: 1 } };

      const result = authController.getProfile(req);

      expect(result).toEqual(req.user);
    });
  });
});
