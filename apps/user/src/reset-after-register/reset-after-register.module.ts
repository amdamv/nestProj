import { Module } from "@nestjs/common";
import { ResetBalanceModule } from "../reset-balance/reset-balance.module";
import { ResetBalanceProcessor } from "./reset-balance.processor";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../../Libraries/entity/user.entity";

@Module({
  imports: [
    UsersModule,
    ResetBalanceModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [ResetBalanceProcessor],
  exports: [ResetBalanceProcessor],
})
export class ResetAfterRegisterModule {}
