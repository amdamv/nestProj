import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
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
    BullModule.registerQueue({
      name: "Balance",
    }),
    UsersModule,
  ],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
