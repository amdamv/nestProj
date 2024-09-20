import { Controller, Param, Post } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";

@Controller("notifications")
export class NotificationController {
  constructor(public notificationGateway: NotificationGateway) {}

  @Post(":userId")
  async sendNotification(@Param("userId") userId: string): Promise<void> {
    await this.notificationGateway.sendNotification(userId);
  }
}
