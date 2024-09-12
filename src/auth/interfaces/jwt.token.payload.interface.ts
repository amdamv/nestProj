import { UserEntity } from "../../users/entity/user.entity";

export interface AccessTokenPayload {
  sub: UserEntity | string | number;
  id: string;
  fullName: string;
  description: UserEntity | string | number;
}
