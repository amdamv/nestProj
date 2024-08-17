import { UsersController } from "./users.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UsersController", () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUserService },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("create => should create a user", async () => {
    // arrange
    const createUserDto = {
      fullName: "Maff",
      email: "maff@gmail.com",
      password: "password123",
      description: "Test user",
    } as CreateUserDto;

    const user = {
      id: Date.now(),
      fullName: "Maff",
      email: "maff@gmail.com",
      password: "password123",
      description: "Test user",
    } as UserEntity;

    jest.spyOn(mockUserService, "create").mockReturnValue(user);

    const result = await controller.createUser(createUserDto);

    expect(mockUserService.create).toBeCalled();
    expect(mockUserService.create).toBeCalledWith(createUserDto);

    expect(result).toEqual(user);
  });
});
