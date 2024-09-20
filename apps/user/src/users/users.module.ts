import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../../Libraries/entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResetBalanceModule } from "../reset-balance/reset-balance.module";
@Module({
  imports: [
    ResetBalanceModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "60m" },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (
        configService: ConfigService,
      ): Promise<CacheModule> => {
        return {
          store: redisStore,
          name: "redis-wsbe",
          host: "localhost",
          port: configService.get<string>("REDIS_PORT"),
          password: configService.get<string>("REDIS_PASSWORD"),
          ttl: 60,
          max: 100,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
