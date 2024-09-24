import { Module } from "@nestjs/common";
import { NotificationModule } from "./Notification/notification.module";
import { AuthNotificationService } from "./auth/auth-notification.service";
import { AuthNotificatioModule } from "./auth/auth-notificatio.module";
import { JwtService } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    NotificationModule,
    AuthNotificatioModule,

    ClientsModule.register([
      {
        name: "NOTIFICATION_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
    ]),
  ],
  providers: [AuthNotificationService, JwtService],
})
export class AppModule {}
