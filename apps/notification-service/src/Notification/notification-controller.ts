import { BadRequestException, Controller, Logger } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class NotificationController {
  private logger = new Logger("NotificationController");
  constructor(public notificationGateway: NotificationGateway) {}

  @MessagePattern({ cmd: "transactionComplete" })
  async handleTransactionComplete(data: {
    toUserId: string;
    fromUserId: string;
    amount: number;
    message: string;
  }): Promise<void> {
    const { toUserId, fromUserId, amount, message } = data;

    try {
      this.logger.log(
        `Received transactionComplete event for user ${toUserId}`,
      );
      await this.notificationGateway.sendNotification(
        toUserId,
        `You have received ${amount} from user ${fromUserId}. ${message}`,
      );
      this.logger.log(`Notification sent successfully to user ${toUserId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${toUserId}: ${error.message}`,
      );
      throw new BadRequestException(
        `Unable to send notification: ${error.message}`,
      );
    }
  }
}
