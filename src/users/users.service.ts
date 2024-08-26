import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Logger,
} from "@nestjs/common";
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
import { Transactional } from "typeorm-transactional";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

@Injectable()
export class UsersService {
  private logger = new Logger("UsersService");
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  @Transactional()
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user: UserEntity = this.userRepository.create({
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: createUserDto.password,
        description: createUserDto.description,
        balance: createUserDto.balance,
      });
      this.logger.log("createUserDto.password");
      this.logger.log(createUserDto.password);

      this.logger.log("user.password");
      this.logger.log(user.password);

      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<UserEntity> {
    const userData = await this.userRepository.findOneBy({ id });

    await this.cacheService.set(id.toString(), userData);
    const cachedData = await this.cacheService.get(id.toString());
    this.logger.log("data set to cache", cachedData);

    if (!userData) {
      throw new NotFoundException("User Not Found");
    }
    return userData;
  }

  @Transactional()
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOneById(id);
    if (!existingUser) {
      throw new NotFoundException("User not found for updating");
    }
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  @Transactional()
  async transferBalance(
    fromUserId: number,
    toUserId: number,
    amount: number,
  ): Promise<void> {
    if (amount <= 0) {
      throw new BadRequestException("Amount must be greater than zero");
    }

    // Поиск пользователей по ID
    const fromUser = await this.userRepository.findOne({
      where: { id: fromUserId },
    });
    const toUser = await this.userRepository.findOne({
      where: { id: toUserId },
    });

    if (!fromUser || !toUser) {
      throw new NotFoundException("One or both users not found");
    }

    // Проверка достаточного баланса
    if (fromUser.balance < amount) {
      throw new BadRequestException("Insufficient balance");
    }

    // Обновляем балансы
    fromUser.balance -= amount;
    toUser.balance += amount;

    // Сохраняем изменения в базе данных
    await this.userRepository.save(fromUser);
    await this.userRepository.save(toUser);
  }

  async delete(id: number): Promise<void> {
    const existingUser = await this.findOneById(id);
    if (!existingUser) {
      throw new NotFoundException("User not found for deleting");
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
