import { JwtService } from "@nestjs/jwt";
import { HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user: UserEntity = this.userRepository.create({
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: createUserDto.password,
        description: createUserDto.description,
      });

      console.log("createUserDto.password");
      console.log(createUserDto.password);

      console.log("user.password");
      console.log(user.password);

      return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<UserEntity> {
    const userData = await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new HttpException("User Not Found", 404);
    }
    return userData;
  }

  async findOneByName(fullName: string): Promise<UserEntity | undefined> {
    const userData = await this.userRepository.findOneBy({ fullName });
    if (!userData) {
      throw new HttpException("User Not Found", 404);
    }
    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOneById(id);
    if (!existingUser) {
      throw new HttpException("User Not Found", 404);
    }
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const existingUser = await this.findOneById(id);
    if (!existingUser) {
      throw new HttpException("User Not Found", 404);
    }

    await this.userRepository.remove(existingUser);
  }

  async findMyInfo(id: number): Promise<UserEntity> {
    return await this.findOneById(id);
  }

  async resequenceIds(): Promise<void> {
    const users = await this.userRepository.find();
    await this.userRepository.clear();

    for (let i = 0; i < users.length; i++) {
      await this.userRepository.save({
        ...users[i],
        id: i + 1,
      });
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder("users");
    queryBuilder.orderBy("user_id.id", "ASC");
    return paginate<UserEntity>(queryBuilder, options);
  }
}
