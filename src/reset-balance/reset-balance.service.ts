import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { RESET_BALANCE_QUEUE } from "../common/constants/name-queue.constant";

@Injectable()
export class ResetBalanceService {
  constructor(
    @InjectQueue(RESET_BALANCE_QUEUE)
    private resetBalanceQueue: Queue,
  ) {}
  async resetAllBalances() {
    await this.resetBalanceQueue.add("reset-balances", {});
  }
}
