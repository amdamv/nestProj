import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { UserEntity } from "../../../../Libraries/entity/user.entity";
import { SignInDto } from "../users/dto/signIn.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiCreatedResponse({
    description: "User has been registered successfully",
    type: UserEntity,
  })
  @ApiBadRequestResponse({ description: "User can not register, try again!" })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: SignInDto) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    if (!token) {
      return { message: "Invalid credentials" };
    }
    return { accessToken: token };
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
