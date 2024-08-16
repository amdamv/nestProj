import { UsersController } from "./users.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn((dto) => {
      const { ...examples } = {
        id: Date.now(),
        ...dto.data,
      };
      return examples;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should create a user", () => {
    expect(
      controller.createUser({
        fullName: "Maff",
        email: "maff@gmail.com",
        password: "password123",
        description: "Test user",
      }),
    ).toEqual({
      id: expect.any(Number),
      fullName: "Maff",
      email: "maff@gmail.com",
      password: "password123",
      description: "Test user",
    });
    expect(mockUserService.create).toHaveBeenCalledWith({
      fullName: "Maff",
      email: "maff@gmail.com",
      password: "password123",
      description: "Test user",
    });
  });
});
