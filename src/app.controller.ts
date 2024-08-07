import { UserEntity } from "src/users/entity/user.entity";
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { AccessTokenPayload } from "./auth/interfaces/jwt.token.payload.interface";
import { Request } from "@nestjs/common";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Request() req): Promise<string> {
    const accessTokenPayload: AccessTokenPayload =
      req.UserEntity as AccessTokenPayload;
    return await this.appService.getHello(accessTokenPayload.id);
  }
}
