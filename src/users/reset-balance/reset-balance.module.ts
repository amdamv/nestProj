import { Module } from "@nestjs/common";
import { ResetBalanceController } from "./reset-balance.controller";
import { ResetBalanceProcessor } from "./reset-balance.processor";
import { ResetBalanceService } from "./reset-balance.service";
import { BullModule } from "@nestjs/bull";
import { UsersModule } from "../users.module";
import { RESET_BALANCE_QUEUE } from "../../common/constants/name-queue.constant";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";

@Module({
  imports: [
    UsersModule,
    BullModule.registerQueue({
      name: RESET_BALANCE_QUEUE,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [ResetBalanceController],
  providers: [ResetBalanceProcessor, ResetBalanceService],
  exports: [ResetBalanceService],
})
export class ResetBalanceModule {}
