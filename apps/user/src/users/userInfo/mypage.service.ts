import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../../../../Libraries/entity/user.entity";
import { UsersService } from "../users.service";

@Injectable()
export class MyPageService {
  constructor(private readonly userService: UsersService) {}

  async findMyInfoById(id: number): Promise<UserEntity> {
    return await this.userService.findOneById(id);
  }
}
