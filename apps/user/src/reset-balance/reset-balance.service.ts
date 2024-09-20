import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import {
  ADD_RESET_BALANCES,
  RESET_BALANCE_QUEUE,
} from "../common/constants/name-queue.constant";
import { Logger } from "@nestjs/common";

@Injectable()
export class ResetBalanceService {
  private logger = new Logger("ResetBalanceService");
  constructor(
    @InjectQueue(RESET_BALANCE_QUEUE)
    private resetBalanceQueue: Queue,
  ) {}

  async resetAllBalances() {
    this.logger.debug("Triggering balance reset job");
    await this.resetBalanceQueue.add(ADD_RESET_BALANCES, {});
    this.logger.debug("Balance reset job added to the queue");
  }
}
