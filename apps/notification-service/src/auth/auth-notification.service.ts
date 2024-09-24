import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthNotificationService {
  private readonly logger = new Logger();
  constructor(private readonly jwtService: JwtService) {}

  verifyJwt(token: string): number {
    try {
      if (!token) {
        throw new BadRequestException("Tocken not provided");
      }

      const decoded = this.jwtService.verify(token);

      return decoded.userId;
    } catch (err) {
      this.logger.error(`Invalid tocken ${err.message}`);
      throw new BadRequestException("Invalid tocken");
    }
  }
}
