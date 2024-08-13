import { MyPageService } from "./users/userInfo/mypage.service";
import { MyPageController } from "./users/userInfo/mypage.controller";
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";

import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MypageModule } from "./users/userInfo/mypage.module";
import { S3Module } from "./providers/files/s3/s3.module";
import { S3Controller } from "./providers/files/s3/s3.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
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
    S3Module,
  ],
  controllers: [MyPageController, S3Controller],
  providers: [MyPageService],
})
export class AppModule {}
