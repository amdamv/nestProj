import { Test, TestingModule } from "@nestjs/testing";
import { ResetBalanceService } from "./reset-balance.service";

describe("ResetBalanceService", () => {
  let service: ResetBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetBalanceService],
    }).compile();

    service = module.get<ResetBalanceService>(ResetBalanceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
