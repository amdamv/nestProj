import { Module } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";
import { NotificationController } from "./notification-controller";
import { AuthNotificatioModule } from "../auth/auth-notificatio.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    AuthNotificatioModule,
    ClientsModule.register([
      {
        name: "root",
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"],
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
