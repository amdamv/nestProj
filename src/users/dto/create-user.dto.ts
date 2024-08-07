import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'Maff Akhmedov',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'maff.akh@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6, { message: "Password must be more than 6 characters" })
  password: string;

  @ApiProperty({
    description: 'User description',
    example: 'This is a sample user',
  })
  @IsOptional()
  description: string;
}
