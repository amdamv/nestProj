import { Module } from "@nestjs/common";
import { NotificationModule } from "./Notification/notification.module";
import { AuthNotificationService } from "./auth/auth-notification.service";
import { AuthNotificatioModule } from "./auth/auth-notificatio.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [NotificationModule, AuthNotificatioModule],
  providers: [AuthNotificationService, JwtService],
  exports: [AuthNotificationService],
})
export class AppModule {}
