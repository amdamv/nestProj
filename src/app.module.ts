import { Module } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MypageModule } from "./users/userInfo/mypage.module";
import { S3Module } from "./providers/files/s3/s3.module";
import { S3Controller } from "./providers/files/s3/s3.controller";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResetBalanceModule } from "./users/reset-balance/reset-balance.module";
import { BullModule } from "@nestjs/bull";
import * as process from "node:process";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: "postgres",
          host: "localhost",
          port: 5430,
          password: "123123123",
          username: "nestjs_user",
          entities: [__dirname + "/**/*.entity{.js, .ts}"],
          database: "nestjs_main",
          synchronize: true,
          logging: true,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error("Invalid options passed");
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: "localhost",
          port: 6379,
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
    AuthModule,
    UsersModule,
    MypageModule,
    S3Module,
    ResetBalanceModule,
  ],
  controllers: [S3Controller],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
