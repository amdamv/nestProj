import { UserEntity } from "../../../../Libraries/entity/user.entity";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  UseInterceptors,
  Logger,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./userInfo/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PaginationQueryDto } from "./dto/paginationQuery.dto";
import { CacheTTL } from "@nestjs/common/cache";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";
import { ResetBalanceService } from "../reset-balance/reset-balance.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  private logger = new Logger("UsersController");
  constructor(
    private readonly usersService: UsersService,
    private readonly resetBalanceService: ResetBalanceService,
  ) {}

  @Post("resequence")
  async resequenceIds(): Promise<{ success: boolean; message: string }> {
    await this.usersService.resequenceIds();
    return {
      success: true,
      message: "User IDs resequenced successfully",
    };
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      await this.resetBalanceService.resetAllBalances();
      await this.usersService.createUser(createUserDto);
      return {
        success: true,
        message: "User created successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get("my")
  async findMyInfo(@User() user): Promise<UserEntity> {
    this.logger.log(user);
    return await this.usersService.findMyInfo(Number(user.id));
  }

  @Get()
  async findAll() {
    try {
      const data = await this.usersService.findAll();
      return {
        success: true,
        data,
        message: "Users Fetched Successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(":id")
  @UseInterceptors(CacheInterceptor)
  @CacheKey("UserCache")
  @CacheTTL(30) // override TTL to 30 seconds
  await(@Param("id", ParseIntPipe) id: number) {
    this.logger.log("UserCache");
    try {
      const data = this.usersService.findOneById(Number(id));
      return {
        success: true,
        data,
        message: "User Fetched Successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  async getAllUsers(@Query() query: PaginationQueryDto) {
    const options = { page: query.page, limit: query.limit };
    return this.usersService.paginate(options);
  }

  @Patch("transfer")
  async transferBalance(
    @Body("fromUserId") fromUserId: number,
    @Body("toUserId") toUserId: number,
    @Body("amount") amount: string, // amount как строка
  ) {
    await this.usersService.transferBalance(fromUserId, toUserId, amount);
    return { message: "Transfer successful" };
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey("updateCache")
  @CacheTTL(30) // override TTL to 30 seconds
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      await this.usersService.update(Number(id), updateUserDto);
      return {
        success: true,
        message: "User Updated Successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.usersService.delete(Number(id));
      return {
        success: true,
        message: "User Deleted Successfuly",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
