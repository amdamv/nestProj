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
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./userInfo/user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PaginationQueryDto } from "src/users/dto/paginationQuery.dto";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
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
    console.log(user);
    console.log(user);
    console.log(user);
    console.log(user);
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
  async findOneById(@Param("id", ParseIntPipe) id: number) {
    try {
      const data = await this.usersService.findOneById(Number(id));
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

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      await this.usersService.update(Number(id), updateUserDto);
        console.log('test')
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
