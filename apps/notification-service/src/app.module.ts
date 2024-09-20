import { Module } from "@nestjs/common";
import { NotificationModule } from "./Notification/notification.module";
import { UsersModule } from "../../user/src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../../Libraries/entity/user.entity";

@Module({
  imports: [
    NotificationModule,
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AppModule {}
