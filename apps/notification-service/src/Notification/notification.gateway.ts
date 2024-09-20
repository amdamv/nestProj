import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { AuthService } from "../../../user/src/auth/auth.service";

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger();
  @WebSocketServer() io: Server;
  constructor(private readonly authService: AuthService) {}

  afterInit() {
    this.logger.log("Initialized");
  }

  async handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    try {
      const token = client.handshake.auth.token; // Извлекаем JWT токен
      const user = await this.authService.validateToken(token); // Проверяем токен

      if (!user) {
        this.logger.error(`Invalid token for client id: ${client.id}`);
        client.disconnect();
        return;
      }

      const userId = user.id;
      client.join(`room-${userId}`);
      this.logger.log(`Client id: ${client.id} joined room: room-${userId}`);
    } catch {
      this.logger.error(`Error validating token for client id: ${client.id}`);
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
