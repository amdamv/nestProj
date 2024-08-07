import { Module } from "@nestjs/common";
import { MyPageController } from "./mypage.controller";
import { MyPageService } from "./mypage.service";
import { UsersModule } from "../users.module";

@Module({
  imports: [UsersModule],
  controllers: [MyPageController],
  providers: [MyPageService],
  exports: [MyPageService],
})
export class MypageModule {}
