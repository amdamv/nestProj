import { IsDecimal, IsNotEmpty, IsNumberString } from "class-validator";

export class TransferBalanceDto {
  @IsNotEmpty()
  fromUserId: number;

  @IsNotEmpty()
  toUserId: number;

  @IsDecimal()
  @IsNumberString()
  amount: number;
}
