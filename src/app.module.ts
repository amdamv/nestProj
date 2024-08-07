import { MyPageService } from "./users/userInfo/mypage.service";
import { MyPageController } from "./users/userInfo/mypage.controller";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/entity/user.entity";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MypageModule } from "./users/userInfo/mypage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5430,
      password: "123123123",
      username: "nestjs_user",
      entities: [__dirname + "/**/*.entity{.js, .ts}"],
      database: "nestjs_main",
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    MypageModule,
  ],
  controllers: [MyPageController, AppController],
  providers: [MyPageService, AppService],
})
export class AppModule {}
