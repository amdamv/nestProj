import { UserEntity } from "../../../../../Libraries/entity/user.entity";

export interface AccessTokenPayload {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  sub: any;
  id: string;
  fullName: string;
  description: UserEntity | string | number;
}
