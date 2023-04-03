import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BasicAuthGuard implements CanActivate {
  username: string;
  password: string;

  constructor(private readonly configService: ConfigService) {
    this.username = configService.get<string>("BASIC_AUTH_USERNAME");
    this.password = configService.get<string>("BASIC_AUTH_PASSWORD");
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("this.username", this.username);
    console.log("this.password", this.password);
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      response.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
      response.status(401).send({ message: "Unauthorized" });
      return false;
    }

    const [scheme, credentials] = authorizationHeader.split(" ");

    if (scheme !== "Basic") {
      response.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
      response.status(401).send({ message: "Unauthorized" });
      return false;
    }

    const [username, password] = credentials.split(":");

    const isAuthenticated =
      username === this.username && password === this.password;

    if (!isAuthenticated) {
      response.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
      response.status(401).send({ message: "Unauthorized" });
    }

    return isAuthenticated;
  }
}
