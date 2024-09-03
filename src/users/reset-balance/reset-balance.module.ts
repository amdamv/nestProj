import { Module } from "@nestjs/common";
import { ResetBalanceController } from "./reset-balance.controller";
import { ResetBalanceService } from "./reset-balance.service";
import { BullModule } from "@nestjs/bull";
import { ResetBalanceProcessor } from "./reset-balance.processor";
import { UsersModule } from "../users.module";
import { RESET_BALANCE_QUEUE } from "../../common/constants/name-queue.constant";

@Module({
  imports: [
    UsersModule,
    BullModule.registerQueue({
      name: RESET_BALANCE_QUEUE,
    }),
  ],
  controllers: [ResetBalanceController],
  providers: [ResetBalanceService, ResetBalanceProcessor],
  exports: [ResetBalanceService],
})
export class ResetBalanceModule {}
