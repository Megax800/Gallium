import { add } from "../../src/user/user.controller";
import { setORM } from "../../shared/db/orm";
import { jest } from "@jest/globals";

describe("User Controller (unit)", () => {
  it("should return 400 if email exists", async () => {
    const mockUser = {
      nickname: "testDude",
      firstname: "John",
      lastname: "Marlow",
      email: "test@test.com",
      passwd: "12345678",
    };

    const mockEM = {
      find: jest.fn<() => Promise<any>>().mockResolvedValue([{ id: 1 }]),

      create: jest.fn().mockReturnValue(mockUser),

      flush: jest.fn(),
    };

    const mockORM = {
      em: {
        fork: jest.fn().mockReturnValue(mockEM),
      },
    };

    setORM(mockORM as any);

    const req = {
      body: {
        sanitizeInput: mockUser,
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await add(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
