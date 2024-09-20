import { Module } from "@nestjs/common";
import { ResetBalanceController } from "./reset-balance.controller";
import { ResetBalanceService } from "./reset-balance.service";
import { BullModule } from "@nestjs/bull";
import { RESET_BALANCE_QUEUE } from "../common/constants/name-queue.constant";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../../Libraries/entity/user.entity";

@Module({
  imports: [
    BullModule.registerQueue({
      name: RESET_BALANCE_QUEUE,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [ResetBalanceController],
  providers: [ResetBalanceService],
  exports: [ResetBalanceService],
})
export class ResetBalanceModule {}
