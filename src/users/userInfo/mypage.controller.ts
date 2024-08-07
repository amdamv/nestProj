import { MyPageService } from "./mypage.service";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "./user.decorator";
import { UserEntity } from "../entity/user.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("myPage")
export class MyPageController {
  constructor(private readonly MyPageService: MyPageService) {}

  @Get("my")
  async findMyInfoById(@User() user): Promise<UserEntity> {
    return await this.MyPageService.findMyInfoById(user.id);
  }
}
