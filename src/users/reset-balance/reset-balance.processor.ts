import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UsersService } from "../users.service";
import { Logger } from "@nestjs/common";
import { RESET_BALANCE_QUEUE } from "../../common/constants/name-queue.constant";

@Processor(RESET_BALANCE_QUEUE)
export class ResetBalanceProcessor {
  private logger = new Logger("ResetBalanceProcessor");
  constructor(private readonly usersService: UsersService) {}

  @Process("add-reset-balances")
  async handleResetBalances(job: Job) {
    try {
      // Logic to reset all user balances
      this.logger.log(`Processing job ${job.id} to reset balances`);
      const users = await this.usersService.findAll();

      this.logger.log(`Resetting balances for ${users.length} users`);
      for (const user of users) {
        user.balance = 0;
        await this.usersService.updateUserBalance(user.id, user.balance);
      }
      this.logger.log(`Job ${job.id} completed successfully`);
    } catch (err) {
      this.logger.error("Error resetting balances:", err);
      await job.moveToFailed({ message: err.message }, true);
    }
  }
}
