import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

jest.mock("typeorm-transactional", () => ({
  Transactional: () => () => ({}),
}));

describe("UsersService", () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            // Другие методы, которые использует ваш сервис
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it("should create a new user", async () => {
    const userDto = {
      fullName: "John",
      email: "name@example.com",
      password: "testtest",
      balance: 0,
      description: "test",
    };

    const savedUser = {
      id: 1,
      ...userDto,
      hashPassword: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;

    // Замокировать поведение метода create
    jest.spyOn(repository, "create").mockReturnValue(savedUser);

    // Замокировать поведение метода save
    jest.spyOn(repository, "save").mockResolvedValue(savedUser);

    const user = await service.createUser(userDto);

    // Проверяем, что пользователь был создан и сохранен
    expect(repository.create).toHaveBeenCalledWith(userDto);
    expect(repository.save).toHaveBeenCalledWith(savedUser);
    expect(user).toEqual(savedUser);
  });
});
