import { Module } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";
import { NotificationController } from "./notification-controller";
import { AuthNotificatioModule } from "../auth/auth-notificatio.module";

@Module({
  imports: [AuthNotificatioModule],
  controllers: [NotificationController],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
