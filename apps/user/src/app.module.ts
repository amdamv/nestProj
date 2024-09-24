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
import { BullModule } from "@nestjs/bull";
import * as process from "node:process";
import { ResetBalanceModule } from "./reset-balance/reset-balance.module";
import { ResetAfterRegisterModule } from "./reset-after-register/reset-after-register.module";
import { UserEntity } from "../../../Libraries/entity/user.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "NOTIFICATION_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: "postgres",
          host: "localhost",
          port: 5430,
          password: "123123123",
          username: "nestjs_user",
          entities: [UserEntity],
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
    ResetAfterRegisterModule,
    ResetBalanceModule,
    AuthModule,
    UsersModule,
    MypageModule,
    S3Module,
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
