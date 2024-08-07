import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    console.log(`Authenticating user: ${email}`);

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      console.log(`Authentication failed for user: ${email}`);
      throw new UnauthorizedException();
    }

    console.log(`User authenticated: ${email}`);

    return user;
  }
}
