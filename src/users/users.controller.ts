import { UserEntity } from "src/users/entity/user.entity";
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
import { PaginationQueryDto } from "../users/dto/paginationQuery.dto";
import { CacheTTL } from "@nestjs/common/cache";
import { CacheInterceptor, CacheKey } from "@nestjs/cache-manager";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  private logger = new Logger("UsersController");
  constructor(private readonly usersService: UsersService) {}

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

  @Get(":id")
  @UseInterceptors(CacheInterceptor)
  @CacheKey("AllUsersCache")
  @CacheTTL(30) // override TTL to 30 seconds
  @Get()
  async getAllUsers(@Query() query: PaginationQueryDto) {
    const options = { page: query.page, limit: query.limit };
    return this.usersService.paginate(options);
  }

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
