import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class BasicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorizationHeader = request.headers.authorization;
    console.log("authorizationHeader", authorizationHeader);
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

    console.log("username", username);
    console.log("password", password);

    // ここでユーザー名とパスワードを検証します。データベースやハードコードされた値を使用できます。
    const isAuthenticated =
      username === "your-username" && password === "your-password";

    if (!isAuthenticated) {
      response.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
      response.status(401).send({ message: "Unauthorized" });
    }

    return isAuthenticated;
  }
}
