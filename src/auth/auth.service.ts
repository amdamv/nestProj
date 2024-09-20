import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserEntity } from "src/users/entity/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserEntity | null | string> {
    console.log(`Validating user: ${email}`);

    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(pass, user.password);

    console.log("isMatch");
    console.log(isMatch);

    if (user && isMatch) {
      const { password, ...result } = user;
      console.log(`User validated: ${email}`);
      return password + " " + result;
    }

    console.log(`User validation failed: ${email}`);

    return null;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: UserEntity }> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      console.log("User signed in");
      const token = this.jwtService.sign(payload);

      const userInfo = await this.usersService.findOneById(user.id);
      return {
        access_token: token,
        user: userInfo,
      };
    }
    console.log(`User validation failed: ${email}`);
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser({
      ...createUserDto,
    });
    const { password, ...result } = newUser;
    return password + " " + result;
  }
}
