import { Module } from "@nestjs/common";
import { AuthNotificationService } from "./auth-notification.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [AuthNotificationService, JwtService],
  exports: [AuthNotificationService],
})
export class AuthNotificatioModule {}
