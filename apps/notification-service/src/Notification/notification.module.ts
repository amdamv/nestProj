import { Module } from "@nestjs/common";
import { NotificationGateway } from "./notification.gateway";
import { NotificationController } from "./notification-controller";
import { AuthModule } from "../../../user/src/auth/auth.module";
import { UsersModule } from "../../../user/src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../../Libraries/entity/user.entity";

@Module({
  imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [NotificationController],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
