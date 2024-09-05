import { Test, TestingModule } from "@nestjs/testing";
import { ResetBalanceController } from "./reset-balance.controller";

describe("ResetBalanceController", () => {
  let controller: ResetBalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetBalanceController],
    }).compile();

    controller = module.get<ResetBalanceController>(ResetBalanceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
