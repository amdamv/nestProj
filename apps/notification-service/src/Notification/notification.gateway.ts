import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { BadRequestException, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { AuthNotificationService } from "../auth/auth-notification.service";

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger();
  constructor(
    private readonly authNotificationService: AuthNotificationService,
  ) {}
  @WebSocketServer() io: Server;

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        this.logger.error("No authorization header");
        throw new BadRequestException("No authorization header");
      }

      client.data.userId = this.authNotificationService.verifyJwt(authHeader);

      client.join(client.data.userId);
      this.logger.log(`room-A is opened`);
    } catch (err) {
      this.logger.error(
        `Error validating token for client id: ${client.id} - ${err.message}`,
      );
      client.emit("error", "Unauthorized");
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage("ping")
  handleMessage(client: Socket, data: Socket) {
    this.logger.log(`Message received from client id ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: "pong",
      data: "Wrong data that will make the test fail",
    };
  }

  async sendNotification(userId: string) {
    this.io.to(userId).emit("notification", { data: "hello!" });
  }
}
