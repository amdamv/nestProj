import { Controller, Logger, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ResetBalanceService } from "./reset-balance.service";

@UseGuards(JwtAuthGuard)
@Controller("reset-balance")
export class ResetBalanceController {
  private logger = new Logger("ResetBalanceController");
  constructor(private readonly resetBalanceService: ResetBalanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post("reset")
  async triggerBalanceReset() {
    this.logger.debug("Triggering balance reset job");
    await this.resetBalanceService.resetAllBalances();
    this.logger.debug("Balance reset job added to the queue");
  }
}
