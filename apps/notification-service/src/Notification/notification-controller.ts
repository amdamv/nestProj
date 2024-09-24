import { BadRequestException, Controller, Param, Post } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";

@Controller("notifications")
export class NotificationController {
  constructor(public notificationGateway: NotificationGateway) {}

  @Post(":userId")
  async sendNotification(@Param("userId") userId: string): Promise<void> {
    try {
      // Отправляем уведомление через WebSocket
      await this.notificationGateway.sendNotification(userId);
    } catch (error) {
      // Обработка возможных ошибок
      throw new BadRequestException(
        `Unable to send notification ${error.message()}`,
      );
    }
  }
}
