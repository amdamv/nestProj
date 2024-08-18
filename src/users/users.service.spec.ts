import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

describe("UsersService", () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    jest.mock("typeorm-transactional", () => ({
      Transactional: () => () => ({}),
    }));

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(UserEntity),
            useClass: Repository, // Вы можете замокать методы репозитория, если это нужно
          },
          {
            provide: CACHE_MANAGER,
            useValue: {
              // Замокированные методы кеша, если это нужно
              get: jest.fn(),
              set: jest.fn(),
              del: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<UsersService>(UsersService);
      repository = module.get<Repository<UserEntity>>(
        getRepositoryToken(UserEntity),
      );
    });

    it("should create a new user", async () => {
      const userDto = {
        fullName: "Example",
        email: "name@example.com",
        password: "testtest",
        description: "test",
      };

      jest.spyOn(repository, "save").mockResolvedValue({
        id: 1,
        ...userDto,
      } as UserEntity);

      const user = await service.createUser(userDto);

      expect(user).toHaveProperty("id");
      expect(userDto.fullName).toBe("John");
      expect(userDto.email).toBe("name@example.com");
      expect(userDto.description).toBe("test");
      expect(userDto.password).toBe("testtest");
    });
  });
});
