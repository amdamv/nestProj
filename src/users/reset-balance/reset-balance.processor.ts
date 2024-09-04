import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from "@nestjs/common";
import { RESET_BALANCE_QUEUE } from "../../common/constants/name-queue.constant";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";

@Processor(RESET_BALANCE_QUEUE)
export class ResetBalanceProcessor {
  private logger = new Logger("ResetBalanceProcessor");
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Process("add-reset-balances")
  async resetBalance(job: Job) {
    this.logger.log(`Processing reset balance job with id: ${job.id}`);
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ balance: 0 })
      .execute();
    this.logger.log(`Reset balance job has been processed with id: ${job.id}`);
  }
}
